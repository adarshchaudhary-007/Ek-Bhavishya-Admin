/**
 * Product Management API Service
 * Handles all product-related API calls for admin operations
 */

import api from '@/lib/axios';
import {
    ProductsResponse,
    ProductResponse,
    OperationResponse,
    PaginationParams,
} from '@/types';

export interface ProductSearchParams extends PaginationParams {
    status?: string;
    search?: string;
    seller_id?: string;
}

export class ProductService {
    /**
     * Get all products with optional filters
     */
    static async getAllProducts(params?: ProductSearchParams): Promise<ProductsResponse> {
        const response = await api.get<ProductsResponse>('/api/v1/admin/products', { params });
        return response.data;
    }

    /**
     * Get product by ID
     */
    static async getProductById(id: string): Promise<ProductResponse> {
        const response = await api.get<ProductResponse>(`/api/v1/admin/products/${id}`);
        return response.data;
    }

    /**
     * Approve/Publish a product
     */
    static async approveProduct(id: string): Promise<OperationResponse> {
        const response = await api.patch<OperationResponse>(`/api/v1/admin/products/${id}/approve`);
        return response.data;
    }

    /**
     * Reject a product
     */
    static async rejectProduct(id: string, rejectionReason?: string): Promise<OperationResponse> {
        const response = await api.patch<OperationResponse>(`/api/v1/admin/products/${id}/reject`, {
            rejectionReason
        });
        return response.data;
    }

    /**
     * Revert product to Draft
     */
    static async revertProduct(id: string): Promise<OperationResponse> {
        const response = await api.patch<OperationResponse>(`/api/v1/admin/products/${id}/revert`);
        return response.data;
    }

    /**
     * Edit a product
     */
    static async editProduct(id: string, data: any): Promise<OperationResponse> {
        const response = await api.patch<OperationResponse>(`/api/v1/admin/products/${id}`, data);
        return response.data;
    }

    /**
     * Delete a product
     */
    static async deleteProduct(id: string): Promise<OperationResponse> {
        const response = await api.delete<OperationResponse>(`/api/v1/admin/products/${id}`);
        return response.data;
    }
}

export const {
    getAllProducts,
    getProductById,
    approveProduct,
    rejectProduct,
    revertProduct,
    editProduct,
    deleteProduct
} = ProductService;
