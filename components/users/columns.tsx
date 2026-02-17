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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "sonner"

export type User = {
    _id: string
    fullName?: string
    email: string
    phoneNumber?: string
    profilePhoto?: string | null
    kundli?: string | null
    exanthem?: string | null
    is_verified: boolean
    status: string
    walletBalance: number
    createdAt: string
    updatedAt: string
    freeMinutes?: {
        total: number
        used: number
        remaining: number
    }
}

const UserActions = ({ user }: { user: User }) => {
    const queryClient = useQueryClient()

    const { mutate: toggleBlock, isPending } = useMutation({
        mutationFn: async () => {
            await api.patch(`/users/${user._id}/toggle-status`);
        },
        onSuccess: () => {
            toast.success("User status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || "Action failed");
        }
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(user._id)}
                >
                    Copy User ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    disabled={isPending}
                    onClick={() => toggleBlock()}
                >
                    Block User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }: { row: Row<User> }) => {
            const user = row.original
            return (
                <div>
                    <p className="font-medium">{user.fullName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }: { row: Row<User> }) => {
            return row.getValue("phoneNumber") || "N/A"
        }
    },
    {
        accessorKey: "is_verified",
        header: "Verification",
        cell: ({ row }: { row: Row<User> }) => {
            const isVerified = row.getValue("is_verified") as boolean
            return (
                <Badge variant={isVerified ? "success" : "secondary"}>
                    {isVerified ? "Verified" : "Unverified"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "walletBalance",
        header: "Wallet",
        cell: ({ row }: { row: Row<User> }) => {
            const balance = row.getValue("walletBalance") as number
            return <span className="font-medium">₹{balance}</span>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<User> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Active" ? "success" : "secondary"}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }: { row: Row<User> }) => {
            const date = row.getValue("createdAt") as string
            return new Date(date).toLocaleDateString()
        }
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<User> }) => <UserActions user={row.original} />,
    },
]
