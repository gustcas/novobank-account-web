import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsService } from "../services/accounts.service";
import type { CreateAccountRequest } from "../types/account.types";

export const useAccounts = (customerId?: string) =>
  useQuery({
    queryKey: ["accounts", customerId],
    queryFn: () => accountsService.getAccounts(customerId!),
    enabled: Boolean(customerId)
  });

export const useAccount = (accountId: string) =>
  useQuery({
    queryKey: ["account", accountId],
    queryFn: () => accountsService.getAccountById(accountId),
    enabled: Boolean(accountId)
  });

export const useAccountTransactions = (accountId: string, page: number) =>
  useQuery({
    queryKey: ["account-transactions", accountId, page],
    queryFn: () => accountsService.getTransactionsByAccount(accountId, page),
    enabled: Boolean(accountId)
  });

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountRequest) => accountsService.createAccount(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    }
  });
};
