'use client';

import { columns, Seller } from '@/components/sellers/columns';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';



export default function SellersPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['sellers'],
        queryFn: async () => {
            const response = await api.get('/sellers');
            return response.data.data || [];
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Sellers</h2>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DataTable columns={columns} data={data || []} searchKey="business_name" />
            )}
        </div>
    );
}
