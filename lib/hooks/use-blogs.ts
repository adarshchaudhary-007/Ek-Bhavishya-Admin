/**
 * Blog Management Query Hooks
 * TanStack Query hooks for blog operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BlogService } from '@/lib/services/blog-service';
import { queryKeys } from '@/lib/query-keys';
import {
    BlogFilterParams,
} from '@/types';

/**
 * Hook to fetch all blogs with filtering and pagination
 */
export function useBlogs(params?: BlogFilterParams) {
    return useQuery({
        queryKey: queryKeys.blogs.list(params),
        queryFn: () => BlogService.getAllBlogs(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch blog details by ID
 */
export function useBlogDetail(blogId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: queryKeys.blogs.detail(blogId),
        queryFn: () => BlogService.getBlogById(blogId),
        enabled: enabled && !!blogId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to approve a blog
 */
export function useApproveBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (blogId: string) => {
            console.log('[useApproveBlog] Approving blog:', blogId);
            return BlogService.approveBlog(blogId);
        },
        onSuccess: (data) => {
            console.log('[useApproveBlog] Success response:', data);
            toast.success(data.message || 'Blog approved successfully');

            // Invalidate all blog queries
            console.log('[useApproveBlog] Invalidating blog cache');
            queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useApproveBlog] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to approve blog';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to reject a blog
 */
export function useRejectBlog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ blogId, reason }: { blogId: string; reason: string }) => {
            console.log('[useRejectBlog] Rejecting blog:', blogId, 'Reason:', reason);
            return BlogService.rejectBlog(blogId, reason);
        },
        onSuccess: (data) => {
            console.log('[useRejectBlog] Success response:', data);
            toast.success(data.message || 'Blog rejected successfully');

            // Invalidate all blog queries
            console.log('[useRejectBlog] Invalidating blog cache');
            queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useRejectBlog] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to reject blog';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to revert blog status
 * Implements optimistic updates and cache invalidation with rollback on error
 */
export function useRevertBlogStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ blogId, currentStatus, reason }: { blogId: string; currentStatus: 'Approved' | 'Rejected'; reason: string }) => {
            console.log('[useRevertBlogStatus] Reverting blog status:', blogId, 'Current status:', currentStatus, 'Reason:', reason);
            return BlogService.revertBlogStatus(blogId, currentStatus, reason);
        },
        onMutate: async ({ blogId, currentStatus }) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: queryKeys.blogs.lists() });

            // Snapshot the previous value for rollback
            const previousData = queryClient.getQueriesData({ queryKey: queryKeys.blogs.lists() });

            // Determine the new status based on current status
            const newStatus = currentStatus === 'Approved' ? 'Rejected' : 'Approved';

            // Optimistically update to the new status
            queryClient.setQueriesData(
                { queryKey: queryKeys.blogs.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((blog: any) =>
                            blog._id === blogId
                                ? { ...blog, status: newStatus }
                                : blog
                        ),
                    };
                }
            );

            // Return context with previous data for rollback
            return { previousData };
        },
        onSuccess: (data) => {
            console.log('[useRevertBlogStatus] Success response:', data);
            toast.success(data.message || 'Blog status reverted successfully');

            // Invalidate all blog queries to refetch fresh data
            console.log('[useRevertBlogStatus] Invalidating blog cache');
            queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all, refetchType: 'all' });
        },
        onError: (error: any, variables, context) => {
            console.error('[useRevertBlogStatus] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to revert blog status';
            toast.error(errorMessage);

            // Rollback optimistic update on error
            if (context?.previousData) {
                context.previousData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
    });
}
