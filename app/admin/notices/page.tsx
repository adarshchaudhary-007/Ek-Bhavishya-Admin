'use client';

import { columns } from '@/components/notices/columns';
import { DataTable } from '@/components/ui/data-table';
import { useNotices } from '@/lib/hooks/use-notices';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function NoticesPage() {
    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useNotices({
        page: 1,
        limit: 100,
    });

    const handleRefresh = () => {
        console.log('[NoticesPage] Manual refresh triggered');
        refetch();
    };

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Notices</h2>
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </div>
                <div className="flex items-center justify-center py-10">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Failed to load notices</p>
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
                <h2 className="text-3xl font-bold tracking-tight">Notices</h2>
                <div className="flex gap-2">
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="sm"
                        disabled={isFetching}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Link href="/admin/notices/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Notice
                        </Button>
                    </Link>
                </div>
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
