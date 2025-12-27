'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StartDetoxButtonProps {
  userId: string
}

export function StartDetoxButton({ userId }: StartDetoxButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStart = async () => {
    setLoading(true)

    const { error } = await supabase
      .from('detox_sessions')
      .insert({
        user_id: userId,
        started_at: new Date().toISOString(),
        status: 'active',
      })

    if (error) {
      console.error('Error starting detox:', error)
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <Card className="max-w-lg mx-auto w-full">
      <CardHeader className="text-center pb-3 md:pb-6">
        <CardTitle className="text-xl md:text-2xl">Ready to Begin?</CardTitle>
        <CardDescription className="text-base md:text-sm">
          Starting your detox journey takes courage. We'll be here with you every step of the way.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={loading}
          className="px-8 min-h-[44px] w-full md:w-auto text-base"
        >
          {loading ? 'Starting...' : 'Start My Detox'}
        </Button>
        <p className="text-sm md:text-sm text-slate-500 mt-4">
          This will start tracking your progress from this moment.
        </p>
      </CardContent>
    </Card>
  )
}

