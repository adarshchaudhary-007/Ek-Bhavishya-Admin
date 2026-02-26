"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import Link from "next/link"
import { useApproveCourse, useRejectCourse, useDeleteAdminCourse } from "@/lib/hooks/use-courses"
import { useState } from "react"
import { CourseDetailModal } from "./course-detail-modal"

export type Course = {
    _id: string
    title: string
    instructor?: string
    price?: number
    status: string
    studentsEnrolled?: number
    category?: string
    level?: string
    source?: string
    thumbnail?: string
}

import { usePathname } from "next/navigation"

const ActionCell = ({ course }: { course: Course }) => {
    const queryClient = useQueryClient()
    const pathname = usePathname()
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")

    const { mutate: approveCourse, isPending: isApproving } = useApproveCourse()
    const { mutate: rejectCourse, isPending: isRejecting } = useRejectCourse()
    const { mutate: deleteCourse, isPending: isDeleting } = useDeleteAdminCourse()

    const handleApprove = () => {
        approveCourse(course._id)
    }

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason")
            return
        }
        rejectCourse({ id: course._id, rejectionReason })
        setShowRejectModal(false)
        setRejectionReason("")
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this course?")) {
            deleteCourse(course._id)
        }
    }

    const isLoading = isApproving || isRejecting || isDeleting
    const isPending = course.status === 'pending' || course.status === 'Pending'
    const isAdminCoursesPage = pathname.includes('/admin/admin-courses')

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
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDetailModal(true)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    {isAdminCoursesPage && (
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href={`/admin/admin-courses/${course._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Course
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {isPending && (
                        <>
                            <DropdownMenuItem
                                className="text-green-600 cursor-pointer font-medium"
                                disabled={isLoading}
                                onClick={handleApprove}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve Course
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer font-medium"
                                disabled={isLoading}
                                onClick={() => setShowRejectModal(true)}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Reject Course
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer font-medium"
                        disabled={isLoading}
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Course
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Course Detail Modal */}
            <CourseDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                course={course}
            />

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Reject Course</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Please provide a reason for rejecting this course:
                        </p>
                        <textarea
                            className="w-full p-2 border rounded-md mb-4 min-h-[100px]"
                            placeholder="Enter rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowRejectModal(false)
                                    setRejectionReason("")
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={isRejecting}
                            >
                                {isRejecting ? "Rejecting..." : "Reject"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "thumbnail",
        header: "Preview",
        cell: ({ row }) => {
            const thumbnail = row.getValue("thumbnail") as string
            return (
                <div className="relative h-10 w-16 overflow-hidden rounded-md border bg-muted">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt="Course"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                            No Img
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "title",
        header: "Course Name",
        cell: ({ row }: { row: Row<Course> }) => {
            const course = row.original
            return (
                <div className="max-w-[200px]">
                    <p className="font-semibold truncate" title={course.title}>{course.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{course._id}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => {
            const source = row.getValue("source") as string || "Admin"
            return (
                <Badge variant="outline" className="text-[10px] py-0 h-5">
                    {source}
                </Badge>
            )
        }
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => row.getValue("category") || "N/A"
    },
    {
        accessorKey: "level",
        header: "Level",
        cell: ({ row }) => (
            <div className="text-[11px] font-medium">
                {row.getValue("level") || "N/A"}
            </div>
        )
    },
    {
        accessorKey: "instructor",
        header: "Instructor",
        cell: ({ row }: { row: Row<Course> }) => {
            const instructor = row.getValue("instructor") as string
            return (
                <div className="text-sm">
                    {instructor || <span className="text-muted-foreground italic">Not Assigned</span>}
                </div>
            )
        }
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: { row: Row<Course> }) => {
            const rawPrice = row.getValue("price")
            const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice as string) || 0
            return <div className="font-bold text-primary">₹{price.toLocaleString()}</div>
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Course> }) => {
            const status = (row.getValue("status") as string || "pending").toLowerCase()
            return (
                <Badge
                    variant={
                        status === "active" || status === "approved"
                            ? "success"
                            : status === "rejected"
                                ? "destructive"
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
        id: "actions",
        cell: ({ row }: { row: Row<Course> }) => <ActionCell course={row.original} />
    }
]
