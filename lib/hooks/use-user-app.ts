import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserAppService } from '@/lib/services/user-app-service';
import { queryKeys } from '@/lib/query-keys';

export function useUserAstrologers() {
  return useQuery({
    queryKey: queryKeys.userApp.astrologers(),
    queryFn: () => UserAppService.getAstrologers(),
  });
}

export function useAstrologerProfile(id: string) {
  return useQuery({
    queryKey: queryKeys.userApp.astrologerProfile(id),
    queryFn: () => UserAppService.getAstrologerById(id),
    enabled: !!id,
  });
}

export function useUserCourses() {
  return useQuery({
    queryKey: queryKeys.userApp.courses(),
    queryFn: () => UserAppService.getCourses(),
  });
}

export function useMyEnrolledCourseIds() {
  return useQuery({
    queryKey: queryKeys.userApp.enrolledCourses(),
    queryFn: () => UserAppService.getMyEnrolledCourseIds(),
  });
}

export function useUserRemedies(category?: string) {
  return useQuery({
    queryKey: queryKeys.userApp.remedies(category),
    queryFn: () => UserAppService.getRemedies(category),
  });
}

export function useRemedyDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.userApp.remedyDetail(id),
    queryFn: () => UserAppService.getRemedyById(id),
    enabled: !!id,
  });
}

export function useRemedyCategories() {
  return useQuery({
    queryKey: queryKeys.userApp.remedyCategories(),
    queryFn: () => UserAppService.getRemedyCategories(),
  });
}

export function useRemedyAstrologers(
  remedyId: string,
  params?: { sortBy?: string; page?: number; limit?: number }
) {
  return useQuery({
    queryKey: queryKeys.userApp.remedyAstrologers(remedyId, params),
    queryFn: () => UserAppService.getAstrologersForRemedy(remedyId, params),
    enabled: !!remedyId,
  });
}

export function useWalletSummary() {
  return useQuery({
    queryKey: queryKeys.userApp.wallet.summary(),
    queryFn: () => UserAppService.getWalletSummary(),
  });
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: queryKeys.userApp.wallet.transactions(),
    queryFn: () => UserAppService.getWalletTransactions(),
  });
}

export function useAddWalletMoney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => UserAppService.addWalletMoney({ amount }),
    onSuccess: (data) => {
      toast.success(data.message || 'Money added to wallet');
      queryClient.invalidateQueries({ queryKey: queryKeys.userApp.wallet.all });
    },
    onError: (error: unknown) => {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
          ? (error as { message: string }).message
          : 'Failed to add wallet money';
      toast.error(message);
    },
  });
}

export function useChatConversations() {
  return useQuery({
    queryKey: queryKeys.userApp.chat.conversations(),
    queryFn: () => UserAppService.getConversations(),
  });
}

export function useChatMessages(conversationId: string | null) {
  return useQuery({
    queryKey: queryKeys.userApp.chat.messages(conversationId ?? ''),
    queryFn: () => UserAppService.getMessages(conversationId ?? ''),
    enabled: Boolean(conversationId),
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { conversationId: string; content: string }) =>
      UserAppService.sendMessage(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userApp.chat.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.userApp.chat.conversations() });
    },
  });
}
