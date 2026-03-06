import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getAllProducts,
    getProductById,
    approveProduct,
    rejectProduct,
    revertProduct,
    deleteProduct
} from '@/lib/services/product-service';

export const useProducts = (params?: any) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => getAllProducts(params)
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
        enabled: !!id
    });
};

export const useApproveProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => approveProduct(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(data.message || 'Product approved successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to approve product');
        }
    });
};

export const useRejectProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string, reason?: string }) => rejectProduct(id, reason),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(data.message || 'Product rejected successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to reject product');
        }
    });
};

export const useRevertProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => revertProduct(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(data.message || 'Product reverted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to revert product');
        }
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(data.message || 'Product deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    });
};
