import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useTransfer } from "../../hooks/useTransactions";
import type { Account } from "../../types/account.types";
import { formatCurrency } from "../../utils/formatCurrency";

const schema = z
  .object({
    sourceAccountId: z.string().min(1, "Selecciona cuenta origen."),
    destinationAccountId: z.string().min(1, "Selecciona cuenta destino."),
    amount: z.coerce.number().gt(0, "Ingresa un monto mayor a cero.")
  })
  .refine((value) => value.sourceAccountId !== value.destinationAccountId, {
    message: "La cuenta origen y destino deben ser distintas.",
    path: ["destinationAccountId"]
  });

type FormValues = z.infer<typeof schema>;

export const TransferModal = ({
  isOpen,
  onClose,
  accounts,
  initialSourceAccountId
}: {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  initialSourceAccountId?: string;
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [message, setMessage] = useState<string | null>(null);
  const mutation = useTransfer();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sourceAccountId: initialSourceAccountId ?? accounts[0]?.id ?? "",
      destinationAccountId: accounts[1]?.id ?? "",
      amount: 0
    }
  });

  const values = watch();

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setMessage(null);
      reset({
        sourceAccountId: initialSourceAccountId ?? accounts[0]?.id ?? "",
        destinationAccountId: accounts[1]?.id ?? "",
        amount: 0
      });
    }
  }, [accounts, initialSourceAccountId, isOpen, reset]);

  const onConfirm = async () => {
    try {
      setMessage(null);
      await mutation.mutateAsync(values);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.detail ?? "No fue posible completar la transferencia.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transferencia"
      footer={
        <>
          <Button className="flex-1" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          {step === 1 ? (
            <Button className="flex-1" form="transfer-form" type="submit" variant="accent">
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
        <form className="space-y-4" id="transfer-form" onSubmit={handleSubmit(() => setStep(2))}>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-main">Cuenta origen</span>
            <select
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-text-main focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              {...register("sourceAccountId")}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-main">Cuenta destino</span>
            <select
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-text-main focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              {...register("destinationAccountId")}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber}
                </option>
              ))}
            </select>
            {errors.destinationAccountId?.message ? <span className="text-sm text-danger">{errors.destinationAccountId.message}</span> : null}
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-main">Monto</span>
            <input
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-text-main focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              type="number"
              step="0.01"
              {...register("amount")}
            />
            {errors.amount?.message ? <span className="text-sm text-danger">{errors.amount.message}</span> : null}
          </label>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">Verifica los datos antes de ejecutar la transferencia.</p>
          <div className="rounded-lg bg-neutral p-4">
            <p className="text-sm text-text-muted">Monto a transferir</p>
            <p className="mt-2 font-mono text-2xl font-bold text-accent">{formatCurrency(values.amount || 0)}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};
