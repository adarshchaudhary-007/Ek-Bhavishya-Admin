'use client';

import { columns, Course } from '@/components/courses/columns'; // Reusing columns for now, likely need specific ones with CRUD actions
import { DataTable } from '@/components/ui/data-table';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

// Dummy data
const dummyAdminCourses: Course[] = [
    {
        id: "admin-course-1",
        title: "Official Astro Certification",
        instructor: "Ek Bhavishya Admin",
        price: 199.99,
        status: "active",
        students: 500,
    },
];

export default function AdminCoursesPage() {
    const [data, setData] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setData(dummyAdminCourses);
            setLoading(false);
        }, 1000);
    }, []);

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

            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DataTable columns={columns} data={data} searchKey="title" />
            )}
        </div>
    );
}
