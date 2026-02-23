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

import { Eye, FileText, CheckCircle, XCircle, MoreVertical, PlayCircle } from "lucide-react"
import { useQueryClient, useMutation } from "@tanstack/react-query"

export type CallReport = {
    _id: string
    user: string
    astrologer: string
    duration: string
    amount: number
    status: string
    reportReason?: string
    date: string
}

export const columns: ColumnDef<CallReport>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }: { row: Row<CallReport> }) => <span className="text-xs text-muted-foreground">{new Date(row.getValue("date")).toLocaleDateString()}</span>
    },
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }: { row: Row<CallReport> }) => <span className="font-medium">{row.getValue("user")}</span>
    },
    {
        accessorKey: "astrologer",
        header: "Astrologer",
        cell: ({ row }: { row: Row<CallReport> }) => <span className="font-medium">{row.getValue("astrologer")}</span>
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }: { row: Row<CallReport> }) => <Badge variant="outline" className="font-mono text-[10px]">{row.getValue("duration")}</Badge>
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }: { row: Row<CallReport> }) => {
            const amount = parseFloat(row.getValue("amount")) || 0
            return <div className="font-bold text-sm">₹{amount}</div>
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
                    className="text-[10px] font-bold uppercase py-0 px-1.5 h-5"
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
                <div className="flex items-center text-destructive text-[10px] font-bold uppercase bg-destructive/10 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {reason}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<CallReport> }) => {
            return <ActionCell report={row.original} />
        },
    },
]

const ActionCell = ({ report }: { report: CallReport }) => {
    const queryClient = useQueryClient();

    const { mutate: handleAction, isPending } = useMutation({
        mutationFn: async ({ action, endpoint }: { action: string, endpoint: string }) => {
            await api.post(endpoint);
        },
        onSuccess: (_, variables) => {
            toast.success(`${variables.action} successful`);
            queryClient.invalidateQueries({ queryKey: ['calls'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
        onError: (error, variables) => {
            const message = (error as any).response?.data?.message || `Failed to ${variables.action}`;
            toast.error(message);
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
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Call details coming soon")}>
                    <FileText className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Recording playback coming soon")}>
                    <PlayCircle className="mr-2 h-4 w-4" /> View Recording
                </DropdownMenuItem>
                {report.status === 'disputed' && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-green-600 cursor-pointer font-medium"
                            disabled={isPending}
                            onClick={() => handleAction({ action: 'Refund', endpoint: `/calls/${report._id}/refund` })}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve Refund
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-orange-600 cursor-pointer font-medium"
                            disabled={isPending}
                            onClick={() => handleAction({ action: 'Dismiss', endpoint: `/calls/${report._id}/dismiss` })}
                        >
                            <XCircle className="mr-2 h-4 w-4" /> Dismiss Report
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
