import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are a compassionate, supportive companion helping someone through opioid withdrawal. Your role is to provide emotional support, practical guidance, and encouragement.

CRITICAL SAFETY GUIDELINES:
- You are NOT a doctor and cannot provide medical advice
- Never recommend specific medications or dosages
- If someone describes dangerous symptoms (seizures, severe dehydration, chest pain, difficulty breathing), immediately encourage them to seek emergency medical care
- Never encourage or enable continued substance use
- Always validate their courage in seeking recovery

YOUR APPROACH:
- Be warm, empathetic, and non-judgmental
- Acknowledge how difficult withdrawal is - don't minimize their experience
- Celebrate small wins and progress
- Remind them that symptoms are temporary and will improve
- Offer practical comfort suggestions (hydration, rest, breathing exercises, distraction)
- Reference their personal motivations for recovery when helpful
- Keep responses concise but caring - they may have low cognitive bandwidth

CONTEXT AWARENESS:
- You have access to their current detox hour and day
- You know their personal "why" statements and motivations
- Reference this context naturally to personalize support

Remember: You're a supportive presence, not a clinician. Your job is to help them get through each moment, one at a time.`

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, sessionId } = await request.json()

    // Get active session for context
    const { data: session } = await supabase
      .from('detox_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (!session) {
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
      .eq('user_id', user.id)

    // Get recent message history for context
    const { data: recentMessages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20)

    // Build context for Claude
    const contextInfo = `
CURRENT STATUS:
- Detox Hour: ${currentHour}
- Detox Day: ${currentDay}
- Session started: ${new Date(session.started_at).toLocaleString()}

USER'S MOTIVATIONS FOR RECOVERY:
${motivations?.map(m => `- "${m.content}"`).join('\n') || 'No motivations recorded yet.'}
`

    // Build message history for Claude
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...(recentMessages || []).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    // Save user message to database
    await supabase.from('messages').insert({
      user_id: user.id,
      session_id: sessionId,
      role: 'user',
      content: message,
    })

    // Call Claude API - using current model name
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + '\n\n' + contextInfo,
      messages,
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    // Save assistant message to database
    await supabase.from('messages').insert({
      user_id: user.id,
      session_id: sessionId,
      role: 'assistant',
      content: assistantMessage,
    })

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

