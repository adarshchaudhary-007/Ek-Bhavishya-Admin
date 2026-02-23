"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Blog } from "@/types"
import { useApproveBlog, useRejectBlog, useBlogDetail } from "@/lib/hooks/use-blogs"
import { RejectBlogModal } from "./reject-blog-modal"
import { Separator } from "@/components/ui/separator"
import { Loader2, AlertCircle } from "lucide-react"

interface BlogDetailModalProps {
    isOpen: boolean
    onClose: () => void
    blog: Blog
}

export function BlogDetailModal({ isOpen, onClose, blog: initialBlog }: BlogDetailModalProps) {
    const [showRejectModal, setShowRejectModal] = useState(false)

    // Fetch latest details when modal is open
    const {
        data: detailResponse,
        isLoading: isFetchingDetail,
        error: detailError
    } = useBlogDetail(initialBlog._id, isOpen)

    const blog = detailResponse?.data || initialBlog

    const { mutate: approveBlog, isPending: isApproving } = useApproveBlog()
    const { mutate: rejectBlog, isPending: isRejecting } = useRejectBlog()

    const handleApprove = () => {
        approveBlog(blog._id, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    const handleReject = () => {
        setShowRejectModal(true)
    }

    const handleRejectConfirm = (reason: string) => {
        rejectBlog({ blogId: blog._id, reason }, {
            onSuccess: () => {
                setShowRejectModal(false)
                onClose()
            }
        })
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                    <DialogHeader>
                        <DialogTitle>Blog Details</DialogTitle>
                        <DialogDescription>
                            View complete blog information and manage approval status
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {isFetchingDetail && !detailResponse && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Fetching blog details...</p>
                            </div>
                        )}

                        {detailError && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-destructive">
                                <AlertCircle className="h-8 w-8" />
                                <p className="text-sm font-medium">Failed to fetch blog details</p>
                                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                                    Retry
                                </Button>
                            </div>
                        )}

                        {!isFetchingDetail && !detailError && (
                            <>
                                {/* Status Badge and Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <Badge
                                        variant={
                                            blog.status === "Approved"
                                                ? "default"
                                                : blog.status === "Rejected"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                        className="text-sm"
                                    >
                                        {blog.status}
                                    </Badge>

                                    {/* Action Buttons - Only show for Pending blogs */}
                                    {blog.status === "Pending" && (
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={handleApprove}
                                                disabled={isApproving}
                                                className="flex-1 sm:flex-none"
                                            >
                                                {isApproving ? "Approving..." : "Approve"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={handleReject}
                                                className="flex-1 sm:flex-none"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Title */}
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{blog.title}</h3>
                                </div>

                                {/* Author Information */}
                                <div className="bg-muted p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Author Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Name:</span>
                                            <span className="ml-2 font-medium">
                                                {blog.author?.personalDetails?.name || "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Email:</span>
                                            <span className="ml-2 font-medium">
                                                {blog.author?.personalDetails?.email || "N/A"}
                                            </span>
                                        </div>
                                        <div className="col-span-full">
                                            <span className="text-muted-foreground">Author ID:</span>
                                            <span className="ml-2 font-mono text-xs">
                                                {blog.author?._id || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <h4 className="font-semibold mb-3">Content</h4>
                                    <div
                                        className="prose prose-sm max-w-none bg-muted/50 p-4 rounded-lg overflow-x-auto"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    />
                                </div>

                                {/* Rejection Reason (if rejected) */}
                                {blog.status === "Rejected" && blog.rejectionReason && (
                                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                                        <h4 className="font-semibold text-destructive mb-2">Rejection Reason</h4>
                                        <p className="text-sm">{blog.rejectionReason}</p>
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Created: {new Date(blog.createdAt).toLocaleString()}</p>
                                    {blog.updatedAt && (
                                        <p>Updated: {new Date(blog.updatedAt).toLocaleString()}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <RejectBlogModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                blogTitle={blog.title}
                onConfirm={handleRejectConfirm}
                loading={isRejecting}
            />
        </>
    )
}

