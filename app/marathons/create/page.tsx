"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchWithAuth } from "@/lib/api-base"
import { ArrowLeft, Plus, X, Calendar, MapPin, Users, Trophy } from "lucide-react"

type Region = "SEOUL" | "GYEONGGI" | "INCHEON" | "BUSAN" | "DAEGU" | "DAEJEON" | "GWANGJU" | "ULSAN" | "SEJONG" | "GANGWON" | "CHUNGBUK" | "CHUNGNAM" | "JEONBUK" | "JEONNAM" | "GYEONGBUK" | "GYEONGNAM" | "JEJU"

interface CourseType {
  distance: string
  price: number
  maxParticipants: number
}

interface MarathonForm {
  title: string
  description: string
  region: Region | ""
  address: string
  marathonDate: string
  registrationStart: string
  registrationEnd: string
  courses: CourseType[]
}

const REGIONS: { value: Region; label: string }[] = [
  { value: "SEOUL", label: "서울" },
  { value: "GYEONGGI", label: "경기" },
  { value: "INCHEON", label: "인천" },
  { value: "BUSAN", label: "부산" },
  { value: "DAEGU", label: "대구" },
  { value: "DAEJEON", label: "대전" },
  { value: "GWANGJU", label: "광주" },
  { value: "ULSAN", label: "울산" },
  { value: "SEJONG", label: "세종" },
  { value: "GANGWON", label: "강원" },
  { value: "CHUNGBUK", label: "충북" },
  { value: "CHUNGNAM", label: "충남" },
  { value: "JEONBUK", label: "전북" },
  { value: "JEONNAM", label: "전남" },
  { value: "GYEONGBUK", label: "경북" },
  { value: "GYEONGNAM", label: "경남" },
  { value: "JEJU", label: "제주" },
]

const COURSE_DISTANCES = [
  { value: "5K", label: "5km" },
  { value: "10K", label: "10km" },
  { value: "HALF", label: "하프 (21.0975km)" },
  { value: "FULL", label: "풀코스 (42.195km)" },
]

