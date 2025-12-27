'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MotivationFormProps {
  userId: string
}

export function MotivationForm({ userId }: MotivationFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    const { error } = await supabase.from('motivations').insert({
      user_id: userId,
      content: content.trim(),
      type: 'why',
    })

    if (!error) {
      setContent('')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Motivation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Why are you doing this? What do you want your life to look like? Who are you doing this for?"
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={!content.trim() || loading}>
            {loading ? 'Saving...' : 'Add Motivation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

