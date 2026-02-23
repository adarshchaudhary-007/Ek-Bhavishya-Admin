'use client';

import { columns } from '@/components/courses/columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useAdminCourses } from '@/lib/hooks/use-courses';

export default function AdminCoursesPage() {
    const { data, isLoading } = useAdminCourses({ page: 1, limit: 100 });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Admin Courses</h2>
                <Link href="/admin/admin-courses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                    </Button>
                </Link>
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
