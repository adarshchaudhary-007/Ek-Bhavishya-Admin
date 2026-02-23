/**
 * Dashboard Analytics API Service
 * Handles all dashboard-related API calls for admin operations
 */

import api from '@/lib/axios';
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

export class DashboardService {
    /**
     * Get dashboard overview stats
     */
    static async getDashboardStats(): Promise<DashboardStatsResponse> {
        console.log('[DashboardService] getDashboardStats called');
        const response = await api.get<DashboardStatsResponse>('/api/v1/admin/dashboard/stats');
        console.log('[DashboardService] getDashboardStats response:', response.data);
        return response.data;
    }

    /**
     * Get consultation statistics
     */
    static async getConsultationStats(): Promise<ConsultationStatsResponse> {
        console.log('[DashboardService] getConsultationStats called');
        const response = await api.get<ConsultationStatsResponse>('/api/v1/admin/dashboard/consultation-stats');
        console.log('[DashboardService] getConsultationStats response:', response.data);
        return response.data;
    }

    /**
     * Get revenue statistics with date range
     */
    static async getRevenueStats(dateRange?: DateRange): Promise<RevenueStatsResponse> {
        console.log('[DashboardService] getRevenueStats called with dateRange:', dateRange);
        const response = await api.get<RevenueStatsResponse>('/api/v1/admin/dashboard/revenue-stats', {
            params: dateRange
        });
        console.log('[DashboardService] getRevenueStats response:', response.data);
        return response.data;
    }

    /**
     * Get top performing astrologers
     */
    static async getTopAstrologers(): Promise<TopAstrologersResponse> {
        console.log('[DashboardService] getTopAstrologers called');
        const response = await api.get<TopAstrologersResponse>('/api/v1/admin/dashboard/top-astrologers');
        console.log('[DashboardService] getTopAstrologers response:', response.data);
        return response.data;
    }

    /**
     * Get daily usage analytics
     */
    static async getDailyUsage(params?: UsageParams): Promise<UsageResponse> {
        console.log('[DashboardService] getDailyUsage called with params:', params);
        const response = await api.get<UsageResponse>('/api/v1/admin/reports/daily-usage', {
            params
        });
        console.log('[DashboardService] getDailyUsage response:', response.data);
        return response.data;
    }

    /**
     * Get user activity metrics
     */
    static async getUserActivity(): Promise<UserActivityResponse> {
        console.log('[DashboardService] getUserActivity called');
        const response = await api.get<UserActivityResponse>('/api/v1/admin/dashboard/user-activity');
        console.log('[DashboardService] getUserActivity response:', response.data);
        return response.data;
    }
}

// Export individual functions for easier importing
export const {
    getDashboardStats,
    getConsultationStats,
    getRevenueStats,
    getTopAstrologers,
    getDailyUsage,
    getUserActivity,
} = DashboardService;
