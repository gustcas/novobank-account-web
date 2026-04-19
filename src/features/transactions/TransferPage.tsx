import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAccounts } from "../../hooks/useAccounts";
import { useSelectedAccount } from "../../hooks/useSelectedAccount";
import { useAuth } from "../auth/AuthContext";
import { TransferModal } from "./TransferModal";

export const TransferPage = () => {
  const { user } = useAuth();
  const { data: accounts = [] } = useAccounts(user?.customerId);
  const { selectedAccountId } = useSelectedAccount(accounts, user?.customerId);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <PageHeader title="Transferencias" subtitle="Mueve fondos entre cuentas con confirmacion en dos pasos." />
        <Card className="space-y-4">
          <p className="text-text-muted">
            {accounts.length > 1
              ? "Inicia una transferencia interna entre cuentas del cliente autenticado."
              : "Necesitas al menos dos cuentas del cliente para ejecutar una transferencia."}
          </p>
          <Button className="w-full sm:w-auto" disabled={accounts.length < 2} variant="accent" onClick={() => setIsOpen(true)}>
            Nueva transferencia
          </Button>
        </Card>
      </div>
      <TransferModal accounts={accounts} initialSourceAccountId={selectedAccountId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </PageWrapper>
  );
};
