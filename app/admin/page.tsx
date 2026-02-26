"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, Store, TrendingUp, DollarSign, Phone, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Overview } from '@/components/dashboard/Overview';
import { RecentSales } from '@/components/dashboard/RecentSales';
import { useDashboardStats, useRevenueStats, useTopAstrologers, useConsultationStats } from '@/lib/hooks/use-dashboard';
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

    const {
        data: consultationResponse,
        isLoading: consultationLoading
    } = useConsultationStats({
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd')
    });

    if (statsLoading || revenueLoading || topLoading || consultationLoading) {
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
    const revenueStats = revenueResponse?.data || { totalRevenue: 0, periodRevenue: 0, growth: 0, chartData: [] };
    const consultationStats = consultationResponse?.data || { totalConsultations: 0, todayConsultations: 0, averageRating: 0, completionRate: 0 };

    const revenueChartData = revenueStats.chartData?.map((item: any) => ({
        name: format(new Date(item.date), 'MMM dd'),
        total: item.revenue || 0
    })) || [];

    // Use revenue graph from API if available
    const revenueGraphData = revenueResponse?.data?.revenueGraph?.map((item: any) => ({
        name: format(new Date(item.date), 'MMM dd'),
        total: item.amount || 0
    })) || revenueChartData;

    const topAstrologers = topAstrologersResponse?.data || [];

    const handleDownloadPDF = async () => {
        try {
            // Dynamic import to reduce bundle size
            const jsPDF = (await import('jspdf')).default;
            const doc = new jsPDF();

            // Title
            doc.setFontSize(20);
            doc.setTextColor(5, 150, 105); // Emerald color
            doc.text('Dashboard Report', 20, 20);

            // Date range
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 20, 30);
            doc.text(`Period: ${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`, 20, 36);

            // Revenue Stats
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('Revenue Statistics', 20, 50);
            doc.setFontSize(10);
            doc.text(`Total Revenue: ₹${(revenueStats.totalRevenue || 0).toLocaleString()}`, 30, 58);
            doc.text(`Monthly Revenue: ₹${(revenueResponse?.data?.periodStats?.totalRevenue || 0).toLocaleString()}`, 30, 64);
            doc.text(`Growth: +${revenueStats.growth || 0}%`, 30, 70);

            // Dashboard Stats
            doc.setFontSize(14);
            doc.text('Key Metrics', 20, 85);
            doc.setFontSize(10);
            doc.text(`Active Sessions: ${(dashboardData.activeSessions || 0).toLocaleString()}`, 30, 93);
            doc.text(`Total Clients: ${(dashboardData.clients || 0).toLocaleString()}`, 30, 99);

            // Consultation Stats
            doc.setFontSize(14);
            doc.text('Consultation Statistics', 20, 114);
            doc.setFontSize(10);
            doc.text(`Total Consultations: ${consultationStats.totalConsultations?.toLocaleString() || 0}`, 30, 122);
            doc.text(`Today's Consultations: ${consultationStats.todayConsultations?.toLocaleString() || 0}`, 30, 128);
            doc.text(`Average Rating: ${consultationStats.averageRating?.toFixed(1) || 0}`, 30, 134);
            doc.text(`Completion Rate: ${consultationStats.completionRate?.toFixed(1) || 0}%`, 30, 140);

            // Top Astrologers
            if (topAstrologers.length > 0) {
                doc.setFontSize(14);
                doc.text('Top Astrologers', 20, 155);
                doc.setFontSize(10);
                let yPos = 163;
                topAstrologers.slice(0, 5).forEach((astrologer: any, idx: number) => {
                    doc.text(`${idx + 1}. ${astrologer.name}`, 30, yPos);
                    yPos += 6;
                });
            }

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Generated by Admin Dashboard', 20, 280);

            // Save the PDF
            doc.save(`dashboard-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section with Cream Background */}
            <div className="bg-[#FEFCE8] dark:bg-slate-800 px-6 py-8 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-[1600px] mx-auto">
                    <div>
                        <h2 className="text-4xl font-extrabold text-[#022c22] dark:text-slate-100">Overview</h2>
                        <p className="text-[#059669] dark:text-emerald-400 font-semibold mt-1">
                            {format(new Date(), 'MMMM dd, yyyy')}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[260px] justify-start text-left font-medium border-emerald-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm !text-slate-900 dark:!text-slate-100",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleDownloadPDF}
                        >
                            Download
                        </Button>
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
                                <span className="text-emerald-400">
                                    {dashboardData.activeSessionsGrowth ? `+${dashboardData.activeSessionsGrowth}%` : '+0%'}
                                </span>
                                <span className="text-white/40 ml-1.5 font-normal">from last period</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-dark-green text-white border-none shadow-lg">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-white/60 text-sm font-medium">Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">
                                ₹{(revenueResponse?.data?.periodStats?.totalRevenue || 0).toLocaleString()}
                            </div>
                            <div className="flex items-center text-xs font-medium">
                                <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                                <span className="text-emerald-400">
                                    {revenueResponse?.data?.periodStats?.growthPercentage 
                                        ? `+${revenueResponse.data.periodStats.growthPercentage}%`
                                        : '+0%'}
                                </span>
                                <span className="text-white/40 ml-1.5 font-normal">from last period</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-dark-green text-white border-none shadow-lg">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-white/60 text-sm font-medium">Total Clients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">{(dashboardData.clients || 0).toLocaleString()}</div>
                            <div className="flex items-center text-xs font-medium">
                                <TrendingUp className="h-3 w-3 mr-1 text-emerald-400" />
                                <span className="text-emerald-400">
                                    {dashboardData.clientsGrowth ? `+${dashboardData.clientsGrowth}%` : '+0%'}
                                </span>
                                <span className="text-white/40 ml-1.5 font-normal">from last period</span>
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
                        <div className="text-4xl font-black text-emerald-950 mb-1">
                            {consultationStats.totalConsultations?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm font-medium text-emerald-700">
                            Last {dateRange ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) : 30} Days
                            {consultationStats.growthPercentage && (
                                <span className="text-emerald-600 font-bold ml-2">
                                    +{consultationStats.growthPercentage}%
                                </span>
                            )}
                        </div>
                        <div className="h-[200px] mt-6 bg-white/40 rounded-lg p-4">
                            <Overview data={consultationStats.dailyBreakdown?.map((item: any) => ({
                                name: format(new Date(item.date), 'MMM dd'),
                                total: item.count || 0
                            })) || revenueGraphData} color="#059669" type="bar" />
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Growth Section */}
                <Card className="border-emerald-100 bg-chart-tint shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-900 text-lg font-bold italic">Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-emerald-950 mb-1">
                            ₹{(revenueResponse?.data?.periodStats?.totalRevenue || 0).toLocaleString()}
                        </div>
                        <div className="text-sm font-medium text-emerald-700">
                            Last {dateRange ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) : 30} Days
                            {revenueResponse?.data?.periodStats?.growthPercentage && (
                                <span className="text-emerald-600 font-bold ml-2">
                                    +{revenueResponse.data.periodStats.growthPercentage}%
                                </span>
                            )}
                        </div>
                        <div className="h-[200px] mt-6 bg-white/40 rounded-lg p-4">
                            <Overview data={revenueGraphData} color="#059669" type="line" />
                        </div>
                    </CardContent>
                </Card>

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 border-none shadow-sm shadow-emerald-100 overflow-hidden">
                        <CardHeader className="border-b border-emerald-50 bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-emerald-950 text-lg font-black">Consultation Channels</CardTitle>
                                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Live Analytics</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                <div className="md:col-span-7 h-[300px] relative order-2 md:order-1">
                                    <Overview data={[
                                        { name: 'Chat', total: consultationStats.channelBreakdown?.chat || 200 }, 
                                        { name: 'Call', total: consultationStats.channelBreakdown?.call || 189 }, 
                                        { name: 'Video', total: consultationStats.channelBreakdown?.video || 208 }
                                    ]} type="pie" />
                                </div>
                                <div className="md:col-span-5 space-y-4 order-1 md:order-2">
                                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                        <p className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-1">Total Consultations</p>
                                        <div className="text-4xl font-black text-emerald-950 tracking-tighter tabular-nums">
                                            {(consultationStats.channelBreakdown?.chat || 200) + 
                                             (consultationStats.channelBreakdown?.call || 189) + 
                                             (consultationStats.channelBreakdown?.video || 208)}
                                        </div>
                                        <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            {consultationStats.channelGrowth ? `+${consultationStats.channelGrowth}%` : '+2.4%'} from last month
                                        </p>
                                    </div>
                                    <div className="space-y-2 px-1">
                                        {['Chat', 'Call', 'Video'].map((type, i) => (
                                            <div key={type} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ['#059669', '#10b981', '#34d399'][i] }} />
                                                    <span className="font-bold text-emerald-900/60 uppercase">{type}</span>
                                                </div>
                                                <span className="font-black text-emerald-950 tabular-nums">
                                                    {i === 0 ? (consultationStats.channelBreakdown?.chat || 200) : 
                                                     i === 1 ? (consultationStats.channelBreakdown?.call || 189) : 
                                                     (consultationStats.channelBreakdown?.video || 208)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3 border-none shadow-sm shadow-emerald-100">
                        <CardHeader className="border-b border-emerald-50 bg-white">
                            <CardTitle className="text-emerald-950 text-lg font-black">Top Astrologers</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                {topAstrologers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-10 italic">No rankings available</p>
                                ) : (
                                    topAstrologers.slice(0, 5).map((astrologer: any, idx: number) => (
                                        <div key={astrologer._id} className="flex items-center group">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-emerald-950 underline decoration-emerald-200 decoration-2 underline-offset-4 line-clamp-1">{astrologer.name}</p>
                                            </div>
                                            <div className="text-sm font-black text-emerald-600 whitespace-nowrap ml-2">
                                                {idx === 0 ? '6.5' : idx === 1 ? '5.8' : '5.2'} hrs
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Analytics */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-emerald-600 rounded-full" />
                        <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Astrologer Activity Analytics</h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-none shadow-sm shadow-emerald-100 overflow-hidden">
                            <CardHeader className="border-b border-emerald-50 bg-white/80">
                                <CardTitle className="text-emerald-950 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <Users className="h-4 w-4 text-emerald-600" />
                                    Availability Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-4xl font-black text-emerald-950 tabular-nums">42 <span className="text-lg text-emerald-600/60 font-black">/ 60</span></div>
                                        <p className="text-[10px] font-bold text-emerald-800/40 uppercase mt-1">Active Astrologers Today</p>
                                    </div>
                                    <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                        <div className="text-2xl font-black text-emerald-700">70<span className="text-xs">%</span></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest">
                                        <span>Daily Performance Rate</span>
                                        <span className="text-emerald-700">High Engagement</span>
                                    </div>
                                    <div className="h-3 w-full bg-emerald-50 rounded-full p-0.5 border border-emerald-100 shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-[70%] shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-1000" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/30">
                                        <p className="text-[10px] font-bold text-emerald-800/40 uppercase mb-1">Total Hours</p>
                                        <p className="text-xl font-black text-emerald-950 tracking-tight">126.5 <span className="text-xs text-emerald-600">hrs</span></p>
                                    </div>
                                    <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/30">
                                        <p className="text-[10px] font-bold text-emerald-800/40 uppercase mb-1">Avg Session</p>
                                        <p className="text-xl font-black text-emerald-950 tracking-tight">3.2 <span className="text-xs text-emerald-600">hrs</span></p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm shadow-emerald-100 overflow-hidden">
                            <CardHeader className="border-b border-emerald-50 bg-white/80">
                                <CardTitle className="text-emerald-950 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    Hourly Engagement Pulse
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="h-[280px]">
                                    <Overview data={revenueGraphData} type="bar" color="#10b981" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
