/**
 * Admin Profile Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminService } from '@/lib/services/admin-service';

const ADMIN_KEYS = {
    profile: ['admin', 'profile'] as const,
};

export function useAdminProfile() {
    return useQuery({
        queryKey: ADMIN_KEYS.profile,
        queryFn: () => AdminService.getProfile(),
    });
}

export function useUpdateAdminProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name?: string; email?: string }) => {
            return AdminService.updateProfile(data);
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Profile updated successfully');
            queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.profile });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        },
    });
}

export function useChangeAdminPassword() {
    return useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) => {
            return AdminService.changePassword(data);
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Password changed successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to change password');
        },
    });
}
