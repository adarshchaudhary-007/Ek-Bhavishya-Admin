"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Course } from "./columns"
import { Separator } from "@/components/ui/separator"

interface CourseDetailModalProps {
    isOpen: boolean
    onClose: () => void
    course: Course
}

export function CourseDetailModal({ isOpen, onClose, course }: CourseDetailModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                <DialogHeader>
                    <DialogTitle>Course Details</DialogTitle>
                    <DialogDescription>
                        View complete course information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <Badge
                            variant={
                                course.status === "active" || course.status === "Approved"
                                    ? "default"
                                    : course.status === "rejected" || course.status === "Rejected"
                                        ? "destructive"
                                        : "secondary"
                            }
                            className="text-sm"
                        >
                            {course.status}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Title */}
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                    </div>

                    {/* Course Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Instructor</h4>
                            <p className="text-sm">{course.instructor || "Not Assigned"}</p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Price</h4>
                            <p className="text-sm font-bold">₹{course.price || 0}</p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Students Enrolled</h4>
                            <p className="text-sm">{course.studentsEnrolled || 0}</p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Course ID</h4>
                            <p className="text-xs font-mono">{course._id}</p>
                        </div>
                    </div>

                    {/* Rejection Reason (if rejected) */}
                    {(course.status === "rejected" || course.status === "Rejected") && (course as any).rejectionReason && (
                        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-destructive mb-2">Rejection Reason</h4>
                            <p className="text-sm">{(course as any).rejectionReason}</p>
                        </div>
                    )}

                    {/* Metadata */}
                    {(course as any).createdAt && (
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Created: {new Date((course as any).createdAt).toLocaleString()}</p>
                            {(course as any).updatedAt && (
                                <p>Updated: {new Date((course as any).updatedAt).toLocaleString()}</p>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
