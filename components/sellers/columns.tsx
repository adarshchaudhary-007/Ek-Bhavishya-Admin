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
    id: string
    name: string
    email: string
    shopName: string
    status: "active" | "rejected" | "pending"
    joinedAt: string
}

export const columns: ColumnDef<Seller>[] = [
    {
        accessorKey: "shopName",
        header: "Shop Name",
    },
    {
        accessorKey: "name",
        header: "Owner Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Seller> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "active"
                            ? "success"
                            : status === "rejected"
                                ? "destructive"
                                : "secondary"
                    }
                >
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

    const { mutate: changeStatus, isPending } = useMutation({
        mutationFn: async ({ status }: { status: 'active' | 'pending' }) => {
            if (status === 'active') {
                await api.patch('/sellers/approve', { id: seller.id });
            } else {
                await api.patch('/sellers/revert', { id: seller.id });
            }
        },
        onSuccess: (_, variables) => {
            toast.success(`Seller status updated to ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
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
                    {seller.status === 'pending' && (
                        <>
                            <DropdownMenuItem
                                className="text-green-600 cursor-pointer"
                                onClick={() => changeStatus({ status: 'active' })}
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
                    {seller.status === 'active' && (
                        <DropdownMenuItem
                            onClick={() => changeStatus({ status: 'pending' })}
                            disabled={isPending}
                        >
                            Revert to Pending
                        </DropdownMenuItem>
                    )}
                    {seller.status === 'rejected' && (
                        <DropdownMenuItem
                            onClick={() => changeStatus({ status: 'pending' })}
                            disabled={isPending}
                        >
                            Revert to Pending
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <RejectModal
                isOpen={openReject}
                onClose={() => setOpenReject(false)}
                sellerId={seller.id}
                sellerName={seller.name}
            />
        </>
    )
}
