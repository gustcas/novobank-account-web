import type { TransactionType } from "../types/transaction.types";

const labels: Record<TransactionType, string> = {
  DEPOSIT: "Deposito",
  WITHDRAWAL: "Retiro",
  TRANSFER_DEBIT: "Transferencia enviada",
  TRANSFER_CREDIT: "Transferencia recibida"
};

export const formatTransactionType = (type: TransactionType) => labels[type];
