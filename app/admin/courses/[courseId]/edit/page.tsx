"use client"

import { CourseForm } from "@/components/courses/course-form"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { useParams } from "next/navigation"

export default function EditCoursePage() {
    const params = useParams()
    const courseId = params.courseId as string

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const response = await api.get(`/courses/${courseId}`);
            return response.data.data;
        },
        enabled: !!courseId
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Edit Course</h3>
                <p className="text-sm text-muted-foreground">
                    Update course details and modules.
                </p>
            </div>
            <CourseForm initialData={course} />
        </div>
    )
}
