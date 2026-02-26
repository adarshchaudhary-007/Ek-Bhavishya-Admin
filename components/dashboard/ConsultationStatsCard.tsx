"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useConsultationStats } from '@/lib/hooks/use-dashboard';
import { CalendarIcon, Loader2, Phone, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from '@/types';

export function ConsultationStatsCard() {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
        from: subDays(new Date(), 30),
        to: new Date()
    });

    const formattedDateRange: DateRange | undefined = dateRange
        ? {
              startDate: format(dateRange.from, 'yyyy-MM-dd'),
              endDate: format(dateRange.to, 'yyyy-MM-dd')
          }
        : undefined;

    const { data, isLoading, error } = useConsultationStats(formattedDateRange);

    const stats = data?.data;

    return (
        <Card className="border-emerald-100 bg-chart-tint shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-emerald-900 text-lg font-bold italic">
                        Consultation Statistics
                    </CardTitle>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[240px] justify-start text-left font-medium border-emerald-200 bg-white/50",
                                    !dateRange && "text-muted-foreground"
                                )}
                                size="sm"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
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
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[200px] text-center">
                        <div>
                            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-red-600 font-medium">Failed to load consultation statistics</p>
                            <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
                        </div>
                    </div>
                ) : stats ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/60 rounded-lg p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone className="h-4 w-4 text-emerald-600" />
                                    <p className="text-xs font-medium text-emerald-700 uppercase">Total</p>
                                </div>
                                <p className="text-2xl font-black text-emerald-950">
                                    {stats.totalConsultations?.toLocaleString() || 0}
                                </p>
                            </div>

                            <div className="bg-white/60 rounded-lg p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                    <p className="text-xs font-medium text-blue-700 uppercase">Today</p>
                                </div>
                                <p className="text-2xl font-black text-blue-950">
                                    {stats.todayConsultations?.toLocaleString() || 0}
                                </p>
                            </div>

                            <div className="bg-white/60 rounded-lg p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <p className="text-xs font-medium text-green-700 uppercase">Completion</p>
                                </div>
                                <p className="text-2xl font-black text-green-950">
                                    {stats.completionRate?.toFixed(1) || 0}%
                                </p>
                            </div>

                            <div className="bg-white/60 rounded-lg p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-amber-600" />
                                    <p className="text-xs font-medium text-amber-700 uppercase">Avg Rating</p>
                                </div>
                                <p className="text-2xl font-black text-amber-950">
                                    {stats.averageRating?.toFixed(1) || 0}
                                </p>
                            </div>
                        </div>

                        <div className="text-xs text-emerald-600 font-medium text-center pt-2">
                            Showing data from {dateRange?.from && format(dateRange.from, 'MMM dd, yyyy')} to{' '}
                            {dateRange?.to && format(dateRange.to, 'MMM dd, yyyy')}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[200px] text-center">
                        <p className="text-sm text-muted-foreground italic">No consultation data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
