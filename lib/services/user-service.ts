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
        const response = await api.post<OperationResponse>('/api/v1/admin/users/block', {
            userId
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
        const response = await api.post<OperationResponse>('/api/v1/admin/users/unblock', {
            userId
        });
        console.log('[UserService] unblockUser response:', response.data);
        return response.data;
    }
}

// Export individual functions for easier importing
export const {
    getAllUsers,
    blockUser,
    unblockUser,
} = UserService;
