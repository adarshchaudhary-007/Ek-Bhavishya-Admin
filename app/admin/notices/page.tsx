'use client';

import { columns, Notice } from '@/components/notices/columns';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';



export default function NoticesPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['notices'],
        queryFn: async () => {
            const response = await api.get('/notices');
            return response.data.data || [];
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Notices</h2>
                <Link href="/admin/notices/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Notice
                    </Button>
                </Link>
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
