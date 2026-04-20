import { PageHeader } from "../../components/layout/PageHeader";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { BrandLoader } from "../../components/ui/BrandLoader";
import { Card } from "../../components/ui/Card";
import { useAccounts } from "../../hooks/useAccounts";
import { useSelectedAccount } from "../../hooks/useSelectedAccount";
import { useTransactions } from "../../hooks/useTransactions";
import { AccountSelector } from "../accounts/AccountSelector";
import { useAuth } from "../auth/AuthContext";
import { TransactionHistoryTable } from "./TransactionHistoryTable";

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
              <TransactionHistoryTable currency={selectedAccount?.currency} showStatus transactions={transactions.content} />
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
