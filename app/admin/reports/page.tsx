"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Download, RefreshCw } from "lucide-react"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { useDailyUsage } from "@/lib/hooks/use-dashboard"
import { UsageChart } from "@/components/dashboard/UsageChart"
import { Badge } from "@/components/ui/badge"

export default function ReportsPage() {
    const [date, setDate] = useState<{
        from: Date
        to: Date
    }>({
        from: subDays(new Date(), 30),
        to: new Date(),
    })

    const { data: usageData, isLoading, error, refetch, isFetching } = useDailyUsage({
        startDate: format(date.from, 'yyyy-MM-dd'),
        endDate: format(date.to, 'yyyy-MM-dd'),
    })

    const handleRefresh = () => {
        refetch()
    }

    const totalSessions = usageData?.data?.reduce((acc, curr) => acc + curr.sessions, 0) || 0
    const totalNewUsers = usageData?.data?.reduce((acc, curr) => acc + curr.newUsers, 0) || 0
    const avgActiveUsers = usageData?.data?.length
        ? Math.round(usageData.data.reduce((acc, curr) => acc + curr.activeUsers, 0) / usageData.data.length)
        : 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Usage Reports</h2>
                    <p className="text-muted-foreground">
                        Analyze platform usage metrics and user growth
                    </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
                        <RefreshCw className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[260px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={{ from: date.from, to: date.to }}
                            onSelect={(val: any) => val && setDate(val)}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">In selected period</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalNewUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Account creations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgActiveUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Daily average</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Usage Trends</CardTitle>
                    <CardDescription>
                        Visual representation of platform activity
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    {isLoading ? (
                        <div className="h-[350px] flex items-center justify-center">
                            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="h-[350px] flex items-center justify-center text-destructive">
                            Failed to load usage data
                        </div>
                    ) : (
                        <UsageChart data={usageData?.data || []} />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
