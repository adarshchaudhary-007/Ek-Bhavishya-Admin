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
import { Eye, CheckCircle, XCircle, RotateCcw, Edit, Sparkles, IndianRupee } from "lucide-react"
import { useApproveRemedy, useRejectRemedy, useRevertRemedy } from "@/lib/hooks/use-remedies"
import { Remedy } from "@/lib/services/remedy-service"
import { RemedyDetailModal } from "./remedy-detail-modal"
import { RejectRemedyModal } from "./reject-remedy-modal"

export const columns: ColumnDef<Remedy>[] = [
    {
        accessorKey: "title",
        header: "Remedy",
        cell: ({ row }: { row: Row<Remedy> }) => {
            const remedy = row.original
            return (
                <div className="max-w-[260px]">
                    <p className="font-medium truncate" title={remedy.title}>{remedy.title}</p>
                    <p className="text-xs text-gray-500 truncate">{remedy.category}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "base_price",
        header: "Price",
        cell: ({ row }: { row: Row<Remedy> }) => {
            return (
                <span className="font-semibold text-sm flex items-center gap-0.5">
                    <IndianRupee className="h-3 w-3" />
                    {row.original.base_price?.toLocaleString('en-IN') || '0'}
                </span>
            )
        }
    },
    {
        accessorKey: "delivery_type",
        header: "Delivery",
        cell: ({ row }: { row: Row<Remedy> }) => {
            return (
                <Badge variant="outline" className="text-xs capitalize">
                    {row.original.delivery_type || 'N/A'}
                </Badge>
            )
        }
    },
    {
        accessorKey: "is_featured",
        header: "Featured",
        cell: ({ row }: { row: Row<Remedy> }) => {
            return row.original.is_featured ? (
                <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
            ) : (
                <span className="text-gray-400">—</span>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Remedy> }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" | "success" = "secondary"

            if (status === "Approved" || status === "Active") variant = "success"
            else if (status === "Rejected" || status === "Inactive") variant = "destructive"
            else if (status === "Pending") variant = "secondary"

            return (
                <Badge variant={variant} className="text-[10px] font-bold uppercase py-0 px-1.5 h-5">
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }: { row: Row<Remedy> }) => {
            const date = new Date(row.getValue("createdAt"))
            return <span className="text-sm">{date.toLocaleDateString()}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Remedy> }) => {
            return <ActionCell remedy={row.original} />
        },
    },
]

const ActionCell = ({ remedy }: { remedy: Remedy }) => {
    const [showDetails, setShowDetails] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)

    const approveMutation = useApproveRemedy()
    const rejectMutation = useRejectRemedy()
    const revertMutation = useRevertRemedy()

    const handleApprove = () => {
        approveMutation.mutate(remedy._id)
    }

    const handleReject = (reason: string) => {
        rejectMutation.mutate({ remedyId: remedy._id, reason })
        setShowRejectModal(false)
    }

    const handleRevert = () => {
        revertMutation.mutate(remedy._id)
    }

    const isLoading = approveMutation.isPending || rejectMutation.isPending || revertMutation.isPending
    const isPending = remedy.status === "Pending"
    const canRevert = remedy.status === "Approved" || remedy.status === "Rejected"

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDetails(true)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {isPending && (
                        <>
                            <DropdownMenuItem
                                className="text-green-600 cursor-pointer font-medium"
                                onClick={handleApprove}
                                disabled={isLoading}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer font-medium"
                                onClick={() => setShowRejectModal(true)}
                                disabled={isLoading}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                        </>
                    )}

                    {canRevert && (
                        <DropdownMenuItem
                            className="text-blue-600 cursor-pointer font-medium"
                            onClick={handleRevert}
                            disabled={isLoading}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" /> Revert to Pending
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <RemedyDetailModal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                remedy={remedy}
            />

            <RejectRemedyModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                remedyTitle={remedy.title}
                loading={isLoading}
            />
        </>
    )
}
