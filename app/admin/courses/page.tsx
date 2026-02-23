'use client';

import { columns } from '@/components/courses/columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAllCourses } from '@/lib/hooks/use-courses';

export default function CoursesPage() {
    const { data, isLoading } = useAllCourses();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Courses Review</h2>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DataTable columns={columns} data={data?.data || []} searchKey="title" />
            )}
        </div>
    );
}
