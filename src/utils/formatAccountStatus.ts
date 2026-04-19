import type { AccountStatus } from "../types/account.types";

const labels: Record<AccountStatus, string> = {
  ACTIVE: "Activa",
  BLOCKED: "Bloqueada",
  CLOSED: "Cerrada"
};

export const formatAccountStatus = (status: AccountStatus) => labels[status];
