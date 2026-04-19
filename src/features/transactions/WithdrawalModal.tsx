import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useWithdrawal } from "../../hooks/useTransactions";
import type { Account } from "../../types/account.types";
import { formatCurrency } from "../../utils/formatCurrency";

const schema = z.object({
  amount: z.coerce.number().gt(0, "Ingresa un monto mayor a cero.")
});

export const WithdrawalModal = ({ isOpen, onClose, account }: { isOpen: boolean; onClose: () => void; account: Account }) => {
  const [message, setMessage] = useState<string | null>(null);
  const mutation = useWithdrawal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<{ amount: number }>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 }
  });

  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
      reset({ amount: 0 });
    }
  }, [isOpen, reset]);

  const onSubmit = async ({ amount }: { amount: number }) => {
    if (amount > account.balance) {
      setMessage("El monto excede el saldo disponible.");
      return;
    }

    try {
      setMessage(null);
      await mutation.mutateAsync({ accountId: account.id, amount });
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.detail ?? "No fue posible completar el retiro.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Retiro"
      footer={
        <>
          <Button className="flex-1" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" form="withdrawal-form" type="submit" variant="primary" isLoading={isSubmitting || mutation.isPending}>
            Confirmar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-neutral p-4">
          <p className="text-sm text-text-muted">Saldo disponible</p>
          <p className="mt-2 font-mono text-2xl font-bold text-accent">{formatCurrency(account.balance, account.currency)}</p>
        </div>
        {message ? <Alert variant="error">{message}</Alert> : null}
        <form id="withdrawal-form" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Monto" error={errors.amount?.message} type="number" step="0.01" {...register("amount")} />
        </form>
      </div>
    </Modal>
  );
};
