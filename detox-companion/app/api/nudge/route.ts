import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

// Use service role for n8n webhook (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const NUDGE_SYSTEM_PROMPT = `You are generating a brief, supportive SMS message for someone going through opioid withdrawal.

GUIDELINES:
- Keep it SHORT (1-2 sentences max, under 160 characters ideal)
- Be warm and encouraging
- Reference where they are in the process (hour/day)
- Include a subtle call to action (check the app, take a breath, drink water)
- Never give medical advice
- Match the tone to where they are:
  - Early hours: Acknowledging, validating
  - Peak withdrawal (48-72h): Intensive support, "you can do this"
  - After peak: Celebrating progress, momentum building

DO NOT include:
- Emojis (SMS compatibility)
- Links (will be added separately)
- Medical recommendations
- Anything that could be triggering

Just output the message text, nothing else.`

export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, sessionId } = await request.json()

    // Get session info
    const { data: session } = await supabase
      .from('detox_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (!session || session.status !== 'active') {
      return NextResponse.json({ error: 'No active session' }, { status: 400 })
    }

    // Calculate current hour
    const startTime = new Date(session.started_at).getTime()
    const currentHour = Math.floor((Date.now() - startTime) / (1000 * 60 * 60))
    const currentDay = Math.floor(currentHour / 24) + 1

    // Get user's motivations
    const { data: motivations } = await supabase
      .from('motivations')
      .select('content')
      .eq('user_id', userId)

    // Get user's phone
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', userId)
      .single()

    if (!profile?.phone) {
      return NextResponse.json({ error: 'No phone number' }, { status: 400 })
    }

    // Generate personalized nudge with Claude
    const context = `
Current hour: ${currentHour}
Current day: ${currentDay}
User's motivations: ${motivations?.map(m => m.content).join('; ') || 'None recorded'}
`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: NUDGE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a supportive SMS nudge for this context:\n${context}`,
        },
      ],
    })

    const nudgeMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    // Log the check-in
    await supabase.from('check_ins').insert({
      user_id: userId,
      session_id: sessionId,
      hour_number: currentHour,
      message_sent: nudgeMessage,
    })

    return NextResponse.json({
      phone: profile.phone,
      message: nudgeMessage,
      hour: currentHour,
      day: currentDay,
    })
  } catch (error) {
    console.error('Nudge API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate nudge' },
      { status: 500 }
    )
  }
}

