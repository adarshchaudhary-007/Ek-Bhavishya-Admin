'use client';

import { columns } from '@/components/products/columns';
import { DataTable } from '@/components/ui/data-table';
import { useProducts } from '@/lib/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
    const { data, isLoading } = useProducts();

    return (
        <div className="flex flex-col gap-5 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Product Management</h1>
                    <p className="text-muted-foreground text-sm">
                        Oversee seller products, verify details, and manage marketplace listings.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-[50px] w-full" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data?.products || []}
                    searchKey="product_name"
                />
            )}
        </div>
    );
}
