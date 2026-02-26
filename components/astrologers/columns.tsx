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
import { SuspendAstrologerModal as SuspendModal } from "./suspend-modal"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AstrologerDetailModal } from "./astrologer-detail-modal"
import { Eye, Edit, Trash2, ShieldCheck, ShieldAlert, BadgeIndianRupee, Clock } from "lucide-react"
import { useUnsuspendAstrologer } from "@/lib/hooks/use-astrologers"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
        about?: string
        gender?: string
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
        lastOnlineAt?: string
        currentCallId?: string | null
    }
    callSettings?: {
        audioCallRate: number
        videoCallRate: number
        acceptAudioCalls: boolean
        acceptVideoCalls: boolean
    }
    verificationStatus: string
    onboardingStatus: string
    isApproved: boolean
    walletBalance: number
    isExclusive?: boolean
    membershipOptions?: any[]
    referral?: {
        code: string
        referredBy?: string | null
        totalRewards: number
    }
    rejectionDetails?: {
        date: string
        reason: string
    }
    suspensionInfo?: {
        reason: string
        suspendedAt: string
        suspendUntil: string
        remainingDays: number
    }
    createdAt: string
    updatedAt: string
}

export const columns: ColumnDef<Astrologer>[] = [
    {
        accessorKey: "personalDetails.name",
        id: "name",
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
                        skills.slice(0, 2).map((skill: string, idx: number) => (
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
            const astrologer = row.original
            const status = astrologer.availability.status
            const isSuspended = status === "suspended" || !astrologer.isApproved
            const suspensionInfo = astrologer.suspensionInfo

            if (isSuspended && suspensionInfo) {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                    <Badge variant="destructive" className="text-xs">
                                        Suspended
                                    </Badge>
                                    <Clock className="h-3 w-3 text-orange-500" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <div className="space-y-1">
                                    <p className="font-semibold">Suspension Details</p>
                                    <p className="text-sm"><span className="font-medium">Reason:</span> {suspensionInfo.reason}</p>
                                    <p className="text-sm"><span className="font-medium">Remaining:</span> {suspensionInfo.remainingDays} days</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            }

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
    const [showDetails, setShowDetails] = useState(false);
    const queryClient = useQueryClient();

    const isSuspended = astrologer.availability.status === 'suspended' || !astrologer.isApproved;

    const { mutate: unsuspend, isPending: isUnsuspending } = useUnsuspendAstrologer();

    const { mutate: deleteAstrologer, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            await api.delete(`/astrologers/${astrologer._id}`);
        },
        onSuccess: () => {
            toast.success("Astrologer deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['astrologers'] });
        },
        onError: (error: Error) => {
            const message = (error as any).response?.data?.message || "Deletion failed";
            toast.error(message);
        }
    });

    const handleUnsuspend = () => {
        unsuspend({ id: astrologer._id });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDetails(true)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Earnings view coming soon")}>
                        <BadgeIndianRupee className="mr-2 h-4 w-4" /> View Earnings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Edit functionality coming soon")}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {isSuspended ? (
                        <DropdownMenuItem
                            className="text-green-600 cursor-pointer font-medium"
                            disabled={isUnsuspending}
                            onClick={handleUnsuspend}
                        >
                            <ShieldCheck className="mr-2 h-4 w-4" /> 
                            {isUnsuspending ? "Unsuspending..." : "Unsuspend"}
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            className="text-orange-600 cursor-pointer font-medium"
                            onClick={() => setOpenSuspend(true)}
                        >
                            <ShieldAlert className="mr-2 h-4 w-4" /> Suspend
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                        className="text-destructive cursor-pointer font-medium"
                        disabled={isDeleting}
                        onClick={() => {
                            if (confirm(`Are you sure you want to delete ${astrologer.personalDetails.name}?`)) {
                                deleteAstrologer();
                            }
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AstrologerDetailModal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                astrologer={astrologer}
            />

            <SuspendModal
                isOpen={openSuspend}
                onClose={() => setOpenSuspend(false)}
                astrologerId={astrologer._id}
                astrologerName={astrologer.personalDetails.name}
            />
        </>
    )
}
