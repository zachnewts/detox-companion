import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Motivation } from '@/lib/types/database'

interface MotivationCardProps {
  motivations: Motivation[]
}

export function MotivationCard({ motivations }: MotivationCardProps) {
  if (motivations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Why</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-4">
            No motivations added yet. Add your reasons for recovery to see them here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Why</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {motivations.map((motivation) => (
            <li
              key={motivation.id}
              className="p-4 bg-amber-50 rounded-lg border border-amber-100"
            >
              <p className="text-amber-900 italic">"{motivation.content}"</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

