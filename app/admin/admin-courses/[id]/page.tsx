'use client';

import { CourseForm } from '@/components/courses/course-form';
import { useParams } from 'next/navigation';

export default function EditAdminCoursePage() {
    const params = useParams();
    const id = params.id;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Course: {id}</h2>
            </div>
            <CourseForm />
        </div>
    );
}
