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

export function useUserCourses() {
  return useQuery({
    queryKey: queryKeys.userApp.courses(),
    queryFn: () => UserAppService.getCourses(),
  });
}

export function useUserRemedies() {
  return useQuery({
    queryKey: queryKeys.userApp.remedies(),
    queryFn: () => UserAppService.getRemedies(),
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
