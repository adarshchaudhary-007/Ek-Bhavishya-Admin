'use client';

import { columns, CallReport } from '@/components/calls/columns';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';



export default function CallsPage() {
    const { data: calls = [], isLoading } = useQuery({
        queryKey: ['calls'],
        queryFn: async () => {
            const response = await api.get('/calls');
            return response.data.data;
        }
    });

    const activeCalls = calls.filter((c: CallReport) => c.status === 'active');
    const disputedCalls = calls.filter((c: CallReport) => c.status === 'disputed');
    const allCalls = calls;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Call Reports</h2>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Calls</TabsTrigger>
                    <TabsTrigger value="active">Active Now</TabsTrigger>
                    <TabsTrigger value="disputed">Reported / Disputed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={allCalls} searchKey="user" />
                    )}
                </TabsContent>
                <TabsContent value="active" className="space-y-4">
                    <DataTable columns={columns} data={activeCalls} searchKey="user" />
                </TabsContent>
                <TabsContent value="disputed" className="space-y-4">
                    <DataTable columns={columns} data={disputedCalls} searchKey="user" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
