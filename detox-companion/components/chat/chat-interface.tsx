'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/lib/types/database'
import { MessageBubble } from './message-bubble'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInterfaceProps {
  sessionId: string
  initialMessages: Message[]
}

export function ChatInterface({ sessionId, initialMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      user_id: '',
      session_id: sessionId,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const data = await response.json()

      const assistantMessage: Message = {
        id: `temp-${Date.now()}-assistant`,
        user_id: '',
        session_id: sessionId,
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 md:border">
      <div className="px-3 md:px-4 py-2 md:py-3 border-b border-slate-200 shrink-0">
        <h2 className="font-semibold text-slate-900 text-base md:text-lg">Chat with Your Companion</h2>
        <p className="text-sm md:text-base text-slate-500">I'm here to support you through this.</p>
      </div>

      <div className="flex-1 p-3 md:p-4 overflow-y-auto min-h-0" ref={scrollRef}>
        <div className="space-y-3 md:space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-base">
              <p>No messages yet. How are you feeling right now?</p>
            </div>
          )}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-4 py-3 text-slate-500 text-base">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 md:p-4 border-t border-slate-200 bg-white shrink-0">
        <div className="flex gap-2 md:gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[44px] md:min-h-[60px] max-h-[120px] resize-none text-base"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="self-end min-h-[44px] min-w-[80px] md:min-w-[100px] px-4 md:px-6 text-base md:text-sm"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

