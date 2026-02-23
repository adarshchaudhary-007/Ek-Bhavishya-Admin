'use client';

import { columns } from '@/components/sellers/columns';
import { DataTable } from '@/components/ui/data-table';
import { useSellers } from '@/lib/hooks/use-sellers';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function SellersPage() {
    const { 
        data, 
        isLoading, 
        error, 
        refetch,
        isFetching 
    } = useSellers({
        page: 1,
        limit: 100, // Get more records for now
    });

    const handleRefresh = () => {
        console.log('[SellersPage] Manual refresh triggered');
        refetch();
    };

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Sellers</h2>
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </div>
                <div className="flex items-center justify-center py-10">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Failed to load sellers</p>
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
                <h2 className="text-3xl font-bold tracking-tight">Sellers</h2>
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

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DataTable 
                    columns={columns} 
                    data={data?.data || []} 
                    searchKey="business_name"
                />
            )}
        </div>
    );
}
