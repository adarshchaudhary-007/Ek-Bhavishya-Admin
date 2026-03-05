/**
 * User Management API Service
 * Handles all user-related API calls for admin operations
 */

import api from '@/lib/axios';
import {
    PlatformUsersResponse,
    OperationResponse,
    PaginationParams,
    BlockUserRequest,
    UnblockUserRequest,
} from '@/types';

export class UserService {
    /**
     * Get all platform users with optional pagination
     */
    static async getAllUsers(params?: PaginationParams): Promise<PlatformUsersResponse> {
        console.log('[UserService] getAllUsers called with params:', params);
        const response = await api.get<PlatformUsersResponse>('/api/v1/admin/users', { params });
        console.log('[UserService] getAllUsers response:', response.data);
        return response.data;
    }

    /**
     * Block a user
     * @param userId - The ID of the user to block
     */
    static async blockUser(userId: string): Promise<OperationResponse> {
        console.log('[UserService] blockUser called with userId:', userId);
        const response = await api.patch<OperationResponse>('/api/v1/admin/users/block', {
            id: userId
        });
        console.log('[UserService] blockUser response:', response.data);
        return response.data;
    }

    /**
     * Unblock a user
     * @param userId - The ID of the user to unblock
     */
    static async unblockUser(userId: string): Promise<OperationResponse> {
        console.log('[UserService] unblockUser called with userId:', userId);
        const response = await api.patch<OperationResponse>('/api/v1/admin/users/unblock', {
            id: userId
        });
        console.log('[UserService] unblockUser response:', response.data);
        return response.data;
    }

    /**
     * Update user details
     * @param userId - The ID of the user to update
     * @param data - The data to update
     */
    static async updateUser(userId: string, data: any): Promise<OperationResponse> {
        console.log('[UserService] updateUser called with userId:', userId, 'data:', data);
        const response = await api.patch<OperationResponse>(`/api/v1/admin/users/${userId}`, data);
        console.log('[UserService] updateUser response:', response.data);
        return response.data;
    }

    /**
     * Delete a user
     * @param userId - The ID of the user to delete
     */
    static async deleteUser(userId: string): Promise<OperationResponse> {
        console.log('[UserService] deleteUser called with userId:', userId);
        const response = await api.delete<OperationResponse>(`/api/v1/admin/users/${userId}`);
        console.log('[UserService] deleteUser response:', response.data);
        return response.data;
    }
}

// Export individual functions for easier importing
export const {
    getAllUsers,
    blockUser,
    unblockUser,
    updateUser,
    deleteUser,
} = UserService;
