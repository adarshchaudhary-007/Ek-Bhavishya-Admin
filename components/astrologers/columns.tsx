"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { SuspendModal } from "./suspend-modal"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type Astrologer = {
    _id: string
    personalDetails: {
        name: string
        email: string
        phone: string
        experience: number
        languages: string[]
        skills: string[]
        pseudonym?: string
        profileImage?: string
    }
    ratings: {
        average: number
        count: number
        negativeReviewsCount: number
    }
    pricing: {
        call: number
        chat: number
        video: number
    }
    availability: {
        status: string
        currentStatus: string
        isCallAvailable: boolean
        isChatAvailable: boolean
        isVideoAvailable: boolean
    }
    verificationStatus: string
    onboardingStatus: string
    isApproved: boolean
    walletBalance: number
    callSettings: {
        audioCallRate: number
        videoCallRate: number
    }
    createdAt: string
}

export const columns: ColumnDef<Astrologer>[] = [
    {
        accessorKey: "personalDetails.name",
        header: "Name",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            const astrologer = row.original
            return (
                <div>
                    <p className="font-medium">{astrologer.personalDetails.name}</p>
                    <p className="text-sm text-gray-500">{astrologer.personalDetails.email}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "personalDetails.skills",
        header: "Skills",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            const skills = row.original.personalDetails.skills
            return (
                <div className="flex flex-wrap gap-1">
                    {skills && skills.length > 0 ? (
                        skills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-gray-400">-</span>
                    )}
                    {skills && skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{skills.length - 2}</Badge>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "ratings.average",
        header: "Rating",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            const astrologer = row.original
            return (
                <div className="text-center">
                    <p className="font-semibold">{astrologer.ratings.average.toFixed(1)} ⭐</p>
                    <p className="text-xs text-gray-500">({astrologer.ratings.count})</p>
                </div>
            )
        }
    },
    {
        accessorKey: "verificationStatus",
        header: "Verification",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            const status = row.original.verificationStatus
            return (
                <Badge
                    variant={status === "Verified" ? "success" : "secondary"}
                    className="text-xs"
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "onboardingStatus",
        header: "Onboarding",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            const status = row.original.onboardingStatus
            return (
                <Badge
                    variant={
                        status === "Completed"
                            ? "success"
                            : status === "Pending"
                                ? "secondary"
                                : "destructive"
                    }
                    className="text-xs"
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "availability.status",
        header: "Status",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            const status = row.original.availability.status
            return (
                <Badge
                    variant={status === "online" ? "success" : "secondary"}
                    className="text-xs"
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            return <ActionCell astrologer={row.original} />
        },
    },
]

// Separate component to handle state for the modal
const ActionCell = ({ astrologer }: { astrologer: Astrologer }) => {
    const [openSuspend, setOpenSuspend] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: unsuspend, isPending: isUnsuspending } = useMutation({
        mutationFn: async () => {
            await api.post(`/astrologers/${astrologer._id}/unsuspend`);
        },
        onSuccess: () => {
            toast.success("Astrologer reactivated successfully");
            queryClient.invalidateQueries({ queryKey: ['astrologers'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to reactivate");
        }
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>View Earnings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => setOpenSuspend(true)}
                    >
                        Suspend Account
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SuspendModal
                isOpen={openSuspend}
                onClose={() => setOpenSuspend(false)}
                astrologerId={astrologer._id}
                astrologerName={astrologer.personalDetails.name}
            />
        </>
    )
}
