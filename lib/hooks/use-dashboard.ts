/**
 * Dashboard Analytics Query Hooks
 * TanStack Query hooks for dashboard operations
 */

import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/lib/services/dashboard-service';
import { queryKeys } from '@/lib/query-keys';
import {
    DashboardStatsResponse,
    ConsultationStatsResponse,
    RevenueStatsResponse,
    TopAstrologersResponse,
    UsageResponse,
    UserActivityResponse,
    DateRange,
    UsageParams,
} from '@/types';

/**
 * Hook to fetch dashboard overview stats
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.dashboard.stats(),
        queryFn: () => DashboardService.getDashboardStats(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    });
}

/**
 * Hook to fetch consultation statistics
 */
export function useConsultationStats() {
    return useQuery({
        queryKey: queryKeys.dashboard.consultationStats(),
        queryFn: () => DashboardService.getConsultationStats(),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    });
}

/**
 * Hook to fetch revenue statistics with date range
 */
export function useRevenueStats(dateRange?: DateRange) {
    return useQuery({
        queryKey: queryKeys.dashboard.revenueStats(dateRange),
        queryFn: () => DashboardService.getRevenueStats(dateRange),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!dateRange, // Only fetch if date range is provided
    });
}

/**
 * Hook to fetch top performing astrologers
 */
export function useTopAstrologers() {
    return useQuery({
        queryKey: queryKeys.dashboard.topAstrologers(),
        queryFn: () => DashboardService.getTopAstrologers(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook to fetch daily usage analytics
 */
export function useDailyUsage(params?: UsageParams) {
    return useQuery({
        queryKey: queryKeys.dashboard.dailyUsage(params),
        queryFn: () => DashboardService.getDailyUsage(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch user activity metrics
 */
export function useUserActivity() {
    return useQuery({
        queryKey: queryKeys.dashboard.userActivity(),
        queryFn: () => DashboardService.getUserActivity(),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    });
}
