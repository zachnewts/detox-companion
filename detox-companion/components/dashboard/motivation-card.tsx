import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Motivation } from '@/lib/types/database'

interface MotivationCardProps {
  motivations: Motivation[]
}

export function MotivationCard({ motivations }: MotivationCardProps) {
  if (motivations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl">Your Why</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-4 text-base">
            No motivations added yet. Add your reasons for recovery to see them here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-lg md:text-xl">Your Why</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {motivations.map((motivation) => (
            <li
              key={motivation.id}
              className="p-4 bg-amber-50 rounded-lg border border-amber-100"
            >
              <p className="text-amber-900 italic text-base">"{motivation.content}"</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

