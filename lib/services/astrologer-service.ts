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
     */
    static async suspendAstrologer(data: SuspendAstrologerRequest): Promise<OperationResponse> {
        console.log('[AstrologerService] suspendAstrologer called with data:', data);
        const response = await api.post<OperationResponse>('/api/v1/admin/astrologers/suspend', data);
        console.log('[AstrologerService] suspendAstrologer response:', response.data);
        return response.data;
    }

    /**
     * Unsuspend an astrologer
     */
    static async unsuspendAstrologer(data: UnsuspendAstrologerRequest): Promise<OperationResponse> {
        console.log('[AstrologerService] unsuspendAstrologer called with data:', data);
        const response = await api.post<OperationResponse>('/api/v1/admin/astrologers/unsuspend', data);
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
