import { Card } from "../../components/ui/Card";
import { Table, TBody, Td, THead, Th, Tr } from "../../components/ui/Table";
import type { Transaction } from "../../types/transaction.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatTransactionType } from "../../utils/formatTransactionType";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

const getAmountTone = (type: Transaction["type"]) =>
  type === "DEPOSIT" || type === "TRANSFER_CREDIT" ? "text-success" : "text-danger";

export const TransactionHistoryTable = ({
  transactions,
  currency = "USD",
  showStatus = false
}: {
  transactions: Transaction[];
  currency?: string;
  showStatus?: boolean;
}) => (
  <>
    <div className="space-y-3 md:hidden">
      {transactions.map((transaction, index) => (
        <Card key={`${transaction.accountId}-${transaction.id}-${transaction.reference}`} className="rounded-2xl px-0 py-0 shadow-none">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{`Transaccion #${index + 1}`}</p>
          </div>
          <dl className="divide-y divide-slate-100">
            <div className="grid grid-cols-[92px_1fr] gap-3 px-4 py-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Fecha</dt>
              <dd className="text-sm font-medium text-slate-800">{formatDate(transaction.createdAt)}</dd>
            </div>
            <div className="grid grid-cols-[92px_1fr] gap-3 px-4 py-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Tipo</dt>
              <dd className="text-sm font-medium text-slate-800">{formatTransactionType(transaction.type)}</dd>
            </div>
            <div className="grid grid-cols-[92px_1fr] gap-3 px-4 py-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Referencia</dt>
              <dd className="break-all font-mono text-xs text-slate-500">{transaction.reference}</dd>
            </div>
            {showStatus ? (
              <div className="grid grid-cols-[92px_1fr] gap-3 px-4 py-3">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Estado</dt>
                <dd>
                  <TransactionStatusBadge status={transaction.status} />
                </dd>
              </div>
            ) : null}
            <div className="grid grid-cols-[92px_1fr] gap-3 px-4 py-3">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Monto</dt>
              <dd className={`text-right font-mono text-xl font-bold ${getAmountTone(transaction.type)}`}>{formatCurrency(transaction.amount, currency)}</dd>
            </div>
          </dl>
        </Card>
      ))}
    </div>

    <div className="hidden md:block">
      <Table>
        <table className="w-full">
          <THead>
            <tr>
              <Th>Fecha</Th>
              <Th>Tipo</Th>
              <Th>Referencia</Th>
              {showStatus ? <Th>Estado</Th> : null}
              <Th className="text-right">Monto</Th>
            </tr>
          </THead>
          <TBody>
            {transactions.map((transaction) => (
              <Tr key={`${transaction.accountId}-${transaction.id}-${transaction.reference}`}>
                <Td>{formatDate(transaction.createdAt)}</Td>
                <Td>{formatTransactionType(transaction.type)}</Td>
                <Td>{transaction.reference}</Td>
                {showStatus ? (
                  <Td>
                    <TransactionStatusBadge status={transaction.status} />
                  </Td>
                ) : null}
                <Td className={`text-right font-mono font-semibold ${getAmountTone(transaction.type)}`}>{formatCurrency(transaction.amount, currency)}</Td>
              </Tr>
            ))}
          </TBody>
        </table>
      </Table>
    </div>
  </>
);
