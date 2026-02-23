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
