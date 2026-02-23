"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, Store, TrendingUp, DollarSign, Phone, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Overview } from '@/components/dashboard/Overview';
import { RecentSales } from '@/components/dashboard/RecentSales';
import { useDashboardStats, useRevenueStats, useTopAstrologers } from '@/lib/hooks/use-dashboard';
import { useState } from 'react';
import { subDays, format } from 'date-fns';
import { CalendarIcon, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminDashboard() {
    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: subDays(new Date(), 30),
        to: new Date()
    });

    const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();

    const {
        data: revenueResponse,
        isLoading: revenueLoading
    } = useRevenueStats({
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd')
    });

    const {
        data: topAstrologersResponse,
        isLoading: topLoading
    } = useTopAstrologers();

    if (statsLoading || revenueLoading || topLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    if (statsError) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">Failed to load dashboard data</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    const dashboardData: any = stats?.data || {};
    const revenueStats = revenueResponse?.data || { totalRevenue: 0, growth: 0, chartData: [] };

    const revenueChartData = revenueStats.chartData?.map((item: any) => ({
        name: format(new Date(item.date), 'MMM dd'),
        total: item.revenue || 0
    })) || [];

    const topAstrologers = topAstrologersResponse?.data || [];

    return (
        <div className="space-y-8">
            {/* Header Section with Cream Background */}
            <div className="bg-[#FEFCE8] px-6 py-8 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-[1600px] mx-auto">
                    <div>
                        <h2 className="text-4xl font-extrabold text-[#022c22]">Overview</h2>
                        <p className="text-[#059669] font-semibold mt-1">
                            {format(new Date(), 'MMMM dd, yyyy')}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[260px] justify-start text-left font-medium border-emerald-200 bg-white/50 backdrop-blur-sm",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                                {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Date Range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={{ from: dateRange.from, to: dateRange.to }}
                                    onSelect={(val: any) => val && setDateRange(val)}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Download</Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 space-y-8 pb-10">
                {/* KPI Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Main Revenue Card - Large Gradient */}
                    <Card className="lg:col-span-2 card-gradient-emerald text-white border-none shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="h-24 w-24" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-emerald-100 text-lg font-medium tracking-wide">Revenue Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-black mb-3">
                                ₹{(revenueStats.totalRevenue || 0).toLocaleString()}
                            </div>
                            <div className="flex items-center text-sm font-semibold">
                                <TrendingUp className="h-4 w-4 mr-1.5 text-emerald-400" />
                                <span className="text-emerald-400">+{revenueStats.growth}%</span>
                                <span className="text-emerald-200/60 ml-2 font-normal">from last months</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Secondary Cards - Dark Green */}
                    <Card className="card-dark-green text-white border-none shadow-lg">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-white/60 text-sm font-medium">Active Sessions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">{(dashboardData.activeSessions || 0).toLocaleString()}</div>
                            <div className="flex items-center text-xs font-medium">
                                <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                                <span className="text-emerald-400">+1.2%</span>
                                <span className="text-white/40 ml-1.5 font-normal">from last months</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-dark-green text-white border-none shadow-lg">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-white/60 text-sm font-medium">Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">₹{(revenueStats.monthlyRevenue || 67890).toLocaleString()}</div>
                            <div className="flex items-center text-xs font-medium">
                                <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                                <span className="text-emerald-400">+1.2%</span>
                                <span className="text-white/40 ml-1.5 font-normal">from last months</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-dark-green text-white border-none shadow-lg">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-white/60 text-sm font-medium">Total Clients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">{(dashboardData.clients || 5450).toLocaleString()}</div>
                            <div className="flex items-center text-xs font-medium">
                                <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                                <span className="text-emerald-400">+1.2%</span>
                                <span className="text-white/40 ml-1.5 font-normal">from last months</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-dark-green text-white border-none shadow-lg">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-white/60 text-sm font-medium">Complaints / Feedback</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">5</div>
                            <div className="flex items-center text-xs font-medium">
                                <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                                <span className="text-emerald-400">+1.2%</span>
                                <span className="text-white/40 ml-1.5 font-normal">from last months</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Consultations Section */}
                <Card className="border-emerald-100 bg-chart-tint shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-900 text-lg font-bold italic">Daily Consultations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-emerald-950 mb-1">1,234</div>
                        <div className="text-sm font-medium text-emerald-700">
                            Last 30 Days <span className="text-emerald-600 font-bold">+15%</span>
                        </div>
                        <div className="h-[200px] mt-6 bg-white/40 rounded-lg p-4">
                            <Overview data={revenueChartData} color="#059669" type="bar" />
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Growth Section */}
                <Card className="border-emerald-100 bg-chart-tint shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-900 text-lg font-bold italic">Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-emerald-950 mb-1">₹55,678</div>
                        <div className="text-sm font-medium text-emerald-700">
                            Last 30 Days <span className="text-emerald-600 font-bold">+10%</span>
                        </div>
                        <div className="h-[200px] mt-6 bg-white/40 rounded-lg p-4">
                            <Overview data={revenueChartData} color="#059669" type="line" />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 border-emerald-100">
                        <CardHeader className="border-b bg-emerald-50/30">
                            <CardTitle className="text-emerald-900">Session Types (Chat / Call / Video)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="text-3xl font-black text-emerald-950 mb-1">597.04...</div>
                            <div className="text-xs font-semibold text-emerald-600 mb-6">Last 30 Days +2%</div>
                            <div className="h-[300px] flex items-center justify-center bg-cyan-50/30 rounded-xl relative border border-cyan-100">
                                {/* Placeholder for Pie Chart - Using Overview for now */}
                                <Overview data={[{ name: 'Chat', total: 200 }, { name: 'Call', total: 189 }, { name: 'Video', total: 208 }]} type="pie" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3 border-emerald-100">
                        <CardHeader className="border-b bg-emerald-50/30">
                            <CardTitle className="text-emerald-900">Top Performing Astrologers</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {topAstrologers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-10">No top performers found</p>
                                ) : (
                                    topAstrologers.slice(0, 5).map((astrologer: any, idx: number) => (
                                        <div key={astrologer._id} className="flex items-center">
                                            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mr-3">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 space-y-0.5">
                                                <p className="text-sm font-bold text-emerald-950">{astrologer.name}</p>
                                            </div>
                                            <div className="font-bold text-emerald-600">
                                                {idx === 0 ? '6.5' : idx === 1 ? '5.8' : '5.2'} hrs
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Astrologer Activity Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-emerald-100">
                        <CardHeader className="border-b bg-emerald-50/30">
                            <CardTitle className="text-emerald-900">Daily Astrologer Activity Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="bg-white border rounded-xl p-6 shadow-sm">
                                <div className="flex items-center text-emerald-600 mb-4">
                                    <Users className="h-5 w-5 mr-2" />
                                    <span className="font-semibold text-sm">Total Active Astrologers Today</span>
                                </div>
                                <div className="text-4xl font-black text-emerald-950 mb-1">42 Active</div>
                                <div className="text-xs text-muted-foreground mb-4 font-medium">Out of 60 total astrologers</div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-bold text-emerald-900 uppercase tracking-tight">
                                        <span>Active Rate</span>
                                        <span>70%</span>
                                    </div>
                                    <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-600 rounded-full w-[70%]" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border rounded-xl p-6 shadow-sm">
                                <div className="flex items-center text-emerald-600 mb-4">
                                    <CalendarIcon className="h-5 w-5 mr-2" />
                                    <span className="font-semibold text-sm">Engagement Hours Analytics</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Hours Today</p>
                                        <p className="text-2xl font-black text-emerald-950">126.5</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Avg Per Astrologer</p>
                                        <p className="text-2xl font-black text-emerald-950">3.2</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-100 overflow-hidden">
                        <CardHeader className="border-b bg-emerald-50/30">
                            <CardTitle className="text-emerald-900 flex items-center">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Hourly Engagement Today
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[300px]">
                            <Overview data={revenueChartData} type="bar" color="#059669" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
