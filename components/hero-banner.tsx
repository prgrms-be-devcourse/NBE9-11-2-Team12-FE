import { Button } from "@/components/ui/button"
import { ArrowRight, CalendarDays, Trophy } from "lucide-react"
import Link from "next/link"

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 sm:py-24">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-primary-foreground" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            전국 마라톤 대회를 한눈에
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base text-primary-foreground/80 sm:text-lg md:text-xl">
            대한민국 전역의 마라톤 대회 일정을 확인하고, 원하는 대회에 바로
            접수하세요. 풀코스부터 5km 펀런까지 다양한 대회가 기다리고 있습니다.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold"
              asChild
            >
              <Link href="/marathons">
                <CalendarDays className="mr-2 h-5 w-5" />
                대회 일정 보기
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/marathons/create">
                <Trophy className="mr-2 h-5 w-5" />
                대회 등록하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* 통계 */}
          <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">
                150+
              </span>
              <span className="mt-1 text-xs text-primary-foreground/70 sm:text-sm">
                등록된 대회
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">
                50만+
              </span>
              <span className="mt-1 text-xs text-primary-foreground/70 sm:text-sm">
                참가 신청자
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary-foreground sm:text-3xl md:text-4xl">
                17개
              </span>
              <span className="mt-1 text-xs text-primary-foreground/70 sm:text-sm">
                전국 시도
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
