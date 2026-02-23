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
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { useApproveBlog, useRejectBlog } from "@/lib/hooks/use-blogs"
import { Blog } from "@/types"
import { BlogDetailModal } from "./blog-detail-modal"
import { RejectBlogModal } from "./reject-blog-modal"

export const columns: ColumnDef<Blog>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }: { row: Row<Blog> }) => {
            const blog = row.original
            return (
                <div className="max-w-[300px]">
                    <p className="font-medium truncate" title={blog.title}>{blog.title}</p>
                    <p className="text-xs text-gray-500 truncate" title={blog.author.personalDetails.name}>
                        By {blog.author.personalDetails.name}
                    </p>
                </div>
            )
        }
    },
    {
        accessorKey: "author.personalDetails.email",
        header: "Author Email",
        cell: ({ row }: { row: Row<Blog> }) => {
            const email = row.original.author.personalDetails.email
            return <span className="text-sm">{email || "N/A"}</span>
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
    
    const approveMutation = useApproveBlog()
    const rejectMutation = useRejectBlog()

    const handleApprove = () => {
        approveMutation.mutate(blog._id)
    }

    const handleReject = (reason: string) => {
        rejectMutation.mutate({ blogId: blog._id, reason })
        setShowRejectModal(false)
    }

    const isLoading = approveMutation.isPending || rejectMutation.isPending
    const isPending = blog.status === "Pending"

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
        </>
    )
}
