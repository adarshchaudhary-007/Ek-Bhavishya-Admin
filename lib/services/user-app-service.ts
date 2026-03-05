import { AxiosError } from 'axios';
import api from '@/lib/axios';
import {
  ChatConversation,
  ChatMessage,
  OperationResponse,
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

  static async getCourses(): Promise<UserCourse[]> {
    return getWithFallback<UserCourse>('/api/v1/user/courses/courses', '/courses');
  }

  static async getRemedies(): Promise<UserRemedy[]> {
    return getWithFallback<UserRemedy>('/api/v1/user/remedies', '/remedies');
  }

  static async getWalletSummary(): Promise<UserWalletResponse['data']> {
    try {
      const response = await api.get<UserWalletResponse>('/api/v1/user/wallet');
      return response.data.data;
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
    return getWithFallback<ChatConversation>('/api/v1/user/chat/history', '/api/chat/sessions', 'conversations');
  }

  static async getMessages(conversationId: string): Promise<ChatMessage[]> {
    return getWithFallback<ChatMessage>(
      `/api/v1/user/chat/${conversationId}/messages`,
      `/api/chat/sessions/${conversationId}/messages`,
      'messages'
    );
  }

  static async sendMessage(payload: SendMessagePayload): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>('/api/v1/user/chat/messages', payload);
    return response.data;
  }
}
