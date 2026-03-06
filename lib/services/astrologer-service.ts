/**
 * Astrologer Management API Service
 * Handles all astrologer-related API calls for admin operations
 */

import api from '@/lib/axios';
import {
    AstrologersResponse,
    OperationResponse,
    PaginationParams,
    SuspendAstrologerRequest,
    UnsuspendAstrologerRequest,
} from '@/types';

export class AstrologerService {
    /**
     * Get all astrologers with pagination
     */
    static async getAllAstrologers(params?: PaginationParams): Promise<AstrologersResponse> {
        console.log('[AstrologerService] getAllAstrologers called with params:', params);
        const response = await api.get<AstrologersResponse>('/api/v1/admin/astrologers', { params });
        console.log('[AstrologerService] getAllAstrologers response:', response.data);
        return response.data;
    }

    /**
     * Suspend an astrologer
     * Endpoint: PATCH /api/v1/admin/astrologers/suspend
     */
    static async suspendAstrologer(data: SuspendAstrologerRequest): Promise<OperationResponse> {
        console.log('[AstrologerService] suspendAstrologer called with data:', data);
        const response = await api.patch<OperationResponse>('/api/v1/admin/astrologers/suspend', data);
        console.log('[AstrologerService] suspendAstrologer response:', response.data);
        return response.data;
    }

    /**
     * Unsuspend an astrologer
     * Supports both general unsuspend and call-specific unsuspend
     */
    static async unsuspendAstrologer(data: UnsuspendAstrologerRequest): Promise<OperationResponse> {
        console.log('[AstrologerService] unsuspendAstrologer called with data:', data);

        // If it's a call-specific unsuspend (POST /astrologers/:id/unsuspend)
        if (data.adminNotes && !data.unsuspensionNotes) {
            const response = await api.post<OperationResponse>(`/api/v1/admin/astrologers/${data.id}/unsuspend`, {
                adminNotes: data.adminNotes
            });
            return response.data;
        }

        // General unsuspend (PATCH /api/v1/admin/astrologers/unsuspend)
        const response = await api.patch<OperationResponse>('/api/v1/admin/astrologers/unsuspend', data);
        console.log('[AstrologerService] unsuspendAstrologer response:', response.data);
        return response.data;
    }

    /**
     * Delete an astrologer
     */
    static async deleteAstrologer(id: string): Promise<OperationResponse> {
        console.log('[AstrologerService] deleteAstrologer called with id:', id);
        const response = await api.delete<OperationResponse>(`/api/v1/admin/astrologers/${id}`);
        console.log('[AstrologerService] deleteAstrologer response:', response.data);
        return response.data;
    }

    /**
     * Update astrologer profile
     */
    static async updateAstrologer(id: string, data: any): Promise<OperationResponse> {
        console.log('[AstrologerService] updateAstrologer called with id:', id, 'data:', data);
        const response = await api.patch<OperationResponse>(`/api/v1/admin/astrologers/${id}`, data);
        console.log('[AstrologerService] updateAstrologer response:', response.data);
        return response.data;
    }
}

// Export individual functions for easier importing
export const {
    getAllAstrologers,
    suspendAstrologer,
    unsuspendAstrologer,
    deleteAstrologer,
    updateAstrologer,
} = AstrologerService;
