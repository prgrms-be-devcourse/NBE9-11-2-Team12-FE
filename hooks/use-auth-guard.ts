"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/api-base"

interface ApiEnvelope<T> {
    code: string
    message?: string
    data?: T
}

interface MeRes {
    id: number
    email: string
    name: string
    role: string
    profileCompleted: boolean
}

export function useAuthGuard(requireFullProfile: boolean = false) {
    const router = useRouter()
    const [user, setUser] = useState<MeRes | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                    method: "GET",
                    credentials: "include",
                })

                if (!res.ok) {
                    router.replace("/login")
                    return
                }

                const json: ApiEnvelope<MeRes> = await res.json()

                if (json.code === "SUCCESS" && json.data) {
                    const me = json.data

                    if (requireFullProfile && !me.profileCompleted) {
                        router.replace("/complete-profile")
                        return
                    }

                    setUser(me)
                } else {
                    router.replace("/login")
                }
            } catch (e) {
                router.replace("/login")
            } finally {
                setIsLoading(false)
            }
        }

        void checkAuth()
    }, [router])

    return { user, isLoading }
}