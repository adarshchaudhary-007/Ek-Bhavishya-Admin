/**
 * Astrologer Management API Service
 * Handles all astrologer-related API calls for admin operations
 */

import api from '@/lib/axios';
import {
    AstrologersResponse,
    OperationResponse,
    PaginationParams,
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
     */
    static async suspendAstrologer(id: string, reason?: string): Promise<OperationResponse> {
        console.log('[AstrologerService] suspendAstrologer called with id:', id);
        const response = await api.patch<OperationResponse>('/api/v1/admin/astrologers/suspend', {
            id,
            reason
        });
        console.log('[AstrologerService] suspendAstrologer response:', response.data);
        return response.data;
    }

    /**
     * Unsuspend an astrologer
     */
    static async unsuspendAstrologer(id: string): Promise<OperationResponse> {
        console.log('[AstrologerService] unsuspendAstrologer called with id:', id);
        const response = await api.patch<OperationResponse>('/api/v1/admin/astrologers/unsuspend', {
            id
        });
        console.log('[AstrologerService] unsuspendAstrologer response:', response.data);
        return response.data;
    }
}

// Export individual functions for easier importing
export const {
    getAllAstrologers,
    suspendAstrologer,
    unsuspendAstrologer,
} = AstrologerService;
