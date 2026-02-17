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
import { toast } from "sonner"
import { RejectModal } from "./reject-modal"
import Link from "next/link"
import api from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type Seller = {
    _id: string
    business_name: string
    fullname: string
    email: string
    phone_number: string
    profile_image?: string | null
    is_verified: boolean
    is_approved: boolean
    address: string
    gst_number: string
    adhar_number: string
    status: string
    createdAt: string
    updatedAt: string
}

export const columns: ColumnDef<Seller>[] = [
    {
        accessorKey: "business_name",
        header: "Business Name",
        cell: ({ row }: { row: Row<Seller> }) => {
            const seller = row.original
            return (
                <div>
                    <p className="font-medium">{seller.business_name}</p>
                    <p className="text-sm text-gray-500">{seller.email}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "fullname",
        header: "Owner Name",
        cell: ({ row }: { row: Row<Seller> }) => {
            return row.getValue("fullname") || "N/A"
        }
    },
    {
        accessorKey: "phone_number",
        header: "Phone",
        cell: ({ row }: { row: Row<Seller> }) => {
            return row.getValue("phone_number") || "N/A"
        }
    },
    {
        accessorKey: "is_verified",
        header: "Verification",
        cell: ({ row }: { row: Row<Seller> }) => {
            const isVerified = row.getValue("is_verified") as boolean
            return (
                <Badge variant={isVerified ? "success" : "secondary"}>
                    {isVerified ? "Verified" : "Unverified"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "is_approved",
        header: "Approval",
        cell: ({ row }: { row: Row<Seller> }) => {
            const isApproved = row.getValue("is_approved") as boolean
            return (
                <Badge variant={isApproved ? "success" : "secondary"}>
                    {isApproved ? "Approved" : "Pending"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Seller> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Active" ? "success" : "secondary"}>
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Seller> }) => {
            return <ActionCell seller={row.original} />
        },
    },
]

const ActionCell = ({ seller }: { seller: Seller }) => {
    const [openReject, setOpenReject] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: approveSeller, isPending } = useMutation({
        mutationFn: async () => {
            await api.patch(`/sellers/${seller._id}/approve`);
        },
        onSuccess: () => {
            toast.success("Seller approved successfully");
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to approve seller');
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
                    <DropdownMenuItem>View Shop Details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!seller.is_approved && (
                        <>
                            <DropdownMenuItem
                                className="text-green-600 cursor-pointer"
                                onClick={() => approveSeller()}
                                disabled={isPending}
                            >
                                Approve Seller
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                onClick={() => setOpenReject(true)}
                                disabled={isPending}
                            >
                                Reject Seller
                            </DropdownMenuItem>
                        </>
                    )}
                    {seller.is_approved && (
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => setOpenReject(true)}
                        >
                            Deactivate Seller
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <RejectModal
                isOpen={openReject}
                onClose={() => setOpenReject(false)}
                sellerId={seller._id}
                sellerName={seller.fullname}
            />
        </>
    )
}
