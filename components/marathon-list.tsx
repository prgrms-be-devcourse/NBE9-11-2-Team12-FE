"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { MarathonCard, MarathonData } from "@/components/marathon-card"
import { RegionFilter } from "@/components/region-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchMarathonList } from "@/lib/marathon-list"
import { marathonStatusToUi, formatRegion } from "@/lib/marathon-labels"

const PAGE_SIZE = 8 // 페이징할 페이지 개수 설정

export function MarathonList() {
  const [selectedRegion, setSelectedRegion] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")
  const [marathons, setMarathons] = useState<MarathonData[]>([])
  const [currentPage, setCurrentPage] = useState(0) 
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const load = useCallback(async (page: number) => {
    setIsLoading(true)
    try {
      const { content, pageInfo } = await fetchMarathonList(page, PAGE_SIZE)

      const mapped: MarathonData[] = content.map((m) => {
        const totalCapacity = (m.courses ?? []).reduce(
          (sum, c) => sum + c.capacity, 0
        )
        const totalCurrent = (m.courses ?? []).reduce(
          (sum, c) => sum + c.currentCount, 0
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
      setCurrentPage(pageInfo.page)
      setTotalPages(pageInfo.totalPages)
      setTotalElements(pageInfo.totalElements)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    load(currentPage)
  }, [currentPage, load])

  // 검색/필터 변경 시 첫 페이지로 리셋
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

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 페이지 버튼 범위 계산 (현재 페이지 기준 앞뒤 2개씩)
  const pageNumbers = useMemo(() => {
    const delta = 2
    const start = Math.max(0, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages])

  return (
    <div className="flex flex-col gap-6">
      {/* 검색 & 필터 */}
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

      {/* 결과 수 표시 */}
      <p className="text-sm text-muted-foreground">
        총 <span className="font-medium text-foreground">{totalElements}</span>개의 대회
      </p>

      {/* 카드 목록 */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMarathons.map((marathon) => (
            <MarathonCard key={marathon.id} marathon={marathon} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          {/* 이전 버튼 */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || isLoading}
            aria-label="이전 페이지"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* 첫 페이지 + 생략 */}
          {pageNumbers[0] > 0 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(0)}
                disabled={isLoading}
              >
                1
              </Button>
              {pageNumbers[0] > 1 && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
            </>
          )}

          {/* 페이지 번호들 */}
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
              disabled={isLoading}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page + 1} {/* UI는 1-based */}
            </Button>
          ))}

          {/* 마지막 페이지 + 생략 */}
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={isLoading}
              >
                {totalPages}
              </Button>
            </>
          )}

          {/* 다음 버튼 */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || isLoading}
            aria-label="다음 페이지"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}