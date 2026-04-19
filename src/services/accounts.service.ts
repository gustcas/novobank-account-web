import { accountsApi } from "./api";
import type { Account, CreateAccountRequest } from "../types/account.types";
import type { PaginatedTransactions } from "../types/transaction.types";

export const accountsService = {
  getAccounts: async (customerId: string) => {
    const { data } = await accountsApi.get<Account[]>("/accounts", {
      params: { customerId }
    });
    return data;
  },
  getAccountById: async (accountId: string) => {
    const { data } = await accountsApi.get<Account>(`/accounts/${accountId}`);
    return data;
  },
  createAccount: async (payload: CreateAccountRequest) => {
    const { data } = await accountsApi.post<Account>("/accounts", payload);
    return data;
  },
  getTransactionsByAccount: async (accountId: string, page = 0, size = 10) => {
    const { data } = await accountsApi.get<PaginatedTransactions>(`/accounts/${accountId}/transactions`, {
      params: { page, size }
    });
    return data;
  }
};
