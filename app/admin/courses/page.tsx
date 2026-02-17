'use client';

import { columns, Course } from '@/components/courses/columns';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function CoursesPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await api.get('/courses');
            return response.data.data || [];
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Courses Review</h2>
                <Button asChild>
                    <Link href="/admin/courses/new">Create Course</Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DataTable columns={columns} data={data || []} searchKey="title" />
            )}
        </div>
    );
}
