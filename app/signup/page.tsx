"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react"

type Gender = "MALE" | "FEMALE"
type Role = "PARTICIPANT" | "ORGANIZER"

interface SignupForm {
  email: string
  password: string
  passwordConfirm: string
  name: string
  phoneNumber: string
  gender: Gender | ""
  birth: string
  role: Role
}

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({})
  
  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phoneNumber: "",
    gender: "",
    birth: "",
    role: "PARTICIPANT",
  })

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupForm, string>> = {}

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다"
    }

    // 비밀번호 검증
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
    if (!form.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password = "영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다"
    }

    // 비밀번호 확인
    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호를 다시 입력해주세요"
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다"
    }

    // 이름 검증
    if (!form.name) {
      newErrors.name = "이름을 입력해주세요"
    } else if (form.name.length < 2) {
      newErrors.name = "이름은 2자 이상이어야 합니다"
    }

    // 전화번호 검증
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/
    if (!form.phoneNumber) {
      newErrors.phoneNumber = "전화번호를 입력해주세요"
    } else if (!phoneRegex.test(form.phoneNumber)) {
      newErrors.phoneNumber = "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)"
    }

    // 성별 검증
    if (!form.gender) {
      newErrors.gender = "성별을 선택해주세요"
    }

    // 생년월일 검증
    if (!form.birth) {
      newErrors.birth = "생년월일을 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setForm({ ...form, phoneNumber: formatted })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    // API 호출 시뮬레이션 (나중에 실제 API로 교체)
    const signupData = {
      email: form.email,
      password: form.password,
      name: form.name,
      phoneNumber: form.phoneNumber,
      gender: form.gender,
      birth: form.birth,
      role: form.role,
    }

    console.log("회원가입 데이터:", signupData)

    // 임시 딜레이 후 로그인 페이지로 이동
    setTimeout(() => {
      setIsLoading(false)
      router.push("/login?registered=true")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* 뒤로가기 링크 */}
        <div className="mb-6 w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">M</span>
              </div>
              <span className="text-2xl font-bold text-foreground">달려라 마라톤</span>
            </Link>
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              마라톤 대회 정보를 받아보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* 이메일 */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="passwordConfirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={form.passwordConfirm}
                    onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
                    className={errors.passwordConfirm ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <p className="text-sm text-destructive">{errors.passwordConfirm}</p>
                )}
              </div>

              {/* 이름 */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* 전화번호 */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phoneNumber">전화번호</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={form.phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  className={errors.phoneNumber ? "border-destructive" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                )}
              </div>

              {/* 성별 & 생년월일 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="gender">성별</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(value: Gender) => setForm({ ...form, gender: value })}
                  >
                    <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">남성</SelectItem>
                      <SelectItem value="FEMALE">여성</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-destructive">{errors.gender}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="birth">생년월일</Label>
                  <Input
                    id="birth"
                    type="date"
                    value={form.birth}
                    onChange={(e) => setForm({ ...form, birth: e.target.value })}
                    className={errors.birth ? "border-destructive" : ""}
                  />
                  {errors.birth && (
                    <p className="text-sm text-destructive">{errors.birth}</p>
                  )}
                </div>
              </div>

              {/* 회원 유형 */}
              <div className="flex flex-col gap-2">
                <Label>회원 유형</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "PARTICIPANT" })}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      form.role === "PARTICIPANT"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {form.role === "PARTICIPANT" && <Check className="h-4 w-4" />}
                    참가자
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "ORGANIZER" })}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      form.role === "ORGANIZER"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {form.role === "ORGANIZER" && <Check className="h-4 w-4" />}
                    주최자
                  </button>
                </div>
              </div>

              {/* 가입 버튼 */}
              <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>

              {/* 로그인 링크 */}
              <p className="text-center text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  로그인
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}