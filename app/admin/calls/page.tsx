'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveCallsTable } from '@/components/calls/active-calls-table';
import { ReportedCallsTable } from '@/components/calls/reported-calls-table';
import { CallStatsOverview } from '@/components/calls/call-stats-overview';
import { Phone, AlertCircle, BarChart3 } from 'lucide-react';
import { useActiveCalls } from '@/lib/hooks/use-calls';

export default function CallsPage() {
    const { data: activeCallsData } = useActiveCalls();
    const activeCount = activeCallsData?.count || 0;

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Consultation Monitoring</h1>
                <p className="text-muted-foreground text-sm">
                    Monitor live sessions, handle quality reports, and analyze service performance.
                </p>
            </div>

            <Tabs defaultValue="stats" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-[450px]">
                    <TabsTrigger value="stats" className="gap-2">
                        <BarChart3 className="h-4 w-4" /> Statistics
                    </TabsTrigger>
                    <TabsTrigger value="active" className="gap-2">
                        <div className="relative">
                            <Phone className="h-4 w-4" />
                            {activeCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            )}
                        </div>
                        Active Now
                    </TabsTrigger>
                    <TabsTrigger value="reported" className="gap-2">
                        <AlertCircle className="h-4 w-4" /> Reported
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="stats" className="mt-6">
                    <CallStatsOverview />
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    <ActiveCallsTable />
                </TabsContent>

                <TabsContent value="reported" className="mt-6">
                    <ReportedCallsTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