export default function CreateMarathonPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<MarathonForm>({
    title: "",
    description: "",
    region: "",
    address: "",
    marathonDate: "",
    registrationStart: "",
    registrationEnd: "",
    courses: [{ distance: "", price: 0, maxParticipants: 0 }],
  })

  const addCourse = () => {
    if (form.courses.length < 4) {
      setForm({
        ...form,
        courses: [...form.courses, { distance: "", price: 0, maxParticipants: 0 }],
      })
    }
  }

  const removeCourse = (index: number) => {
    if (form.courses.length > 1) {
      setForm({
        ...form,
        courses: form.courses.filter((_, i) => i !== index),
      })
    }
  }

  const updateCourse = (index: number, field: keyof CourseType, value: string | number) => {
    const updatedCourses = [...form.courses]
    updatedCourses[index] = { ...updatedCourses[index], [field]: value }
    setForm({ ...form, courses: updatedCourses })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.title.trim()) {
      newErrors.title = "대회명을 입력해주세요"
    }

    if (!form.description.trim()) {
      newErrors.description = "대회 설명을 입력해주세요"
    }

    if (!form.region) {
      newErrors.region = "지역을 선택해주세요"
    }

    if (!form.address.trim()) {
      newErrors.address = "상세 주소를 입력해주세요"
    }

    if (!form.marathonDate) {
      newErrors.marathonDate = "대회 일시를 선택해주세요"
    }

    if (!form.registrationStart) {
      newErrors.registrationStart = "접수 시작일을 선택해주세요"
    }

    if (!form.registrationEnd) {
      newErrors.registrationEnd = "접수 마감일을 선택해주세요"
    }

    // 날짜 검증
    if (form.registrationStart && form.registrationEnd) {
      if (new Date(form.registrationStart) >= new Date(form.registrationEnd)) {
        newErrors.registrationEnd = "접수 마감일은 시작일 이후여야 합니다"
      }
    }

    if (form.registrationEnd && form.marathonDate) {
      if (new Date(form.registrationEnd) >= new Date(form.marathonDate)) {
        newErrors.marathonDate = "대회 일시는 접수 마감일 이후여야 합니다"
      }
    }

    // 코스 검증
    form.courses.forEach((course, index) => {
      if (!course.distance) {
        newErrors[`course_${index}_distance`] = "코스 거리를 선택해주세요"
      }
      if (course.price <= 0) {
        newErrors[`course_${index}_price`] = "참가비를 입력해주세요"
      }
      if (course.maxParticipants <= 0) {
        newErrors[`course_${index}_maxParticipants`] = "최대 참가자 수를 입력해주세요"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
  
    if (!validateForm()) return
  
    setIsLoading(true)
  
    setErrors({})
  
    try {
  
      const response = await fetchWithAuth("/api/v1/marathons", {
  
        method: "POST",
  
        headers: {
  
          "Content-Type": "application/json",
  
        },
  
        body: JSON.stringify({
  
          title: form.title,
  
          region: form.region,
          
          detailedAddress: form.address,
          
          eventDate: form.marathonDate,
  
          posterImageUrl: null,
  
          registrationStartAt: `${form.registrationStart}T00:00:00`,
  
          registrationEndAt: `${form.registrationEnd}T23:59:59`,
  
          courses: form.courses.map((course) => ({
  
            courseType: course.distance,
  
            price: course.price,
  
            capacity: course.maxParticipants,
  
          })),
  
        }),
  
      })
  
      const data = await response.json()
  
      if (!response.ok || data.code !== "SUCCESS") {
  
        setErrors({
  
          general: data.message || "대회 등록에 실패했습니다. 다시 시도해주세요.",
  
        })
  
        return
  
      }
  
      router.push("/marathons")
  
    } catch (error) {
  
      console.error("대회 등록 에러:", error)
  
      setErrors({
  
        general: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
  
      })
  
    } finally {
  
      setIsLoading(false)
  
    }
  
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* 뒤로가기 링크 */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Trophy className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">마라톤 대회 등록</CardTitle>
                <CardDescription>새로운 마라톤 대회를 등록하세요</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* 일반 에러 메시지 */}
              {errors.general && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              )}

              {/* 기본 정보 섹션 */}
              <div className="flex flex-col gap-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Trophy className="h-5 w-5 text-primary" />
                  기본 정보
                </h3>

                {/* 대회명 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">대회명</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="예: 2026 서울 벚꽃 마라톤"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* 대회 설명 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">대회 설명</Label>
                  <Textarea
                    id="description"
                    placeholder="대회에 대한 상세한 설명을 입력해주세요"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* 장소 정보 섹션 */}
              <div className="flex flex-col gap-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  장소 정보
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* 지역 */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="region">지역</Label>
                    <Select
                      value={form.region}
                      onValueChange={(value: Region) => setForm({ ...form, region: value })}
                    >
                      <SelectTrigger className={errors.region ? "border-destructive" : ""}>
                        <SelectValue placeholder="지역 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.region && (
                      <p className="text-sm text-destructive">{errors.region}</p>
                    )}
                  </div>

                  {/* 상세 주소 */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address">상세 주소</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="예: 여의도 한강공원"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 일정 정보 섹션 */}
              <div className="flex flex-col gap-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  일정 정보
                </h3>

                <div className="grid gap-4 sm:grid-cols-3">
                  {/* 접수 시작일 */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="registrationStart">접수 시작일</Label>
                    <Input
                      id="registrationStart"
                      type="date"
                      value={form.registrationStart}
                      onChange={(e) => setForm({ ...form, registrationStart: e.target.value })}
                      className={errors.registrationStart ? "border-destructive" : ""}
                    />
                    {errors.registrationStart && (
                      <p className="text-sm text-destructive">{errors.registrationStart}</p>
                    )}
                  </div>

                  {/* 접수 마감일 */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="registrationEnd">접수 마감일</Label>
                    <Input
                      id="registrationEnd"
                      type="date"
                      value={form.registrationEnd}
                      onChange={(e) => setForm({ ...form, registrationEnd: e.target.value })}
                      className={errors.registrationEnd ? "border-destructive" : ""}
                    />
                    {errors.registrationEnd && (
                      <p className="text-sm text-destructive">{errors.registrationEnd}</p>
                    )}
                  </div>

                  {/* 대회 일시 */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="marathonDate">대회 일시</Label>
                    <Input
                      id="marathonDate"
                      type="date"
                      value={form.marathonDate}
                      onChange={(e) => setForm({ ...form, marathonDate: e.target.value })}
                      className={errors.marathonDate ? "border-destructive" : ""}
                    />
                    {errors.marathonDate && (
                      <p className="text-sm text-destructive">{errors.marathonDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 코스 정보 섹션 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Users className="h-5 w-5 text-primary" />
                    코스 정보
                  </h3>
                  {form.courses.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCourse}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      코스 추가
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {form.courses.map((course, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg border border-border bg-card p-4"
                    >
                      {form.courses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCourse(index)}
                          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      <div className="grid gap-4 sm:grid-cols-3">
                        {/* 코스 거리 */}
                        <div className="flex flex-col gap-2">
                          <Label>코스 거리</Label>
                          <Select
                            value={course.distance}
                            onValueChange={(value) => updateCourse(index, "distance", value)}
                          >
                            <SelectTrigger
                              className={errors[`course_${index}_distance`] ? "border-destructive" : ""}
                            >
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {COURSE_DISTANCES.map((dist) => (
                                <SelectItem key={dist.value} value={dist.value}>
                                  {dist.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`course_${index}_distance`] && (
                            <p className="text-sm text-destructive">
                              {errors[`course_${index}_distance`]}
                            </p>
                          )}
                        </div>

                        {/* 참가비 */}
                        <div className="flex flex-col gap-2">
                          <Label>참가비 (원)</Label>
                          <Input
                            type="number"
                            placeholder="30000"
                            value={course.price || ""}
                            onChange={(e) =>
                              updateCourse(index, "price", parseInt(e.target.value) || 0)
                            }
                            className={errors[`course_${index}_price`] ? "border-destructive" : ""}
                          />
                          {errors[`course_${index}_price`] && (
                            <p className="text-sm text-destructive">
                              {errors[`course_${index}_price`]}
                            </p>
                          )}
                        </div>

                        {/* 최대 참가자 수 */}
                        <div className="flex flex-col gap-2">
                          <Label>최대 참가자 수</Label>
                          <Input
                            type="number"
                            placeholder="500"
                            value={course.maxParticipants || ""}
                            onChange={(e) =>
                              updateCourse(index, "maxParticipants", parseInt(e.target.value) || 0)
                            }
                            className={
                              errors[`course_${index}_maxParticipants`] ? "border-destructive" : ""
                            }
                          />
                          {errors[`course_${index}_maxParticipants`] && (
                            <p className="text-sm text-destructive">
                              {errors[`course_${index}_maxParticipants`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 등록 버튼 */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "등록 중..." : "대회 등록"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
