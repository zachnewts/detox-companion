import { Message } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-100 text-slate-900'
        )}
      >
        <p className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</p>
        <p
          className={cn(
            'text-xs md:text-xs mt-1.5',
            isUser ? 'text-indigo-200' : 'text-slate-400'
          )}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}

