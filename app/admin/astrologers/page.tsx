'use client';

import { columns, Astrologer } from '@/components/astrologers/columns';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';



import { useAstrologers } from '@/lib/hooks/use-astrologers';

export default function AstrologersPage() {
    const { data, isLoading } = useAstrologers();
    const astrologerList = data?.data || [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Astrologers</h2>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DataTable columns={columns} data={astrologerList} searchKey="name" />
            )}
        </div>
    );
}
