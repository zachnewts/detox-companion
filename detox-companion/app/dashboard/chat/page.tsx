import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get active session
  const { data: session } = await supabase
    .from('detox_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!session) {
    redirect('/dashboard')
  }

  // Get existing messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', session.id)
    .order('created_at', { ascending: true })

  return (
    <div className="h-[calc(100dvh-73px-64px)] md:h-[calc(100vh-140px)] w-full max-w-full overflow-hidden">
      <ChatInterface
        sessionId={session.id}
        initialMessages={messages || []}
      />
    </div>
  )
}

