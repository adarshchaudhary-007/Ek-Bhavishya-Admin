/**
 * Query Keys Factory
 * Centralized query key management for TanStack Query
 */

import { PaginationParams, BlogFilterParams, DateRange, UsageParams } from '@/types';

export const queryKeys = {
    // Authentication
    auth: {
        all: ['auth'] as const,
        status: () => [...queryKeys.auth.all, 'status'] as const,
    },

    // Sellers
    sellers: {
        all: ['sellers'] as const,
        lists: () => [...queryKeys.sellers.all, 'list'] as const,
        list: (params?: PaginationParams) => [...queryKeys.sellers.lists(), params] as const,
        details: () => [...queryKeys.sellers.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.sellers.details(), id] as const,
    },

    // Notices
    notices: {
        all: ['notices'] as const,
        lists: () => [...queryKeys.notices.all, 'list'] as const,
        list: (params?: PaginationParams) => [...queryKeys.notices.lists(), params] as const,
        details: () => [...queryKeys.notices.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.notices.details(), id] as const,
        notifications: () => [...queryKeys.notices.all, 'notifications'] as const,
        notificationsByNotice: (noticeId: string, params?: PaginationParams) => 
            [...queryKeys.notices.notifications(), noticeId, params] as const,
    },

    // Blogs
    blogs: {
        all: ['blogs'] as const,
        lists: () => [...queryKeys.blogs.all, 'list'] as const,
        list: (params?: BlogFilterParams) => [...queryKeys.blogs.lists(), params] as const,
        details: () => [...queryKeys.blogs.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.blogs.details(), id] as const,
    },

    // Courses
    courses: {
        all: ['courses'] as const,
        lists: () => [...queryKeys.courses.all, 'list'] as const,
        list: (params?: PaginationParams) => [...queryKeys.courses.lists(), params] as const,
        adminCourses: {
            all: ['admin-courses'] as const,
            lists: () => [...queryKeys.courses.adminCourses.all, 'list'] as const,
            list: (params?: PaginationParams) => [...queryKeys.courses.adminCourses.lists(), params] as const,
        },
        details: () => [...queryKeys.courses.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    },

    // Astrologers
    astrologers: {
        all: ['astrologers'] as const,
        lists: () => [...queryKeys.astrologers.all, 'list'] as const,
        list: (params?: PaginationParams) => [...queryKeys.astrologers.lists(), params] as const,
        details: () => [...queryKeys.astrologers.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.astrologers.details(), id] as const,
        top: (params?: { limit?: number; startDate?: string; endDate?: string }) => 
            [...queryKeys.astrologers.all, 'top', params] as const,
    },

    // Dashboard
    dashboard: {
        all: ['dashboard'] as const,
        stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
        consultationStats: (dateRange?: DateRange) => [...queryKeys.dashboard.all, 'consultation-stats', dateRange] as const,
        revenueStats: (dateRange?: DateRange) => [...queryKeys.dashboard.all, 'revenue-stats', dateRange] as const,
        topAstrologers: (params?: { limit?: number; startDate?: string; endDate?: string }) => 
            [...queryKeys.dashboard.all, 'top-astrologers', params] as const,
        dailyUsage: (params?: UsageParams) => [...queryKeys.dashboard.all, 'daily-usage', params] as const,
        userActivity: () => [...queryKeys.dashboard.all, 'user-activity'] as const,
    },

    // Users (existing)
    users: {
        all: ['users'] as const,
        lists: () => [...queryKeys.users.all, 'list'] as const,
        list: (params?: PaginationParams) => [...queryKeys.users.lists(), params] as const,
        details: () => [...queryKeys.users.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.users.details(), id] as const,
    },

    // Calls (existing)
    calls: {
        all: ['calls'] as const,
        lists: () => [...queryKeys.calls.all, 'list'] as const,
        list: (params?: PaginationParams) => [...queryKeys.calls.lists(), params] as const,
        reports: () => [...queryKeys.calls.all, 'reports'] as const,
    },
} as const;

/**
 * Utility functions for cache invalidation
 */
export const invalidationHelpers = {
    // Invalidate all seller-related queries
    invalidateSellers: (queryClient: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sellers.all });
    },

    // Invalidate all notice-related queries
    invalidateNotices: (queryClient: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notices.all });
    },

    // Invalidate all blog-related queries
    invalidateBlogs: (queryClient: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
    },

    // Invalidate all course-related queries
    invalidateCourses: (queryClient: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },

    // Invalidate all astrologer-related queries
    invalidateAstrologers: (queryClient: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.astrologers.all });
    },

    // Invalidate all dashboard-related queries
    invalidateDashboard: (queryClient: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },

    // Invalidate all user-related queries
    invalidateUsers: (queryClient: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },

    // Invalidate specific seller detail
    invalidateSellerDetail: (queryClient: any, sellerId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.sellers.detail(sellerId) });
    },

    // Invalidate specific notice detail
    invalidateNoticeDetail: (queryClient: any, noticeId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notices.detail(noticeId) });
    },

    // Invalidate specific blog detail
    invalidateBlogDetail: (queryClient: any, blogId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.blogs.detail(blogId) });
    },
};