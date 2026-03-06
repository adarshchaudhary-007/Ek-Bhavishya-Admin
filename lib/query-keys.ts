/**
 * Query Keys Factory
 * Centralized query key management for TanStack Query
 */

import { PaginationParams, BlogFilterParams, DateRange, UsageParams } from '@/types';

export const queryKeys = {
    // Authentication
    auth: {
        all: ['auth'] as const,
        status: () => ['auth', 'status'] as const,
    },

    // Sellers
    sellers: {
        all: ['sellers'] as const,
        lists: () => ['sellers', 'list'] as const,
        list: (params?: PaginationParams) => ['sellers', 'list', params] as const,
        details: () => ['sellers', 'detail'] as const,
        detail: (id: string) => ['sellers', 'detail', id] as const,
    },

    // Notices
    notices: {
        all: ['notices'] as const,
        lists: () => ['notices', 'list'] as const,
        list: (params?: PaginationParams) => ['notices', 'list', params] as const,
        details: () => ['notices', 'detail'] as const,
        detail: (id: string) => ['notices', 'detail', id] as const,
        notifications: () => ['notices', 'notifications'] as const,
        notificationsByNotice: (noticeId: string, params?: PaginationParams) => 
            ['notices', 'notifications', noticeId, params] as const,
    },

    // Blogs
    blogs: {
        all: ['blogs'] as const,
        lists: () => ['blogs', 'list'] as const,
        list: (params?: BlogFilterParams) => ['blogs', 'list', params] as const,
        details: () => ['blogs', 'detail'] as const,
        detail: (id: string) => ['blogs', 'detail', id] as const,
    },

    // Courses
    courses: {
        all: ['courses'] as const,
        lists: () => ['courses', 'list'] as const,
        list: (params?: PaginationParams) => ['courses', 'list', params] as const,
        adminCourses: {
            all: ['admin-courses'] as const,
            lists: () => ['admin-courses', 'list'] as const,
            list: (params?: PaginationParams) => ['admin-courses', 'list', params] as const,
        },
        details: () => ['courses', 'detail'] as const,
        detail: (id: string) => ['courses', 'detail', id] as const,
    },

    // Astrologers
    astrologers: {
        all: ['astrologers'] as const,
        lists: () => ['astrologers', 'list'] as const,
        list: (params?: PaginationParams) => ['astrologers', 'list', params] as const,
        details: () => ['astrologers', 'detail'] as const,
        detail: (id: string) => ['astrologers', 'detail', id] as const,
        top: (params?: { limit?: number; startDate?: string; endDate?: string }) => 
            ['astrologers', 'top', params] as const,
    },

    // Dashboard
    dashboard: {
        all: ['dashboard'] as const,
        stats: () => ['dashboard', 'stats'] as const,
        consultationStats: (dateRange?: DateRange) => ['dashboard', 'consultation-stats', dateRange] as const,
        revenueStats: (dateRange?: DateRange) => ['dashboard', 'revenue-stats', dateRange] as const,
        topAstrologers: (params?: { limit?: number; startDate?: string; endDate?: string }) => 
            ['dashboard', 'top-astrologers', params] as const,
        dailyUsage: (params?: UsageParams) => ['dashboard', 'daily-usage', params] as const,
        userActivity: () => ['dashboard', 'user-activity'] as const,
    },

    // Users (existing)
    users: {
        all: ['users'] as const,
        lists: () => ['users', 'list'] as const,
        list: (params?: PaginationParams) => ['users', 'list', params] as const,
        details: () => ['users', 'detail'] as const,
        detail: (id: string) => ['users', 'detail', id] as const,
    },

    // Calls (existing)
    calls: {
        all: ['calls'] as const,
        lists: () => ['calls', 'list'] as const,
        list: (params?: PaginationParams) => ['calls', 'list', params] as const,
        reports: () => ['calls', 'reports'] as const,
    },

    // User App (frontend user role)
    userApp: {
        all: ['user-app'] as const,
        astrologers: () => ['user-app', 'astrologers'] as const,
        astrologerProfile: (id: string) => ['user-app', 'astrologer', id] as const,
        courses: () => ['user-app', 'courses'] as const,
        enrolledCourses: () => ['user-app', 'enrolled-courses'] as const,
        remedies: (category?: string) => ['user-app', 'remedies', category] as const,
        remedyDetail: (id: string) => ['user-app', 'remedy', id] as const,
        remedyCategories: () => ['user-app', 'remedy-categories'] as const,
        remedyAstrologers: (id: string, params?: { sortBy?: string; page?: number; limit?: number }) => 
            ['user-app', 'remedy-astrologers', id, params] as const,
        wallet: {
            all: ['user-app', 'wallet'] as const,
            summary: () => ['user-app', 'wallet', 'summary'] as const,
            transactions: () => ['user-app', 'wallet', 'transactions'] as const,
        },
        chat: {
            all: ['user-app', 'chat'] as const,
            conversations: () => ['user-app', 'chat', 'conversations'] as const,
            messages: (conversationId: string) =>
                ['user-app', 'chat', 'messages', conversationId] as const,
        },
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