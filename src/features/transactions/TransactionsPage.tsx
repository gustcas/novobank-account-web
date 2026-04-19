import { PageHeader } from "../../components/layout/PageHeader";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { BrandLoader } from "../../components/ui/BrandLoader";
import { Card } from "../../components/ui/Card";
import { Table, TBody, Td, THead, Th, Tr } from "../../components/ui/Table";
import { useAccounts } from "../../hooks/useAccounts";
import { useSelectedAccount } from "../../hooks/useSelectedAccount";
import { useTransactions } from "../../hooks/useTransactions";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatTransactionType } from "../../utils/formatTransactionType";
import { AccountSelector } from "../accounts/AccountSelector";
import { useAuth } from "../auth/AuthContext";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

export const TransactionsPage = () => {
  const { user } = useAuth();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(user?.customerId);
  const { selectedAccountId, selectedAccount, setSelectedAccountId } = useSelectedAccount(accounts, user?.customerId);
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(selectedAccountId);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader title="Transacciones" subtitle="Consulta el historial paginado de la cuenta seleccionada." />
        {accountsLoading || (selectedAccountId && transactionsLoading) ? (
          <BrandLoader className="min-h-[60vh]" message="Cargando historial de la cuenta seleccionada..." />
        ) : !accounts.length ? (
          <Card>
            <p className="text-text-muted">No existen cuentas disponibles para consultar movimientos.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Cuenta a consultar</h2>
                <p className="text-sm text-slate-500">
                  {selectedAccount ? `Historial disponible para ${selectedAccount.accountNumber}.` : "Selecciona una cuenta del cliente."}
                </p>
              </div>
              <div className="w-full lg:w-[360px]">
                <AccountSelector accounts={accounts} label="Cuenta" onChange={setSelectedAccountId} value={selectedAccountId} />
              </div>
            </div>
            {!transactions?.content.length ? (
              <Card>
                <p className="text-text-muted">No hay transacciones disponibles para la cuenta seleccionada.</p>
              </Card>
            ) : (
              <Table>
                <table className="w-full">
                  <THead>
                    <tr>
                      <Th>Fecha</Th>
                      <Th>Tipo</Th>
                      <Th>Referencia</Th>
                      <Th>Estado</Th>
                      <Th className="text-right">Monto</Th>
                    </tr>
                  </THead>
                  <TBody>
                    {transactions.content.map((transaction) => (
                      <Tr key={`${transaction.accountId}-${transaction.id}-${transaction.reference}`}>
                        <Td>{formatDate(transaction.createdAt)}</Td>
                        <Td>{formatTransactionType(transaction.type)}</Td>
                        <Td>{transaction.reference}</Td>
                        <Td>
                          <TransactionStatusBadge status={transaction.status} />
                        </Td>
                        <Td className="text-right font-mono">{formatCurrency(transaction.amount)}</Td>
                      </Tr>
                    ))}
                  </TBody>
                </table>
              </Table>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
