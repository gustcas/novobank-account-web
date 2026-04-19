import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { BrandLoader } from "../../components/ui/BrandLoader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAccounts } from "../../hooks/useAccounts";
import { AccountList } from "./AccountList";
import { CreateAccountModal } from "./CreateAccountModal";
import { useAuth } from "../auth/AuthContext";

export const AccountsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: accounts = [], isLoading } = useAccounts(user?.customerId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader title="Cuentas" subtitle="Administra productos bancarios y consulta saldos consolidados." />
          <Button
            className="h-12 min-w-[148px] self-start px-5 text-base sm:self-auto"
            disabled={!user?.customerId}
            variant="accent"
            onClick={() => setIsModalOpen(true)}
          >
            Nueva Cuenta
          </Button>
        </div>
        {isLoading ? (
          <BrandLoader className="min-h-[60vh]" message="Consultando cuentas del cliente..." />
        ) : accounts.length ? (
          <AccountList accounts={accounts} onSelect={(accountId) => navigate(`/accounts/${accountId}`)} />
        ) : (
          <Card>
            <p className="text-text-muted">
              {user?.customerId ? "No existen cuentas registradas para este cliente." : "No fue posible resolver el cliente autenticado."}
            </p>
          </Card>
        )}
      </div>
      <CreateAccountModal customerId={user?.customerId ?? ""} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </PageWrapper>
  );
};
