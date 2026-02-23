"use client"

import { CourseForm } from "@/components/courses/course-form"
import { BackButton } from "@/components/ui/back-button"

export default function NewCoursePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Create Course</h3>
                    <p className="text-sm text-muted-foreground">
                        Add a new course to the platform.
                    </p>
                </div>
                <BackButton />
            </div>
            <CourseForm />
        </div>
    )
}
