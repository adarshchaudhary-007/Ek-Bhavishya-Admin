"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDailyUsage } from '@/lib/hooks/use-dashboard';
import { CalendarIcon, Loader2, XCircle, Users, UserPlus, Activity, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { UsageParams } from '@/types';

type DisplayFormat = 'table' | 'chart';

export function DailyUsageReport() {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
        from: subDays(new Date(), 30),
        to: new Date()
    });
    const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('table');

    const params: UsageParams = {
        ...(dateRange && {
            startDate: format(dateRange.from, 'yyyy-MM-dd'),
            endDate: format(dateRange.to, 'yyyy-MM-dd')
        }),
        format: 'daily'
    };

    const { data, isLoading, error } = useDailyUsage(params);

    const usageData = data?.data || [];

    // Calculate totals
    const totals = usageData.reduce(
        (acc, day) => ({
            activeUsers: acc.activeUsers + (day.activeUsers || 0),
            newUsers: acc.newUsers + (day.newUsers || 0),
            consultations: acc.consultations + (day.consultations || 0),
            revenue: acc.revenue + (day.revenue || 0)
        }),
        { activeUsers: 0, newUsers: 0, consultations: 0, revenue: 0 }
    );

    return (
        <Card className="border-blue-100 bg-blue-50/30 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-blue-900 text-lg font-bold italic">
                        Daily Usage Report
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={displayFormat} onValueChange={(val) => setDisplayFormat(val as DisplayFormat)}>
                            <SelectTrigger className="w-[120px] border-blue-200 bg-white/50">
                                <SelectValue placeholder="Format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="table">Table</SelectItem>
                                <SelectItem value="chart">Chart</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[240px] justify-start text-left font-medium border-blue-200 bg-white/50",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                    size="sm"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "MMM dd, yyyy")
                                        )
                                    ) : (
                                        <span>Select date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={(val: any) => val && setDateRange(val)}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[300px] text-center">
                        <div>
                            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-red-600 font-medium">Failed to load daily usage data</p>
                            <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
                        </div>
                    </div>
                ) : usageData.length > 0 ? (
                    <div className="space-y-4">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    <p className="text-xs font-medium text-blue-700 uppercase">Active Users</p>
                                </div>
                                <p className="text-2xl font-black text-blue-950">
                                    {totals.activeUsers.toLocaleString()}
                                </p>
                            </div>

                            <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserPlus className="h-4 w-4 text-green-600" />
                                    <p className="text-xs font-medium text-green-700 uppercase">New Users</p>
                                </div>
                                <p className="text-2xl font-black text-green-950">
                                    {totals.newUsers.toLocaleString()}
                                </p>
                            </div>

                            <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="h-4 w-4 text-purple-600" />
                                    <p className="text-xs font-medium text-purple-700 uppercase">Consultations</p>
                                </div>
                                <p className="text-2xl font-black text-purple-950">
                                    {totals.consultations.toLocaleString()}
                                </p>
                            </div>

                            <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-amber-600" />
                                    <p className="text-xs font-medium text-amber-700 uppercase">Revenue</p>
                                </div>
                                <p className="text-2xl font-black text-amber-950">
                                    ₹{totals.revenue.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Data Display */}
                        {displayFormat === 'table' ? (
                            <div className="bg-white/60 rounded-lg border border-blue-100 overflow-hidden">
                                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="bg-blue-100/50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                                    Active Users
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                                    New Users
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                                    Consultations
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                                    Revenue
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-blue-100">
                                            {usageData.map((day) => (
                                                <tr key={day.date} className="hover:bg-blue-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <span className="text-sm font-medium text-blue-950">
                                                            {format(new Date(day.date), 'MMM dd, yyyy')}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-sm font-semibold text-blue-700">
                                                            {day.activeUsers?.toLocaleString() || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-sm font-semibold text-green-700">
                                                            {day.newUsers?.toLocaleString() || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-sm font-semibold text-purple-700">
                                                            {day.consultations?.toLocaleString() || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-sm font-bold text-amber-700">
                                                            ₹{day.revenue?.toLocaleString() || 0}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/60 rounded-lg border border-blue-100 p-8">
                                <div className="flex items-center justify-center h-[300px] text-center">
                                    <div>
                                        <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                                        <p className="text-sm text-blue-600 font-medium">Chart view coming soon</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Use table view to see detailed daily usage data
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-xs text-blue-600 font-medium text-center pt-2">
                            Showing {usageData.length} days from {dateRange?.from && format(dateRange.from, 'MMM dd, yyyy')} to{' '}
                            {dateRange?.to && format(dateRange.to, 'MMM dd, yyyy')}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-center">
                        <p className="text-sm text-muted-foreground italic">No usage data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
