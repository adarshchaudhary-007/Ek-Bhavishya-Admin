"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
    fallbackUrl?: string
    className?: string
}

export function BackButton({ fallbackUrl = "/admin", className }: BackButtonProps) {
    const router = useRouter()

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push(fallbackUrl)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={className}
        >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
        </Button>
    )
}
