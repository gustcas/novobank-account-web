import type { TransactionStatus } from "../../types/transaction.types";
import { Badge } from "../../components/ui/Badge";

export const TransactionStatusBadge = ({ status }: { status: TransactionStatus }) => {
  if (status === "SUCCESS") {
    return <Badge variant="success">Completada</Badge>;
  }

  if (status === "FAILED") {
    return <Badge variant="danger">Fallida</Badge>;
  }

  return <Badge variant="info">Revertida</Badge>;
};
