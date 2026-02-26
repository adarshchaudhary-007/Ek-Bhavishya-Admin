/**
 * User Management Query Hooks
 * TanStack Query hooks for user operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserService } from '@/lib/services/user-service';
import { queryKeys } from '@/lib/query-keys';
import {
    PlatformUsersResponse,
    PaginationParams,
} from '@/types';

/**
 * Hook to fetch all users with pagination
 */
export function useUsers(params?: PaginationParams) {
    return useQuery({
        queryKey: queryKeys.users.list(params),
        queryFn: () => UserService.getAllUsers(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to block a user
 * Implements optimistic updates and cache invalidation
 */
export function useBlockUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => {
            console.log('[useBlockUser] Blocking user:', userId);
            return UserService.blockUser(userId);
        },
        onMutate: async (userId) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: queryKeys.users.lists() });

            // Snapshot the previous value for rollback
            const previousData = queryClient.getQueriesData({ queryKey: queryKeys.users.lists() });

            // Optimistically update to "Blocked" status
            queryClient.setQueriesData(
                { queryKey: queryKeys.users.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((user: any) =>
                            user._id === userId
                                ? { ...user, accountStatus: 'Blocked' }
                                : user
                        ),
                    };
                }
            );

            // Return context with previous data for rollback
            return { previousData };
        },
        onSuccess: (data) => {
            console.log('[useBlockUser] Success response:', data);
            toast.success(data.message || 'User blocked successfully');

            // Invalidate all user queries to refetch fresh data
            console.log('[useBlockUser] Invalidating user cache');
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all, refetchType: 'all' });
        },
        onError: (error: any, userId, context) => {
            console.error('[useBlockUser] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to block user';
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
