/**
 * Seller Management API Service
 * Handles all seller-related API operations
 */

import api from '@/lib/axios';
import { 
    SellersResponse, 
    SellerDetailResponse, 
    OperationResponse, 
    PaginationParams 
} from '@/types';

export class SellerService {
    /**
     * Get all sellers with optional pagination
     * Note: This endpoint is under /api/v1/seller/admin, not /api/v1/admin
     */
    static async getAllSellers(params?: PaginationParams): Promise<SellersResponse> {
        const queryParams = new URLSearchParams();
        
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        // This endpoint is NOT under the baseURL - it's at /api/v1/seller/admin/all-sellers
        const response = await api.get<any>(
            `/api/v1/seller/admin/all-sellers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        );
        
        console.log('[SellerService] getAllSellers response:', response.data);
        
        // Normalize response: API returns 'sellers' array but we want 'data'
        const normalizedResponse: SellersResponse = {
            success: response.data.success,
            count: response.data.count,
            data: response.data.sellers || response.data.data || [],
        };
        
        console.log('[SellerService] getAllSellers normalized:', normalizedResponse);
        
        return normalizedResponse;
    }

    /**
     * Get seller details by ID
     */
    static async getSellerById(id: string): Promise<SellerDetailResponse> {
        console.log('[SellerService] getSellerById called with id:', id);
        const response = await api.post<any>('/api/v1/admin/sellers/get-by-id', {
            id
        });
        
        console.log('[SellerService] getSellerById response:', response.data);
        
        // API returns seller object directly (not wrapped in data)
        const normalizedResponse: SellerDetailResponse = {
            success: true,
            data: response.data
        };
        
        console.log('[SellerService] getSellerById normalized:', normalizedResponse);
        
        return normalizedResponse;
    }

    /**
     * Approve a seller
     */
    static async approveSeller(id: string): Promise<OperationResponse> {
        console.log('[SellerService] approveSeller called with id:', id);
        const response = await api.patch<any>('/api/v1/admin/sellers/approve', {
            id
        });
        console.log('[SellerService] approveSeller response:', response.data);
        return response.data;
    }

    /**
     * Reject a seller
     */
    static async rejectSeller(id: string): Promise<OperationResponse> {
        console.log('[SellerService] rejectSeller called with id:', id);
        const response = await api.patch<any>('/api/v1/admin/sellers/reject', {
            id
        });
        console.log('[SellerService] rejectSeller response:', response.data);
        return response.data;
    }

    /**
     * Revert seller status (toggle between approved/rejected)
     */
    static async revertSellerStatus(id: string): Promise<OperationResponse> {
        console.log('[SellerService] revertSellerStatus called with id:', id);
        const response = await api.patch<any>('/api/v1/admin/sellers/revert', {
            id
        });
        console.log('[SellerService] revertSellerStatus response:', response.data);
        return response.data;
    }
}

// Export individual functions for easier importing
export const {
    getAllSellers,
    getSellerById,
    approveSeller,
    rejectSeller,
    revertSellerStatus,
} = SellerService;