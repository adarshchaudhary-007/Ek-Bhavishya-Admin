'use client';

import { useCallStatistics } from '@/lib/hooks/use-calls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, PhoneCall, Wallet, Percent, Clock, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function CallStatsOverview() {
    const { data, isLoading } = useCallStatistics();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 whitespace-nowrap overflow-x-auto">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
        );
    }

    const stats = data?.statistics;

    const cards = [
        {
            title: 'Total Revenue',
            value: `₹${stats?.revenue?.total || 0}`,
            description: 'Total billed amount',
            icon: Wallet,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100'
        },
        {
            title: 'Success Rate',
            value: `${stats?.acceptanceRate || 0}%`,
            description: 'Completed vs Total calls',
            icon: Percent,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Average Duration',
            value: `${Math.round(stats?.averageCallDuration || 0)}s`,
            description: 'Average per session',
            icon: Clock,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100'
        },
        {
            title: 'Total Sessions',
            value: stats?.totalCalls || 0,
            description: 'Total initiated calls',
            icon: PhoneCall,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Rejected',
            value: stats?.rejectedCalls || 0,
            description: 'No answer/Rejected',
            icon: BarChart3,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        },
        {
            title: 'Cancelled',
            value: stats?.cancelledCalls || 0,
            description: 'Cancelled by user',
            icon: BarChart3,
            color: 'text-slate-600',
            bgColor: 'bg-slate-100'
        },
        {
            title: 'Reported',
            value: stats?.reportedCalls || 0,
            description: 'Quality concerns',
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {cards.map((card, i) => (
                    <Card key={i} className="border-none shadow-sm shadow-emerald-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <div className={`p-2 rounded-full ${card.bgColor}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Additional details could go here, like breakdown charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Call Type Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.callTypeBreakdown?.map((item) => (
                                <div key={item._id} className="flex items-center justify-between">
                                    <span className="text-sm font-medium capitalize">{item._id} Call</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${(item.count / stats.totalCalls) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Financial Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm py-1 border-b">
                                <span className="text-muted-foreground">Platform Commission</span>
                                <span className="font-bold text-emerald-600">₹{stats?.revenue?.commission || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1 border-b">
                                <span className="text-muted-foreground">Astrologer Earnings</span>
                                <span className="font-bold">₹{stats?.revenue?.astrologerEarnings || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1 border-b italic">
                                <span className="text-muted-foreground">Average Rev/Call</span>
                                <span>₹{Math.round(stats?.revenue?.averagePerCall || 0)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
