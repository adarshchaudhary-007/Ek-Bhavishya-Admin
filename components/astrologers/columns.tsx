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
    id: string
    name: string
    email: string
    specialization: string
    rating: number
    status: "active" | "suspended" | "pending"
    joinedAt: string
}

export const columns: ColumnDef<Astrologer>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "specialization",
        header: "Specialization",
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            return <span>{row.getValue("rating")} ⭐</span>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Astrologer> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "active"
                            ? "success"
                            : status === "suspended"
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
            // Assuming endpoint is /astrologers/:id/unsuspend or similar based on task description
            // The task list said: POST /astrologers/:astrologerId/unsuspend
            await api.post(`/astrologers/${astrologer.id}/unsuspend`);
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
                    {astrologer.status !== 'suspended' && (
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => setOpenSuspend(true)}
                        >
                            Suspend Account
                        </DropdownMenuItem>
                    )}
                    {astrologer.status === 'suspended' && (
                        <DropdownMenuItem
                            className="text-green-600 cursor-pointer"
                            disabled={isUnsuspending}
                            onClick={() => unsuspend()}
                        >
                            Reactivate Account
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <SuspendModal
                isOpen={openSuspend}
                onClose={() => setOpenSuspend(false)}
                astrologerId={astrologer.id}
                astrologerName={astrologer.name}
            />
        </>
    )
}
