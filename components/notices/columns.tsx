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
import { useDeleteNotice } from "@/lib/hooks/use-notices"
import { useState } from "react"
import { Eye, Trash2, Copy, Edit } from "lucide-react"
import { Notice } from "@/types"
import { NoticeDetailModal } from "./notice-detail-modal"
import { UpdateNoticeModal } from "./update-notice-modal"
import { DeleteConfirmModal } from "./delete-confirm-modal"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const NoticeActions = ({ notice }: { notice: Notice }) => {
    const [showDetails, setShowDetails] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const router = useRouter()
    
    const deleteNotice = useDeleteNotice()
    const isDeleting = deleteNotice.isPending

    const handleDelete = () => {
        deleteNotice.mutate(notice._id, {
            onSuccess: () => {
                setShowDelete(false)
            }
        })
    }

    const handleDuplicate = () => {
        // Navigate to create notice page with pre-filled data
        const duplicateData = {
            title: `Copy of ${notice.title}`,
            message: notice.message,
            type: notice.type,
            user_ids: notice.user_ids,
            email_notification: notice.email_notification,
            push_notification: notice.push_notification,
            in_app_notification: notice.in_app_notification,
        }
        
        // Store in sessionStorage to pre-fill the form
        sessionStorage.setItem('duplicateNotice', JSON.stringify(duplicateData))
        router.push('/admin/notices/new')
        toast.success('Notice data copied. You can now edit and create.')
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDetails(true)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowUpdate(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Update Notice
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleDuplicate}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer font-medium"
                        disabled={isDeleting}
                        onClick={() => setShowDelete(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Notice
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <NoticeDetailModal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                noticeId={notice._id}
            />

            <UpdateNoticeModal
                isOpen={showUpdate}
                onClose={() => setShowUpdate(false)}
                notice={notice}
            />

            <DeleteConfirmModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                noticeTitle={notice.title}
                loading={isDeleting}
            />
        </>
    )
}

export const columns: ColumnDef<Notice>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }: { row: Row<Notice> }) => {
            const notice = row.original
            return (
                <div className="max-w-[300px]">
                    <p className="font-medium truncate" title={notice.title}>{notice.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5" title={notice.message}>
                        {notice.message}
                    </p>
                </div>
            )
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }: { row: Row<Notice> }) => {
            const type = row.getValue("type") as string
            
            // Format type for display
            const typeLabels: Record<string, string> = {
                'platform_policy': 'Platform Policy',
                'downtime_alert': 'Downtime Alert',
                'payment_notice': 'Payment Notice',
                'warning_strike': 'Warning Strike',
                'appreciation_message': 'Appreciation',
                'announcement': 'Announcement',
            }
            
            const displayType = typeLabels[type] || type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "General"
            
            return (
                <Badge variant="outline" className="text-xs">
                    {displayType}
                </Badge>
            )
        }
    },
    {
        accessorKey: "sentCount",
        header: "Sent Count",
        cell: ({ row }: { row: Row<Notice> }) => {
            const count = row.getValue("sentCount") as number
            return <span className="font-medium">{count || 0}</span>
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }: { row: Row<Notice> }) => {
            const date = new Date(row.getValue("createdAt") as string)
            return (
                <div className="text-xs text-muted-foreground">
                    <div>{date.toLocaleDateString()}</div>
                    <div className="text-[10px]">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Notice> }) => {
            return <NoticeActions notice={row.original} />
        },
    },
]
