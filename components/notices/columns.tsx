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

export type Notice = {
    id: string
    title: string
    audience: string
    channels: string[]
    scheduledFor?: string
    status: "sent" | "scheduled" | "draft"
    createdAt: string
}

export const columns: ColumnDef<Notice>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "audience",
        header: "Audience",
    },
    {
        accessorKey: "channels",
        header: "Channels",
        cell: ({ row }: { row: Row<Notice> }) => {
            const channels = row.getValue("channels") as string[]
            return <div className="flex gap-1">{channels.join(", ")}</div>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Notice> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "sent"
                            ? "success"
                            : status === "scheduled"
                                ? "warning"
                                : "secondary"
                    }
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "scheduledFor",
        header: "Scheduled For",
        cell: ({ row }: { row: Row<Notice> }) => row.getValue("scheduledFor") || "-",
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Notice> }) => {
            const notice = row.original as Notice

            const queryClient = useQueryClient();
            const { mutate: deleteNotice } = useMutation({
                mutationFn: async () => {
                    await api.delete(`/notices/${notice.id}`);
                },
                onSuccess: () => {
                    toast.success("Notice deleted");
                    queryClient.invalidateQueries({ queryKey: ["notices"] });
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Failed to delete notice");
                }
            });

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
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => {
                                if (confirm("Delete this notice?")) {
                                    deleteNotice();
                                }
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
