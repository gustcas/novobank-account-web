import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { BalanceVisibilityToggle } from "../../components/ui/BalanceVisibilityToggle";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { Account } from "../../types/account.types";
import type { PaginatedTransactions } from "../../types/transaction.types";
import { balanceVisibilityStorage } from "../../utils/storage";
import { formatAccountNumber } from "../../utils/formatAccountNumber";
import { formatAccountStatus } from "../../utils/formatAccountStatus";
import { formatCurrency } from "../../utils/formatCurrency";
import { TransactionHistoryTable } from "../transactions/TransactionHistoryTable";

interface AccountDetailProps {
  account: Account;
  transactions?: PaginatedTransactions;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export const AccountDetail = ({ account, transactions, onDeposit, onWithdraw, onTransfer }: AccountDetailProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(
    () => balanceVisibilityStorage.get(`account-detail-${account.id}`) !== "false"
  );

  useEffect(() => {
    setIsBalanceVisible(balanceVisibilityStorage.get(`account-detail-${account.id}`) !== "false");
  }, [account.id]);

  return (
    <div className="space-y-6">
      <Card accent className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-text-muted">Cuenta seleccionada</p>
            <h2 className="mt-1 text-xl font-semibold text-text-main">{formatAccountNumber(account.accountNumber, false)}</h2>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Badge variant={account.status}>{formatAccountStatus(account.status)}</Badge>
            <BalanceVisibilityToggle
              isVisible={isBalanceVisible}
              label={isBalanceVisible ? "Ocultar saldo de la cuenta" : "Mostrar saldo de la cuenta"}
              onToggle={() =>
                setIsBalanceVisible((current) => {
                  const next = !current;
                  balanceVisibilityStorage.set(`account-detail-${account.id}`, next);
                  return next;
                })
              }
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-text-muted">Saldo disponible</p>
          <p className="mt-2 font-mono text-4xl font-bold text-accent">{isBalanceVisible ? formatCurrency(account.balance, account.currency) : "*****"}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <Button className="h-9 w-full px-2 text-xs sm:h-10 sm:w-auto sm:px-4 sm:text-base" variant="accent" onClick={onDeposit}>
            Depositar
          </Button>
          <Button className="h-9 w-full px-2 text-xs sm:h-10 sm:w-auto sm:px-4 sm:text-base" variant="secondary" onClick={onTransfer}>
            Transferir
          </Button>
          <Button className="h-9 w-full px-2 text-xs sm:h-10 sm:w-auto sm:px-4 sm:text-base" variant="primary" onClick={onWithdraw}>
            Retirar
          </Button>
        </div>
      </Card>

      <Card className="p-0">
        {!transactions?.content.length ? (
          <div className="p-6 text-text-muted">No hay transacciones registradas para esta cuenta.</div>
        ) : (
          <TransactionHistoryTable currency={account.currency} transactions={transactions.content} />
        )}
      </Card>
    </div>
  );
};
