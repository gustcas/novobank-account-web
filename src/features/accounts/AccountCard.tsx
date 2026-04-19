import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import type { Account } from "../../types/account.types";
import { formatAccountNumber } from "../../utils/formatAccountNumber";
import { formatAccountStatus } from "../../utils/formatAccountStatus";
import { formatCurrency } from "../../utils/formatCurrency";

export const AccountCard = ({ account }: { account: Account }) => (
  <Link to={`/accounts/${account.id}`}>
    <Card accent className="h-full space-y-4 transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{account.type === "SAVINGS" ? "Cuenta de ahorros" : "Cuenta corriente"}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatAccountNumber(account.accountNumber)}</p>
        </div>
        <Badge variant={account.status}>{formatAccountStatus(account.status)}</Badge>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">Saldo disponible</p>
        <p className="mt-1 text-right font-mono text-2xl font-bold text-accent">{formatCurrency(account.balance, account.currency)}</p>
      </div>
    </Card>
  </Link>
);
