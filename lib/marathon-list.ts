import { API_BASE_URL } from "@/lib/api-base"

export interface MarathonListItem {
  id: number
  title: string
  region: string
  eventDate: string
  status: string
  posterImageUrl?: string | null
  courses: {
    courseType: string
    capacity: number
    currentCount: number
  }[]
}

interface ApiEnvelope<T> {
  code: string
  message?: string
  data?: T
}

function isApiEnvelope(v: unknown): v is ApiEnvelope<unknown> {
  return (
    typeof v === "object" &&
    v !== null &&
    "code" in v
  )
}

export async function fetchMarathonList(): Promise<MarathonListItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/marathons`, {
    credentials: "include",
    cache: "no-store",
  })

  const json: any = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error("마라톤 목록 조회 실패")
  }

  if (json.code === "SUCCESS") {
    const content = json.data?.content ?? []
    return content.map((m: any) => ({
      ...m,
      courses: m.courses ?? [],
    }))
  }

  return []
}