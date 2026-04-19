import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "../services/transactions.service";
import type { Account } from "../types/account.types";
import type { DepositRequest, TransferRequest, WithdrawalRequest } from "../types/transaction.types";

const adjustAccountBalance = (account: Account | undefined, delta: number) =>
  account
    ? {
        ...account,
        balance: Math.max(0, account.balance + delta)
      }
    : account;

const snapshotAccountQueries = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.getQueriesData<Account[]>({
    queryKey: ["accounts"]
  });

const restoreAccountQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  snapshots: ReturnType<typeof snapshotAccountQueries>
) => {
  snapshots.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
};

const updateAccountLists = (queryClient: ReturnType<typeof useQueryClient>, accountId: string, delta: number) => {
  queryClient.setQueriesData<Account[]>({ queryKey: ["accounts"] }, (current) =>
    current?.map((account) => (account.id === accountId ? adjustAccountBalance(account, delta)! : account))
  );
};

export const useTransactions = (accountId?: string, page = 0) =>
  useQuery({
    queryKey: ["transactions", accountId, page],
    queryFn: () => transactionsService.getTransactions(accountId!, page),
    enabled: Boolean(accountId)
  });

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DepositRequest) => transactionsService.deposit(payload),
    onMutate: async (payload) => {
      const accountsSnapshot = snapshotAccountQueries(queryClient);
      const accountSnapshot = queryClient.getQueryData<Account>(["account", payload.accountId]);

      updateAccountLists(queryClient, payload.accountId, payload.amount);
      queryClient.setQueryData<Account>(["account", payload.accountId], (current) => adjustAccountBalance(current, payload.amount));

      return { accountsSnapshot, accountSnapshot };
    },
    onError: (_error, payload, context) => {
      if (!context) {
        return;
      }

      restoreAccountQueries(queryClient, context.accountsSnapshot);
      queryClient.setQueryData(["account", payload.accountId], context.accountSnapshot);
    },
    onSuccess: async (_result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["accounts"] }),
        queryClient.invalidateQueries({ queryKey: ["account", payload.accountId] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["account-transactions"] })
      ]);
    }
  });
};

export const useWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WithdrawalRequest) => transactionsService.withdraw(payload),
    onMutate: async (payload) => {
      const accountsSnapshot = snapshotAccountQueries(queryClient);
      const accountSnapshot = queryClient.getQueryData<Account>(["account", payload.accountId]);

      updateAccountLists(queryClient, payload.accountId, -payload.amount);
      queryClient.setQueryData<Account>(["account", payload.accountId], (current) => adjustAccountBalance(current, -payload.amount));

      return { accountsSnapshot, accountSnapshot };
    },
    onError: (_error, payload, context) => {
      if (!context) {
        return;
      }

      restoreAccountQueries(queryClient, context.accountsSnapshot);
      queryClient.setQueryData(["account", payload.accountId], context.accountSnapshot);
    },
    onSuccess: async (_result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["accounts"] }),
        queryClient.invalidateQueries({ queryKey: ["account", payload.accountId] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["account-transactions"] })
      ]);
    }
  });
};

export const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransferRequest) => transactionsService.transfer(payload),
    onMutate: async (payload) => {
      const accountsSnapshot = snapshotAccountQueries(queryClient);
      const sourceSnapshot = queryClient.getQueryData<Account>(["account", payload.sourceAccountId]);
      const destinationSnapshot = queryClient.getQueryData<Account>(["account", payload.destinationAccountId]);

      updateAccountLists(queryClient, payload.sourceAccountId, -payload.amount);
      updateAccountLists(queryClient, payload.destinationAccountId, payload.amount);
      queryClient.setQueryData<Account>(["account", payload.sourceAccountId], (current) => adjustAccountBalance(current, -payload.amount));
      queryClient.setQueryData<Account>(["account", payload.destinationAccountId], (current) => adjustAccountBalance(current, payload.amount));

      return { accountsSnapshot, sourceSnapshot, destinationSnapshot };
    },
    onError: (_error, payload, context) => {
      if (!context) {
        return;
      }

      restoreAccountQueries(queryClient, context.accountsSnapshot);
      queryClient.setQueryData(["account", payload.sourceAccountId], context.sourceSnapshot);
      queryClient.setQueryData(["account", payload.destinationAccountId], context.destinationSnapshot);
    },
    onSuccess: async (_result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["accounts"] }),
        queryClient.invalidateQueries({ queryKey: ["account", payload.sourceAccountId] }),
        queryClient.invalidateQueries({ queryKey: ["account", payload.destinationAccountId] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["account-transactions"] })
      ]);
    }
  });
};
