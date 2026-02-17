"use client"

import { CourseForm } from "@/components/courses/course-form"

export default function NewCoursePage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Course</h3>
                <p className="text-sm text-muted-foreground">
                    Add a new course to the platform.
                </p>
            </div>
            <CourseForm />
        </div>
    )
}
