"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, Menu, X } from "lucide-react"

export function Header() {
  // 임시 로그인 상태 (나중에 실제 인증으로 교체)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-xl font-bold text-foreground">달려라 마라톤</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            홈
          </Link>
          <Link
            href="/marathons"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            마라톤 일정
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            대회 등록
          </Link>
        </nav>

        {/* 데스크탑 인증 버튼 */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/mypage">
                  <User className="mr-2 h-4 w-4" />
                  마이페이지
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLoggedIn(false)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">회원가입</Link>
              </Button>
            </>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              홈
            </Link>
            <Link
              href="/marathons"
              className="text-sm font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              마라톤 일정
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              대회 등록
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-start">
                    <Link href="/mypage" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      마이페이지
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsLoggedIn(false)
                      setIsMobileMenuOpen(false)
                    }}
                    className="justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-start">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      로그인
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="justify-start">
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      회원가입
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
