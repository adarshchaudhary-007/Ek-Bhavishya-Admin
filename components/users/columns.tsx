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
import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "sonner"
import { UserDetailModal } from "./user-detail-modal"

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

import { Eye, Edit, Trash2, ShieldAlert } from "lucide-react"
import { useBlockUser } from "@/lib/hooks/use-users"
import { BlockUserModal } from "./block-user-modal"

const UserActions = ({ user }: { user: User }) => {
    const queryClient = useQueryClient()
    const [showDetails, setShowDetails] = React.useState(false)
    const [showBlockConfirm, setShowBlockConfirm] = React.useState(false)

    const blockUserMutation = useBlockUser()

    const handleBlockUser = () => {
        blockUserMutation.mutate(user._id)
        setShowBlockConfirm(false)
    }

    const { mutate: deleteUser, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            await api.delete(`/api/v1/admin/users/${user._id}`);
        },
        onSuccess: () => {
            toast.success("User deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: Error) => {
            const message = (error as any).response?.data?.message || "Deletion failed";
            toast.error(message);
        }
    })

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
                    <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Edit functionality coming soon")}>
                        <Edit className="mr-2 h-4 w-4" /> Edit User
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-destructive cursor-pointer font-medium"
                        disabled={blockUserMutation.isPending}
                        onClick={() => setShowBlockConfirm(true)}
                    >
                        <ShieldAlert className="mr-2 h-4 w-4" /> Block User
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-destructive cursor-pointer font-medium"
                        disabled={isDeleting}
                        onClick={() => {
                            if (confirm(`Are you sure you want to delete ${user.fullName || user.email}?`)) {
                                deleteUser();
                            }
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UserDetailModal
                user={user}
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
            />

            <BlockUserModal
                isOpen={showBlockConfirm}
                onClose={() => setShowBlockConfirm(false)}
                onConfirm={handleBlockUser}
                userName={user.fullName || user.email}
                loading={blockUserMutation.isPending}
            />
        </>
    )
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }: { row: Row<User> }) => {
            const user = row.original
            return (
                <div className="max-w-[200px]">
                    <p className="font-medium truncate" title={user.fullName || 'N/A'}>
                        {user.fullName || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 truncate" title={user.email}>
                        {user.email}
                    </p>
                </div>
            )
        }
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }: { row: Row<User> }) => {
            return <span className="text-sm">{row.getValue("phoneNumber") || "N/A"}</span>
        }
    },
    {
        accessorKey: "is_verified",
        header: "Verification",
        cell: ({ row }: { row: Row<User> }) => {
            const isVerified = row.getValue("is_verified") as boolean
            return (
                <Badge variant={isVerified ? "success" : "secondary"} className="text-[10px] font-bold uppercase py-0 px-1.5 h-5">
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
            return <span className="font-bold text-sm">₹{balance}</span>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<User> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Active" ? "success" : "secondary"} className="text-[10px] font-bold uppercase py-0 px-1.5 h-5">
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
            return <span className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<User> }) => <UserActions user={row.original} />,
    },
]
