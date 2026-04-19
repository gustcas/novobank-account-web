export type AccountStatus = "ACTIVE" | "BLOCKED" | "CLOSED";
export type AccountType = "SAVINGS" | "CHECKING";

export interface Account {
  id: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  customerId: string;
  createdAt: string;
}

export interface CreateAccountRequest {
  customerId: string;
  type: AccountType;
}
