import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { BalanceVisibilityToggle } from "../../components/ui/BalanceVisibilityToggle";
import { BrandLoader } from "../../components/ui/BrandLoader";
import { Card } from "../../components/ui/Card";
import { SkeletonBlock } from "../../components/ui/Skeleton";
import { Table, TBody, Td, THead, Th, Tr } from "../../components/ui/Table";
import { useAccounts } from "../../hooks/useAccounts";
import { useTransactions } from "../../hooks/useTransactions";
import { AccountCard } from "../accounts/AccountCard";
import { AccountSelector } from "../accounts/AccountSelector";
import { useAuth } from "../auth/AuthContext";
import { useSelectedAccount } from "../../hooks/useSelectedAccount";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatTransactionType } from "../../utils/formatTransactionType";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [isTotalBalanceVisible, setIsTotalBalanceVisible] = useState(true);
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(user?.customerId);
  const { selectedAccountId, selectedAccount, setSelectedAccountId } = useSelectedAccount(accounts, user?.customerId);
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(selectedAccountId);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  if (accountsLoading || (selectedAccountId && transactionsLoading)) {
    return (
      <PageWrapper>
        <BrandLoader className="min-h-[70vh]" message="Obteniendo resumen y ultimos movimientos..." />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-8">
        <PageHeader title={`Bienvenido, ${user?.fullName ?? "cliente"}`} subtitle="Resumen operativo de tus productos y actividad reciente." />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card accent>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Saldo Total</p>
                <p className="mt-2 font-mono text-3xl font-bold text-accent">{isTotalBalanceVisible ? formatCurrency(totalBalance) : "*****"}</p>
              </div>
              <BalanceVisibilityToggle
                isVisible={isTotalBalanceVisible}
                label={isTotalBalanceVisible ? "Ocultar saldo total" : "Mostrar saldo total"}
                onToggle={() => setIsTotalBalanceVisible((current) => !current)}
              />
            </div>
          </Card>
          <Card accent>
            <p className="text-sm font-medium text-slate-500">Cuentas Activas</p>
            <p className="mt-2 font-mono text-3xl font-bold text-accent">{accounts.filter((account) => account.status === "ACTIVE").length}</p>
          </Card>
          <Card accent>
            <p className="text-sm font-medium text-slate-500">Transacciones</p>
            <p className="mt-2 font-mono text-3xl font-bold text-accent">{transactions?.totalElements ?? transactions?.content.length ?? 0}</p>
          </Card>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Tus cuentas</h2>
          {accountsLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ultimas transacciones</h2>
              <p className="text-sm text-slate-500">
                {selectedAccount ? `Movimientos recientes de ${selectedAccount.accountNumber}.` : "Selecciona una cuenta para ver sus movimientos."}
              </p>
            </div>
            {accounts.length > 1 ? (
              <div className="w-full lg:w-[360px]">
                <AccountSelector accounts={accounts} label="Cuenta para historial" onChange={setSelectedAccountId} value={selectedAccountId} />
              </div>
            ) : null}
          </div>
          {transactionsLoading ? (
            <SkeletonBlock className="h-64 rounded-xl" />
          ) : !selectedAccount ? (
            <Card>
              <p className="text-text-muted">No hay una cuenta seleccionada para consultar movimientos.</p>
            </Card>
          ) : !transactions?.content.length ? (
            <Card>
              <p className="text-text-muted">La cuenta seleccionada todavia no registra movimientos.</p>
            </Card>
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
                  {transactions?.content.slice(0, 5).map((transaction) => (
                    <Tr key={`${transaction.accountId}-${transaction.id}-${transaction.reference}`}>
                      <Td>{formatDate(transaction.createdAt)}</Td>
                      <Td>{formatTransactionType(transaction.type)}</Td>
                      <Td>{transaction.reference}</Td>
                      <Td className="text-right font-mono font-semibold text-slate-900">{formatCurrency(transaction.amount)}</Td>
                    </Tr>
                  ))}
                </TBody>
              </table>
            </Table>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};
