"use client"

import { CourseForm } from '@/components/courses/course-form';
import { BackButton } from '@/components/ui/back-button';
import { useParams } from 'next/navigation';
import { useAdminCourseDetail } from '@/lib/hooks/use-courses';
import { Loader2 } from 'lucide-react';

export default function EditAdminCoursePage() {
    const params = useParams();
    const courseId = params.id as string;

    const { data: response, isLoading, error } = useAdminCourseDetail(courseId);
    const course = response?.data;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading course details...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-destructive font-medium">Failed to load course details</p>
                <BackButton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Course</h2>
                <BackButton />
            </div>
            {course && <CourseForm initialData={course as any} />}
        </div>
    );
}
