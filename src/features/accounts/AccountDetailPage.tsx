import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { BrandLoader } from "../../components/ui/BrandLoader";
import { useAccount, useAccountTransactions } from "../../hooks/useAccounts";
import { AccountDetail } from "./AccountDetail";
import { DepositModal } from "../transactions/DepositModal";
import { WithdrawalModal } from "../transactions/WithdrawalModal";
import { TransferModal } from "../transactions/TransferModal";
import { useAccounts } from "../../hooks/useAccounts";
import { useAuth } from "../auth/AuthContext";
import { useSelectedAccount } from "../../hooks/useSelectedAccount";

export const AccountDetailPage = () => {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const { data: account, isLoading: isAccountLoading } = useAccount(id);
  const { data: transactions, isLoading: isTransactionsLoading } = useAccountTransactions(id, 0);
  const { data: accounts = [] } = useAccounts(user?.customerId);
  useSelectedAccount(accounts, user?.customerId, id);
  const [activeModal, setActiveModal] = useState<"deposit" | "withdraw" | "transfer" | null>(null);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader title="Detalle de cuenta" subtitle="Consulta movimientos, saldo disponible y ejecuta operaciones." />
        {isAccountLoading || isTransactionsLoading || !account ? (
          <BrandLoader className="min-h-[60vh]" message="Cargando detalle e historial de la cuenta..." />
        ) : (
          <AccountDetail
            account={account}
            transactions={transactions}
            onDeposit={() => setActiveModal("deposit")}
            onWithdraw={() => setActiveModal("withdraw")}
            onTransfer={() => setActiveModal("transfer")}
          />
        )}
      </div>
      {account ? (
        <>
          <DepositModal account={account} isOpen={activeModal === "deposit"} onClose={() => setActiveModal(null)} />
          <WithdrawalModal account={account} isOpen={activeModal === "withdraw"} onClose={() => setActiveModal(null)} />
          <TransferModal
            accounts={accounts}
            initialSourceAccountId={account.id}
            isOpen={activeModal === "transfer"}
            onClose={() => setActiveModal(null)}
          />
        </>
      ) : null}
    </PageWrapper>
  );
};
