export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER_DEBIT" | "TRANSFER_CREDIT";
export type TransactionStatus = "SUCCESS" | "FAILED" | "REVERSED";

export interface Transaction {
  id: string;
  reference: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface PaginatedTransactions {
  content: Transaction[];
  page: number;
  size?: number;
  totalElements?: number;
  totalPages: number;
  last?: boolean;
}

export interface DepositRequest {
  accountId: string;
  amount: number;
}

export interface WithdrawalRequest extends DepositRequest {}

export interface TransferRequest {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
}

export interface TransactionResponse {
  id: string;
  reference: string;
  status: TransactionStatus;
}
