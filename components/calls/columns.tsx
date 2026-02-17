"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal, AlertCircle } from "lucide-react"

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
import { toast } from "sonner"
import api from "@/lib/axios"

export type CallReport = {
    id: string
    user: string
    astrologer: string
    duration: string
    amount: number
    status: "completed" | "active" | "disputed" | "refunded"
    reportReason?: string
    date: string
}

export const columns: ColumnDef<CallReport>[] = [
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "user",
        header: "User",
    },
    {
        accessorKey: "astrologer",
        header: "Astrologer",
    },
    {
        accessorKey: "duration",
        header: "Duration",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }: { row: Row<CallReport> }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<CallReport> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "completed"
                            ? "success"
                            : status === "disputed"
                                ? "destructive"
                                : status === "active"
                                    ? "default"
                                    : "secondary"
                    }
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "reportReason",
        header: "Report Reason",
        cell: ({ row }: { row: Row<CallReport> }) => {
            const reason = row.getValue("reportReason") as string
            if (!reason) return null
            return (
                <div className="flex items-center text-destructive text-sm font-medium">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {reason}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<CallReport> }) => {
            return <ActionCell report={row.original as CallReport} />
        },
    },
]

const ActionCell = ({ report }: { report: CallReport }) => {
    const handleAction = async (action: string, endpoint: string) => {
        toast.loading(`Processing ${action}...`, { id: 'action-toast' });
        try {
            await api.post(endpoint);
            toast.success(`${action} successful`, { id: 'action-toast' });
            // Optionally invalidate queries here if I had access to queryClient
            // but for now, simple success message.
            // Ideally trigger a refetch or update local state.
            window.location.reload(); // Simple brute force refresh for now or use queryClient
        } catch (error) {
            toast.error(`Failed to ${action}`, { id: 'action-toast' });
        }
    }

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
                <DropdownMenuItem>View Call Details</DropdownMenuItem>
                <DropdownMenuItem>View Recording</DropdownMenuItem>
                {report.status === 'disputed' && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-green-600" onClick={() => handleAction('Refund', `/calls/${report.id}/refund`)}>
                            Approve Refund
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Dismiss', `/calls/${report.id}/dismiss`)}>
                            Dismiss Report
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
