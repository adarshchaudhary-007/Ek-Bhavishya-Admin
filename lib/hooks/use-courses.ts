/**
 * Course Management Query Hooks
 * TanStack Query hooks for course operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CourseService, CourseSearchParams } from '@/lib/services/course-service';
import { queryKeys } from '@/lib/query-keys';
import {
    CoursesResponse,
    CourseResponse,
    CreateCourseRequest,
    UpdateCourseRequest,
    OperationResponse,
    PaginationParams,
} from '@/types';

/**
 * Hook to fetch all courses (seller courses) with optional search/pagination
 */
export function useAllCourses(params?: CourseSearchParams) {
    return useQuery({
        queryKey: queryKeys.courses.list(params),
        queryFn: () => CourseService.getAllCourses(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch all admin courses with pagination
 */
export function useAdminCourses(params?: PaginationParams) {
    return useQuery({
        queryKey: queryKeys.courses.adminCourses.list(params),
        queryFn: () => CourseService.getAdminCourses(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch admin course details by ID
 */
export function useAdminCourseDetail(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: [...queryKeys.courses.adminCourses.all, 'detail', id],
        queryFn: () => CourseService.getAdminCourseById(id),
        enabled: enabled && !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to approve a course
 */
export function useApproveCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            console.log('[useApproveCourse] Approving course:', id);
            return CourseService.approveCourse(id);
        },
        onSuccess: (data, courseId) => {
            console.log('[useApproveCourse] Success response:', data);
            toast.success(data.message || 'Course approved successfully');

            // Update cache optimistically
            queryClient.setQueriesData(
                { queryKey: queryKeys.courses.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((course: any) =>
                            course._id === courseId
                                ? { ...course, status: 'Approved' }
                                : course
                        ),
                    };
                }
            );

            // Invalidate all course queries
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useApproveCourse] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to approve course';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to reject a course
 */
export function useRejectCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
            console.log('[useRejectCourse] Rejecting course:', id);
            return CourseService.rejectCourse(id, rejectionReason);
        },
        onSuccess: (data, variables) => {
            console.log('[useRejectCourse] Success response:', data);
            toast.success(data.message || 'Course rejected successfully');

            // Update cache optimistically
            queryClient.setQueriesData(
                { queryKey: queryKeys.courses.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((course: any) =>
                            course._id === variables.id
                                ? { ...course, status: 'Rejected', rejectionReason: variables.rejectionReason }
                                : course
                        ),
                    };
                }
            );

            // Invalidate all course queries
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useRejectCourse] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to reject course';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to create an admin course
 */
export function useCreateAdminCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCourseRequest) => {
            console.log('[useCreateAdminCourse] Creating course:', data);
            return CourseService.createAdminCourse(data);
        },
        onSuccess: (data) => {
            console.log('[useCreateAdminCourse] Success response:', data);
            toast.success('Course created successfully');

            // Invalidate all admin course queries
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.adminCourses.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useCreateAdminCourse] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create course';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to update an admin course
 */
export function useUpdateAdminCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCourseRequest) => {
            console.log('[useUpdateAdminCourse] Updating course:', data);
            return CourseService.updateAdminCourse(data);
        },
        onSuccess: (data, variables) => {
            console.log('[useUpdateAdminCourse] Success response:', data);
            toast.success('Course updated successfully');

            // Update cache optimistically
            queryClient.setQueriesData(
                { queryKey: queryKeys.courses.adminCourses.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((course: any) =>
                            course._id === variables.id
                                ? { ...course, ...variables }
                                : course
                        ),
                    };
                }
            );

            // Invalidate all admin course queries
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.adminCourses.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useUpdateAdminCourse] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update course';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to delete an admin course
 */
export function useDeleteAdminCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => {
            console.log('[useDeleteAdminCourse] Deleting course:', courseId);
            return CourseService.deleteAdminCourse(courseId);
        },
        onSuccess: (data, courseId) => {
            console.log('[useDeleteAdminCourse] Success response:', data);
            toast.success(data.message || 'Course deleted successfully');

            // Update cache optimistically
            queryClient.setQueriesData(
                { queryKey: queryKeys.courses.adminCourses.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.filter((course: any) => course._id !== courseId),
                    };
                }
            );

            // Invalidate all admin course queries
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.adminCourses.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useDeleteAdminCourse] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete course';
            toast.error(errorMessage);
        },
    });
}
