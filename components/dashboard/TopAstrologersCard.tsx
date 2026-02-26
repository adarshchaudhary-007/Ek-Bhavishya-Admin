"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTopAstrologers } from '@/lib/hooks/use-dashboard';
import { CalendarIcon, Loader2, XCircle, Star, TrendingUp, Award } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { TopAstrologersParams } from '@/types';

export function TopAstrologersCard() {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
        from: subDays(new Date(), 30),
        to: new Date()
    });
    const [limit, setLimit] = useState<number>(20);

    const params: TopAstrologersParams = {
        limit,
        ...(dateRange && {
            startDate: format(dateRange.from, 'yyyy-MM-dd'),
            endDate: format(dateRange.to, 'yyyy-MM-dd')
        })
    };

    const { data, isLoading, error } = useTopAstrologers(params);

    const astrologers = data?.data || [];

    return (
        <Card className="border-purple-100 bg-purple-50/30 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-purple-900 text-lg font-bold italic">
                        Top Performing Astrologers
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={limit.toString()} onValueChange={(val) => setLimit(Number(val))}>
                            <SelectTrigger className="w-[100px] border-purple-200 bg-white/50">
                                <SelectValue placeholder="Limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">Top 10</SelectItem>
                                <SelectItem value="20">Top 20</SelectItem>
                                <SelectItem value="50">Top 50</SelectItem>
                                <SelectItem value="100">Top 100</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[240px] justify-start text-left font-medium border-purple-200 bg-white/50",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                    size="sm"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-purple-600" />
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
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[300px] text-center">
                        <div>
                            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-red-600 font-medium">Failed to load top astrologers</p>
                            <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
                        </div>
                    </div>
                ) : astrologers.length > 0 ? (
                    <div className="space-y-4">
                        <div className="bg-white/60 rounded-lg border border-purple-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-purple-100/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                                                Astrologer
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-purple-900 uppercase tracking-wider">
                                                Consultations
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-purple-900 uppercase tracking-wider">
                                                Revenue
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-purple-900 uppercase tracking-wider">
                                                Rating
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-100">
                                        {astrologers.map((astrologer, index) => {
                                            const revenue = astrologer.totalRevenue || astrologer.totalEarnings || 0;
                                            const rating = astrologer.averageRating || astrologer.rating || 0;
                                            
                                            return (
                                                <tr key={astrologer._id} className="hover:bg-purple-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            {index < 3 ? (
                                                                <Award className={cn(
                                                                    "h-5 w-5",
                                                                    index === 0 && "text-yellow-500",
                                                                    index === 1 && "text-gray-400",
                                                                    index === 2 && "text-amber-600"
                                                                )} />
                                                            ) : (
                                                                <span className="text-sm font-medium text-purple-700 w-5 text-center">
                                                                    {index + 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-purple-950">
                                                                {astrologer.name}
                                                            </p>
                                                            <p className="text-xs text-purple-600">
                                                                {astrologer.email}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <TrendingUp className="h-3 w-3 text-blue-600" />
                                                            <span className="text-sm font-semibold text-blue-950">
                                                                {astrologer.totalConsultations?.toLocaleString() || 0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-sm font-bold text-green-700">
                                                            ₹{revenue.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                            <span className="text-sm font-semibold text-amber-950">
                                                                {rating.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="text-xs text-purple-600 font-medium text-center pt-2">
                            Showing top {astrologers.length} astrologers from {dateRange?.from && format(dateRange.from, 'MMM dd, yyyy')} to{' '}
                            {dateRange?.to && format(dateRange.to, 'MMM dd, yyyy')}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-center">
                        <p className="text-sm text-muted-foreground italic">No astrologer data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
