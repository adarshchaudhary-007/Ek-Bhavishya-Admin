"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Search } from "lucide-react"
import { PlatformUser } from "@/types"

interface UserSearchInputProps {
    users: PlatformUser[]
    onFilteredUsersChange: (filteredUsers: PlatformUser[]) => void
    placeholder?: string
    className?: string
}

export function UserSearchInput({
    users,
    onFilteredUsersChange,
    placeholder = "Search by name, email, or phone...",
    className = ""
}: UserSearchInputProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

    // Debounce search term with 300ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Filter users based on debounced search term
    const filteredUsers = useMemo(() => {
        if (!debouncedSearchTerm.trim()) {
            return users
        }

        const searchLower = debouncedSearchTerm.toLowerCase().trim()

        return users.filter((user) => {
            const fullNameMatch = user.fullName?.toLowerCase().includes(searchLower)
            const emailMatch = user.email?.toLowerCase().includes(searchLower)
            const phoneMatch = user.phoneNumber?.includes(debouncedSearchTerm.trim())

            return fullNameMatch || emailMatch || phoneMatch
        })
    }, [users, debouncedSearchTerm])

    // Notify parent component when filtered users change
    useEffect(() => {
        onFilteredUsersChange(filteredUsers)
    }, [filteredUsers, onFilteredUsersChange])

    const handleClear = () => {
        setSearchTerm("")
        setDebouncedSearchTerm("")
    }

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-9"
            />
            {searchTerm && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
