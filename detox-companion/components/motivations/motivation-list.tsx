'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Motivation } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface MotivationListProps {
  motivations: Motivation[]
}

export function MotivationList({ motivations }: MotivationListProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('motivations')
      .delete()
      .eq('id', id)

    if (!error) {
      router.refresh()
    }
  }

  if (motivations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-slate-500">
          No motivations yet. Add your first one above.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {motivations.map((motivation) => (
        <Card key={motivation.id}>
          <CardContent className="py-4">
            <div className="flex items-start justify-between gap-4">
              <p className="text-slate-900 italic">"{motivation.content}"</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(motivation.id)}
                className="text-slate-400 hover:text-red-500 shrink-0"
              >
                Delete
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Added {new Date(motivation.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

