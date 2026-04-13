import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"

export interface MarathonData {
  id: string
  title: string
  date: string
  location: string
  region: string
  distance: string[]
  participants: number
  maxParticipants: number
  status: "접수중" | "접수예정" | "접수마감"
  imageUrl?: string
}

interface MarathonCardProps {
  marathon: MarathonData
}

export function MarathonCard({ marathon }: MarathonCardProps) {
  const statusColor = {
    "접수중": "bg-primary text-primary-foreground",
    "접수예정": "bg-accent text-accent-foreground",
    "접수마감": "bg-muted text-muted-foreground",
  }

  const remainingSpots = marathon.maxParticipants - marathon.participants
  const isFull = remainingSpots <= 0

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="relative p-0">
        <div className="relative h-40 overflow-hidden bg-secondary">
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
            <span className="text-4xl font-bold text-primary/30">
              {marathon.distance[0]}
            </span>
          </div>
          <Badge
            className={`absolute right-3 top-3 ${statusColor[marathon.status]}`}
          >
            {marathon.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {marathon.distance.map((dist) => (
            <Badge key={dist} variant="outline" className="text-xs">
              {dist}
            </Badge>
          ))}
        </div>
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary">
          {marathon.title}
        </h3>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{marathon.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{marathon.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {marathon.participants.toLocaleString()} / {marathon.maxParticipants.toLocaleString()}명
              {!isFull && (
                <span className="ml-1 text-primary">
                  (잔여 {remainingSpots.toLocaleString()}명)
                </span>
              )}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={marathon.status === "접수마감"}
          variant={marathon.status === "접수중" ? "default" : "secondary"}
        >
          {marathon.status === "접수중"
            ? "접수하기"
            : marathon.status === "접수예정"
              ? "상세보기"
              : "마감됨"}
        </Button>
      </CardFooter>
    </Card>
  )
}
