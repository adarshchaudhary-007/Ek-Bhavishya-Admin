import { CourseForm } from '@/components/courses/course-form';
import { BackButton } from '@/components/ui/back-button';

export default function NewAdminCoursePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Create New Course</h2>
                <BackButton />
            </div>
            <CourseForm />
        </div>
    );
}
