import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { BalanceVisibilityToggle } from "../../components/ui/BalanceVisibilityToggle";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Table, TBody, Td, THead, Th, Tr } from "../../components/ui/Table";
import type { Account } from "../../types/account.types";
import type { PaginatedTransactions } from "../../types/transaction.types";
import { formatAccountNumber } from "../../utils/formatAccountNumber";
import { formatAccountStatus } from "../../utils/formatAccountStatus";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatTransactionType } from "../../utils/formatTransactionType";

interface AccountDetailProps {
  account: Account;
  transactions?: PaginatedTransactions;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export const AccountDetail = ({ account, transactions, onDeposit, onWithdraw, onTransfer }: AccountDetailProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

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
              onToggle={() => setIsBalanceVisible((current) => !current)}
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-text-muted">Saldo disponible</p>
          <p className="mt-2 font-mono text-4xl font-bold text-accent">{isBalanceVisible ? formatCurrency(account.balance, account.currency) : "*****"}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="accent" onClick={onDeposit}>
            Depositar
          </Button>
          <Button variant="secondary" onClick={onTransfer}>
            Transferir
          </Button>
          <Button variant="primary" onClick={onWithdraw}>
            Retirar
          </Button>
        </div>
      </Card>

      <Card className="p-0">
        {!transactions?.content.length ? (
          <div className="p-6 text-text-muted">No hay transacciones registradas para esta cuenta.</div>
        ) : (
          <Table>
            <table className="w-full">
              <THead>
                <tr>
                  <Th>Fecha</Th>
                  <Th>Tipo</Th>
                  <Th>Referencia</Th>
                  <Th className="text-right">Monto</Th>
                </tr>
              </THead>
              <TBody>
                {transactions.content.map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>{formatDate(transaction.createdAt)}</Td>
                    <Td>{formatTransactionType(transaction.type)}</Td>
                    <Td>{transaction.reference}</Td>
                    <Td
                      className={`text-right font-mono font-semibold ${
                        transaction.type === "DEPOSIT" || transaction.type === "TRANSFER_CREDIT" ? "text-success" : "text-danger"
                      }`}
                    >
                      {formatCurrency(transaction.amount, account.currency)}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </table>
          </Table>
        )}
      </Card>
    </div>
  );
};
