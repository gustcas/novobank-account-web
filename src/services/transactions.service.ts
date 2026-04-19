import { accountsApi } from "./api";
import type {
  DepositRequest,
  PaginatedTransactions,
  TransactionResponse,
  TransferRequest,
  WithdrawalRequest
} from "../types/transaction.types";

export const transactionsService = {
  getTransactions: async (accountId: string, page = 0, size = 20) => {
    const { data } = await accountsApi.get<PaginatedTransactions>(`/accounts/${accountId}/transactions`, {
      params: { page, size }
    });
    return data;
  },
  deposit: async (payload: DepositRequest) => {
    const { data } = await accountsApi.post<TransactionResponse>(`/accounts/${payload.accountId}/transactions/deposits`, {
      amount: payload.amount
    });
    return data;
  },
  withdraw: async (payload: WithdrawalRequest) => {
    const { data } = await accountsApi.post<TransactionResponse>(`/accounts/${payload.accountId}/transactions/withdrawals`, {
      amount: payload.amount
    });
    return data;
  },
  transfer: async (payload: TransferRequest) => {
    const { data } = await accountsApi.post<TransactionResponse[]>(
      `/accounts/${payload.sourceAccountId}/transactions/transfers`,
      { targetAccountId: payload.destinationAccountId, amount: payload.amount }
    );
    return data[0];
  }
};
