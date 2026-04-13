"use client"

import { useState, useMemo } from "react"
import { MarathonCard, MarathonData } from "@/components/marathon-card"
import { RegionFilter } from "@/components/region-filter"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// 샘플 데이터
const sampleMarathons: MarathonData[] = [
  {
    id: "1",
    title: "2026 서울국제마라톤",
    date: "2026년 5월 15일",
    location: "서울 광화문광장",
    region: "서울",
    distance: ["풀코스", "하프", "10km"],
    participants: 15000,
    maxParticipants: 20000,
    status: "접수중",
  },
  {
    id: "2",
    title: "부산 해운대 마라톤 대회",
    date: "2026년 6월 1일",
    location: "부산 해운대해수욕장",
    region: "부산",
    distance: ["하프", "10km", "5km"],
    participants: 5000,
    maxParticipants: 8000,
    status: "접수중",
  },
  {
    id: "3",
    title: "제주 한라산 트레일런",
    date: "2026년 6월 20일",
    location: "제주 한라산 국립공원",
    region: "제주",
    distance: ["50km", "30km", "10km"],
    participants: 1200,
    maxParticipants: 1500,
    status: "접수예정",
  },
  {
    id: "4",
    title: "경기도 평화누리길 마라톤",
    date: "2026년 5월 25일",
    location: "경기도 파주시",
    region: "경기",
    distance: ["하프", "10km"],
    participants: 3000,
    maxParticipants: 3000,
    status: "접수마감",
  },
  {
    id: "5",
    title: "대구 달성 벚꽃 마라톤",
    date: "2026년 4월 10일",
    location: "대구 달성공원",
    region: "대구",
    distance: ["10km", "5km"],
    participants: 2500,
    maxParticipants: 4000,
    status: "접수중",
  },
  {
    id: "6",
    title: "강원 춘천 호반마라톤",
    date: "2026년 7월 5일",
    location: "강원도 춘천시 의암호",
    region: "강원",
    distance: ["풀코스", "하프", "10km"],
    participants: 800,
    maxParticipants: 5000,
    status: "접수예정",
  },
  {
    id: "7",
    title: "인천 송도 국제마라톤",
    date: "2026년 5월 30일",
    location: "인천 송도센트럴파크",
    region: "인천",
    distance: ["하프", "10km", "5km"],
    participants: 4200,
    maxParticipants: 6000,
    status: "접수중",
  },
  {
    id: "8",
    title: "전주 한옥마을 마라톤",
    date: "2026년 6월 15일",
    location: "전북 전주시 한옥마을",
    region: "전북",
    distance: ["10km", "5km"],
    participants: 1800,
    maxParticipants: 2000,
    status: "접수중",
  },
]

export function MarathonList() {
  const [selectedRegion, setSelectedRegion] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMarathons = useMemo(() => {
    return sampleMarathons.filter((marathon) => {
      const matchesRegion =
        selectedRegion === "전체" || marathon.region === selectedRegion
      const matchesSearch =
        marathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marathon.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesRegion && matchesSearch
    })
  }, [selectedRegion, searchQuery])

  return (
    <div className="flex flex-col gap-6">
      {/* 검색 및 필터 */}
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

      {/* 마라톤 목록 */}
      {filteredMarathons.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMarathons.map((marathon) => (
            <MarathonCard key={marathon.id} marathon={marathon} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <p className="text-lg font-medium text-muted-foreground">
            검색 결과가 없습니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            다른 지역이나 검색어를 시도해보세요
          </p>
        </div>
      )}
    </div>
  )
}
