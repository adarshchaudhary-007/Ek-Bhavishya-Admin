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
    id: string
    name: string
    email: string
    phone: string
    status: "active" | "blocked" | "pending"
    createdAt: string
}

const UserActions = ({ user }: { user: User }) => {
    const queryClient = useQueryClient()

    const { mutate: toggleBlock, isPending } = useMutation({
        mutationFn: async () => {
            const endpoint = user.status === 'blocked' ? '/users/unblock' : '/users/block';
            await api.patch(endpoint, { id: user.id });
        },
        onSuccess: () => {
            toast.success(`User ${user.status === 'blocked' ? 'unblocked' : 'blocked'} successfully`);
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
                    onClick={() => navigator.clipboard.writeText(user.id)}
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
                    {user.status === 'blocked' ? 'Unblock User' : 'Block User'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<User> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "active"
                            ? "success"
                            : status === "blocked"
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
