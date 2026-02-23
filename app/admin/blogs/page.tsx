'use client';

import { columns } from '@/components/blogs/columns';
import { DataTable } from '@/components/ui/data-table';
import { useBlogs } from '@/lib/hooks/use-blogs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function BlogsPage() {
    const [status, setStatus] = useState<'Pending' | 'Approved' | 'Rejected' | ''>('');

    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useBlogs({
        ...(status && { status: status as 'Pending' | 'Approved' | 'Rejected' }),
        page: 1,
        limit: 10,
    });

    const handleRefresh = () => {
        console.log('[BlogsPage] Manual refresh triggered');
        refetch();
    };

    const handleStatusChange = (value: string) => {
        if (value === 'all') {
            setStatus('');
        } else {
            setStatus(value as 'Pending' | 'Approved' | 'Rejected');
        }
    };

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Blogs</h2>
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </div>
                <div className="flex items-center justify-center py-10">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Failed to load blogs</p>
                        <Button onClick={handleRefresh} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Blogs</h2>
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={isFetching}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Select value={status || 'all'} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data?.data || []}
                    searchKey="title"
                />
            )}
        </div>
    );
}
