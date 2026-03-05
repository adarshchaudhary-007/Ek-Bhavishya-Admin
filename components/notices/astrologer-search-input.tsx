"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

interface Astrologer {
    _id: string
    personalDetails: {
        name?: string
        email?: string
    }
}

interface AstrologerSearchInputProps {
    astrologers: Astrologer[]
    onFilteredAstrologersChange: (filtered: Astrologer[]) => void
}

export function AstrologerSearchInput({ astrologers, onFilteredAstrologersChange }: AstrologerSearchInputProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        
        if (!value.trim()) {
            onFilteredAstrologersChange(astrologers)
            return
        }

        const filtered = astrologers.filter((astrologer) => {
            const name = astrologer.personalDetails?.name?.toLowerCase() || ""
            const email = astrologer.personalDetails?.email?.toLowerCase() || ""
            const search = value.toLowerCase()
            
            return name.includes(search) || email.includes(search)
        })

        onFilteredAstrologersChange(filtered)
    }

    return (
        <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search astrologers by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
            />
        </div>
    )
}
