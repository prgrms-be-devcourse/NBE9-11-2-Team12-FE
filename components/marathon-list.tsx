"use client"

import { useEffect, useMemo, useState } from "react"
import { MarathonCard, MarathonData } from "@/components/marathon-card"
import { RegionFilter } from "@/components/region-filter"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { fetchMarathonList } from "@/lib/marathon-list"
import { marathonStatusToUi, formatRegion } from "@/lib/marathon-labels"

export function MarathonList() {
  const [selectedRegion, setSelectedRegion] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")
  const [marathons, setMarathons] = useState<MarathonData[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMarathonList()

        const mapped: MarathonData[] = data.map((m) => {
          const totalCapacity = (m.courses ?? []).reduce(
            (sum, c) => sum + c.capacity,
            0
          )
          const totalCurrent = (m.courses ?? []).reduce(
            (sum, c) => sum + c.currentCount,
            0
          )

          return {
            id: String(m.id),
            title: m.title,
            date: m.eventDate,
            location: formatRegion(m.region),
            region: formatRegion(m.region),
            distance: m.courses.map((c) => c.courseType),
            participants: totalCurrent,
            maxParticipants: totalCapacity,
            status: marathonStatusToUi(m.status),
          }
        })

        setMarathons(mapped)
      } catch (e) {
        console.error(e)
      }
    }

    load()
  }, [])

  const filteredMarathons = useMemo(() => {
    return marathons.filter((marathon) => {
      const matchesRegion =
        selectedRegion === "전체" || marathon.region === selectedRegion

      const matchesSearch =
        marathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marathon.location.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesRegion && matchesSearch
    })
  }, [marathons, selectedRegion, searchQuery])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="마라톤 대회명 또는 지역으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <RegionFilter
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMarathons.map((marathon) => (
          <MarathonCard key={marathon.id} marathon={marathon} />
        ))}
      </div>
    </div>
  )
}