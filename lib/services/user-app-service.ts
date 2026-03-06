import { AxiosError } from 'axios';
import api from '@/lib/axios';
import {
  ChatConversation,
  ChatMessage,
  OperationResponse,
  RemedyAstrologersResponse,
  UserAstrologer,
  UserCourse,
  UserRemedy,
  UserWalletResponse,
  WalletTransaction,
} from '@/types';

interface AddWalletPayload {
  amount: number;
}

interface SendMessagePayload {
  conversationId: string;
  content: string;
}

type UnknownData = { data?: unknown; conversations?: unknown; messages?: unknown; wallet?: unknown };

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  return [];
}

function extractList<T>(response: unknown, key?: keyof UnknownData): T[] {
  const payload = response as UnknownData;
  if (key && Array.isArray(payload[key])) {
    return payload[key] as T[];
  }
  if (Array.isArray(payload.data)) {
    return payload.data as T[];
  }
  return toArray<T>(payload);
}

async function getWithFallback<T>(primary: string, fallback: string, key?: keyof UnknownData): Promise<T[]> {
  try {
    const response = await api.get<unknown>(primary);
    return extractList<T>(response.data, key);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== 404) {
      throw error;
    }
    const response = await api.get<unknown>(fallback);
    return extractList<T>(response.data, key);
  }
}

export class UserAppService {
  static async getAstrologers(): Promise<UserAstrologer[]> {
    return getWithFallback<UserAstrologer>('/api/v1/astrologer', '/astrologers');
  }

  static async getAstrologerById(id: string): Promise<UserAstrologer> {
    const response = await api.get<unknown>(`/api/v1/astrologer/${id}`);
    const payload = response.data as { data?: UserAstrologer } | UserAstrologer;
    if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
      return payload.data as UserAstrologer;
    }
    return payload as UserAstrologer;
  }

  static async getMyEnrolledCourseIds(): Promise<Set<string>> {
    try {
      const response = await api.get<unknown>('/api/v1/user/courses/my-courses');
      const payload = response.data as { data?: { enrollments?: Array<{ course?: { _id?: string } | string | null; astrologerCourse?: { _id?: string } | string | null }> } };
      const enrollments = payload?.data?.enrollments ?? [];
      const ids = new Set<string>();
      for (const e of enrollments) {
        const c = e.course;
        const ac = e.astrologerCourse;
        if (c) ids.add(typeof c === 'string' ? c : (c._id ?? ''));
        if (ac) ids.add(typeof ac === 'string' ? ac : (ac._id ?? ''));
      }
      return ids;
    } catch {
      return new Set<string>();
    }
  }

  static async getCourses(): Promise<UserCourse[]> {
    try {
      const response = await api.get<unknown>('/api/v1/user/courses/courses');
      const payload = response.data as { data?: { adminCourses?: { courses?: unknown[] }; astrologerCourses?: { courses?: unknown[] } } };
      const admin = Array.isArray(payload?.data?.adminCourses?.courses) ? payload.data.adminCourses.courses : [];
      const astrologer = Array.isArray(payload?.data?.astrologerCourses?.courses) ? payload.data.astrologerCourses.courses : [];
      return [...admin, ...astrologer] as UserCourse[];
    } catch {
      return [];
    }
  }

  static async getRemedies(category?: string): Promise<UserRemedy[]> {
    const url = category 
      ? `/api/v1/user/remedies?category=${encodeURIComponent(category)}`
      : '/api/v1/user/remedies';
    return getWithFallback<UserRemedy>(url, '/remedies');
  }

  static async getRemedyById(id: string): Promise<UserRemedy> {
    const response = await api.get<unknown>(`/api/v1/user/remedies/${id}`);
    const payload = response.data as { data?: UserRemedy } | UserRemedy;
    if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
      return payload.data as UserRemedy;
    }
    return payload as UserRemedy;
  }

  static async getRemedyCategories(): Promise<string[]> {
    try {
      const response = await api.get<unknown>('/api/v1/user/remedies/categories');
      const payload = response.data as { data?: string[] };
      return payload?.data ?? [];
    } catch {
      return [];
    }
  }

  static async getAstrologersForRemedy(
    remedyId: string, 
    params?: { sortBy?: string; page?: number; limit?: number }
  ): Promise<RemedyAstrologersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `/api/v1/user/remedies/${remedyId}/astrologers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<unknown>(url);
    const payload = response.data as { data?: RemedyAstrologersResponse };
    return payload?.data ?? (payload as RemedyAstrologersResponse);
  }

  static async getWalletSummary(): Promise<UserWalletResponse['data']> {
    try {
      const [balanceRes, statsRes] = await Promise.allSettled([
        api.get('/api/v1/user/wallet/balance'),
        api.get('/api/v1/user/wallet/stats'),
      ]);

      const balanceData = balanceRes.status === 'fulfilled' ? balanceRes.value.data?.data : null;
      const statsData = statsRes.status === 'fulfilled' ? statsRes.value.data?.data : null;

      return {
        balance: balanceData?.walletBalance ?? statsData?.currentBalance ?? 0,
        totalAdded: statsData?.totalCredits ?? 0,
        totalSpent: statsData?.totalDebits ?? 0,
        pendingRefunds: 0,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status !== 404) {
        throw error;
      }
      return {
        balance: 0,
        totalSpent: 0,
        totalAdded: 0,
        pendingRefunds: 0,
      };
    }
  }

  static async getWalletTransactions(): Promise<WalletTransaction[]> {
    return getWithFallback<WalletTransaction>(
      '/api/v1/user/wallet/transactions',
      '/api/v1/user/transactions'
    );
  }

  static async addWalletMoney(payload: AddWalletPayload): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>('/api/v1/user/wallet/add-money', payload);
    return response.data;
  }

  static async getConversations(): Promise<ChatConversation[]> {
    try {
      const response = await api.get<unknown>('/api/v1/user/chat/history');
      const payload = response.data as { data?: { sessions?: unknown[] } };
      return (payload?.data?.sessions ?? []) as ChatConversation[];
    } catch {
      return [];
    }
  }

  static async getMessages(conversationId: string): Promise<ChatMessage[]> {
    return getWithFallback<ChatMessage>(
      `/api/v1/user/chat/${conversationId}/messages`,
      `/api/chat/sessions/${conversationId}/messages`,
      'messages'
    );
  }

  static async sendMessage(payload: SendMessagePayload): Promise<OperationResponse> {
    // Messages are sent via Socket.io (send_message event)
    // This method is kept for compatibility but actual message delivery 
    // is handled by the Socket.io handler which broadcasts new_message events
    return {
      success: true,
      message: 'Message sent via real-time connection',
    };
  }
}
