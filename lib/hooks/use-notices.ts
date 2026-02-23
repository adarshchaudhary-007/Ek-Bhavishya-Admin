/**
 * Notice Management Query Hooks
 * TanStack Query hooks for notice operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { NoticeService } from '@/lib/services/notice-service';
import { queryKeys, invalidationHelpers } from '@/lib/query-keys';
import {
    NoticesResponse,
    NoticeDetailResponse,
    NoticeResponse,
    CreateNoticeRequest,
    UpdateNoticeRequest,
    OperationResponse,
    PaginationParams,
    NotificationsResponse,
} from '@/types';

/**
 * Hook to fetch all notices with pagination
 */
export function useNotices(params?: PaginationParams) {
    return useQuery({
        queryKey: queryKeys.notices.list(params),
        queryFn: () => NoticeService.getAllNotices(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch notice details by ID
 */
export function useNoticeDetail(noticeId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: queryKeys.notices.detail(noticeId),
        queryFn: () => NoticeService.getNoticeById(noticeId),
        enabled: enabled && !!noticeId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch notification delivery status for a notice
 */
export function useNoticeNotifications(noticeId: string, params?: PaginationParams, enabled: boolean = true) {
    return useQuery({
        queryKey: queryKeys.notices.notificationsByNotice(noticeId, params),
        queryFn: () => NoticeService.getNoticeNotifications(noticeId, params),
        enabled: enabled && !!noticeId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

/**
 * Hook to create a new notice
 */
export function useCreateNotice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNoticeRequest) => {
            console.log('[useCreateNotice] Creating notice:', data);
            return NoticeService.createNotice(data);
        },
        onSuccess: (data) => {
            console.log('[useCreateNotice] Success response:', data);
            toast.success(data.message || 'Notice created successfully');

            // Invalidate all notice queries
            console.log('[useCreateNotice] Invalidating notice cache');
            queryClient.invalidateQueries({ queryKey: queryKeys.notices.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useCreateNotice] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create notice';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to update a notice
 */
export function useUpdateNotice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateNoticeRequest) => {
            console.log('[useUpdateNotice] Updating notice:', data);
            return NoticeService.updateNotice(data);
        },
        onSuccess: (data, variables) => {
            console.log('[useUpdateNotice] Success response:', data);
            toast.success(data.message || 'Notice updated successfully');

            // Update cache optimistically
            console.log('[useUpdateNotice] Updating cache for all notice queries');
            queryClient.setQueriesData(
                { queryKey: queryKeys.notices.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((notice: any) =>
                            notice._id === variables.noticeId
                                ? { ...notice, title: variables.title, message: variables.message }
                                : notice
                        ),
                    };
                }
            );

            // Invalidate all notice queries
            console.log('[useUpdateNotice] Invalidating notice cache');
            queryClient.invalidateQueries({ queryKey: queryKeys.notices.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useUpdateNotice] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update notice';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to delete a notice
 */
export function useDeleteNotice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noticeId: string) => {
            console.log('[useDeleteNotice] Deleting notice:', noticeId);
            return NoticeService.deleteNotice(noticeId);
        },
        onSuccess: (data, noticeId) => {
            console.log('[useDeleteNotice] Success response:', data);
            toast.success(data.message || 'Notice deleted successfully');

            // Update cache optimistically
            console.log('[useDeleteNotice] Updating cache for all notice queries');
            queryClient.setQueriesData(
                { queryKey: queryKeys.notices.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.filter((notice: any) => notice._id !== noticeId),
                    };
                }
            );

            // Invalidate all notice queries
            console.log('[useDeleteNotice] Invalidating notice cache');
            queryClient.invalidateQueries({ queryKey: queryKeys.notices.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useDeleteNotice] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete notice';
            toast.error(errorMessage);
        },
    });
}
