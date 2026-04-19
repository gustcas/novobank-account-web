import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useDeposit } from "../../hooks/useTransactions";
import type { Account } from "../../types/account.types";
import { formatCurrency } from "../../utils/formatCurrency";

const schema = z.object({
  amount: z.coerce.number().gt(0, "Ingresa un monto mayor a cero.")
});

export const DepositModal = ({
  isOpen,
  onClose,
  account
}: {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [message, setMessage] = useState<string | null>(null);
  const mutation = useDeposit();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<{ amount: number }>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 }
  });

  const amount = watch("amount");

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setMessage(null);
      reset({ amount: 0 });
    }
  }, [isOpen, reset]);

  const onConfirm = async () => {
    try {
      setMessage(null);
      await mutation.mutateAsync({ accountId: account.id, amount });
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.detail ?? "No fue posible completar el deposito.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deposito"
      footer={
        <>
          <Button className="flex-1" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          {step === 1 ? (
            <Button className="flex-1" form="deposit-form" type="submit" variant="accent">
              Continuar
            </Button>
          ) : (
            <Button className="flex-1" variant="accent" isLoading={isSubmitting || mutation.isPending} onClick={() => void onConfirm()}>
              Confirmar
            </Button>
          )}
        </>
      }
    >
      <div className="mb-6 flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 1 ? "bg-accent text-white" : "bg-gray-200 text-gray-500"}`}>1</div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 2 ? "bg-accent text-white" : "bg-gray-200 text-gray-500"}`}>2</div>
      </div>
      {message ? <Alert variant="error">{message}</Alert> : null}
      {step === 1 ? (
        <form id="deposit-form" onSubmit={handleSubmit(() => setStep(2))}>
          <Input label="Monto" error={errors.amount?.message} type="number" step="0.01" {...register("amount")} />
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">Confirma el deposito en la cuenta seleccionada.</p>
          <div className="rounded-lg bg-neutral p-4">
            <p className="text-sm text-text-muted">Monto a acreditar</p>
            <p className="mt-2 font-mono text-2xl font-bold text-accent">{formatCurrency(amount, account.currency)}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};
