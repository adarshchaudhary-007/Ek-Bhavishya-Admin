"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "sonner"
import Link from "next/link"

export type Course = {
    id: string
    title: string
    instructor: string
    price: number
    status: "active" | "pending" | "rejected"
    students: number
}

const ActionCell = ({ course }: { course: Course }) => {
    const queryClient = useQueryClient()

    const { mutate: deleteCourse } = useMutation({
        mutationFn: async () => {
            await api.delete(`/courses/${course.id}`);
        },
        onSuccess: () => {
            toast.success("Course deleted");
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete course");
        }
    })

    const { mutate: updateStatus } = useMutation({
        mutationFn: async (status: 'approve' | 'reject') => {
            const endpoint = status === 'approve' ? `/courses/${course.id}/approve` : `/courses/${course.id}/reject`;
            // For reject we might need a reason, but for now assuming simple reject or using same modal as sellers if needed.
            // Task md said "Approve/Reject".
            await api.patch(endpoint);
        },
        onSuccess: () => {
            toast.success("Course status updated");
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update status");
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
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/admin/courses/${course.id}/edit`} className="w-full">
                        Edit Course
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {course.status === 'pending' && (
                    <>
                        <DropdownMenuItem
                            className="text-green-600 cursor-pointer"
                            onClick={() => updateStatus('approve')}
                        >
                            Approve Course
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => updateStatus('reject')}
                        >
                            Reject Course
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={() => {
                        if (confirm("Are you sure you want to delete this course?")) {
                            deleteCourse();
                        }
                    }}
                >
                    Delete Course
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "instructor",
        header: "Instructor",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: { row: Row<Course> }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price)
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: "students",
        header: "Enrolled",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Course> }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "active"
                            ? "success"
                            : status === "rejected"
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
        id: "actions",
        cell: ({ row }: { row: Row<Course> }) => <ActionCell course={row.original} />
    }
]
