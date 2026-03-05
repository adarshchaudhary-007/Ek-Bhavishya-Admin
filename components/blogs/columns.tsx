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
import { Eye, CheckCircle, XCircle, RotateCcw, Trash2, Edit } from "lucide-react"
import { useApproveBlog, useRejectBlog, useRevertBlogStatus, useDeleteBlog } from "@/lib/hooks/use-blogs"
import { Blog } from "@/types"
import { BlogDetailModal } from "./blog-detail-modal"
import { RejectBlogModal } from "./reject-blog-modal"
import { RevertBlogModal } from "./revert-blog-modal"
import { EditBlogModal } from "./edit-blog-modal"

export const columns: ColumnDef<Blog>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }: { row: Row<Blog> }) => {
            const blog = row.original
            const authorName = blog.author?.personalDetails?.name || blog.author?.name || 'Unknown Author'
            return (
                <div className="max-w-[300px]">
                    <p className="font-medium truncate" title={blog.title}>{blog.title}</p>
                    <p className="text-xs text-gray-500 truncate" title={authorName}>
                        By {authorName}
                    </p>
                </div>
            )
        }
    },
    {
        accessorKey: "author.personalDetails.email",
        header: "Author Email",
        cell: ({ row }: { row: Row<Blog> }) => {
            const email = row.original.author?.personalDetails?.email || row.original.author?.email || "N/A"
            return <span className="text-sm">{email}</span>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Blog> }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "secondary"
            
            if (status === "Approved") {
                variant = "default"
            } else if (status === "Rejected") {
                variant = "destructive"
            }
            
            return (
                <Badge variant={variant} className="text-[10px] font-bold uppercase py-0 px-1.5 h-5">
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }: { row: Row<Blog> }) => {
            const date = new Date(row.getValue("createdAt"))
            return <span className="text-sm">{date.toLocaleDateString()}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Blog> }) => {
            return <ActionCell blog={row.original} />
        },
    },
]

const ActionCell = ({ blog }: { blog: Blog }) => {
    const [showDetails, setShowDetails] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showRevertModal, setShowRevertModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    
    const approveMutation = useApproveBlog()
    const rejectMutation = useRejectBlog()
    const revertMutation = useRevertBlogStatus()
    const deleteMutation = useDeleteBlog()

    const handleApprove = () => {
        approveMutation.mutate(blog._id)
    }

    const handleReject = (reason: string) => {
        rejectMutation.mutate({ blogId: blog._id, reason })
        setShowRejectModal(false)
    }

    const handleRevert = (reason: string) => {
        revertMutation.mutate({ 
            blogId: blog._id, 
            currentStatus: blog.status as 'Approved' | 'Rejected',
            reason
        })
        setShowRevertModal(false)
    }

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`)) {
            deleteMutation.mutate(blog._id)
        }
    }

    const isLoading = approveMutation.isPending || rejectMutation.isPending || revertMutation.isPending || deleteMutation.isPending
    const isPending = blog.status === "Pending"
    const canRevert = blog.status === "Approved" || blog.status === "Rejected"

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDetails(true)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowEditModal(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Blog
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    
                    {isPending && (
                        <>
                            <DropdownMenuItem
                                className="text-green-600 cursor-pointer font-medium"
                                onClick={handleApprove}
                                disabled={isLoading}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer font-medium"
                                onClick={() => setShowRejectModal(true)}
                                disabled={isLoading}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                        </>
                    )}

                    {canRevert && (
                        <DropdownMenuItem
                            className="text-blue-600 cursor-pointer font-medium"
                            onClick={() => setShowRevertModal(true)}
                            disabled={isLoading}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" /> Revert Status
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer font-medium"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Blog
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <BlogDetailModal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                blog={blog}
            />

            <RejectBlogModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                blogTitle={blog.title}
                loading={isLoading}
            />

            <RevertBlogModal
                isOpen={showRevertModal}
                onClose={() => setShowRevertModal(false)}
                onConfirm={handleRevert}
                blogTitle={blog.title}
                currentStatus={blog.status as 'Approved' | 'Rejected'}
                loading={isLoading}
            />

            <EditBlogModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                blog={blog}
            />
        </>
    )
}
