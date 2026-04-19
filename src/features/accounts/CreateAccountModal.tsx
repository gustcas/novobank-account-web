import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useCreateAccount } from "../../hooks/useAccounts";

const schema = z.object({
  type: z.enum(["SAVINGS", "CHECKING"])
});

type FormValues = z.infer<typeof schema>;

export const CreateAccountModal = ({
  isOpen,
  onClose,
  customerId
}: {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}) => {
  const createAccount = useCreateAccount();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "SAVINGS"
    }
  });

  const onSubmit = async (values: FormValues) => {
    await createAccount.mutateAsync({
      customerId,
      ...values
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva cuenta"
      footer={
        <>
          <Button className="flex-1" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" form="create-account-form" type="submit" variant="accent" isLoading={isSubmitting}>
            Confirmar
          </Button>
        </>
      }
    >
      <form className="space-y-4" id="create-account-form" onSubmit={handleSubmit(onSubmit)}>
        {createAccount.isError ? <Alert variant="error">No fue posible crear la cuenta.</Alert> : null}
        <Input disabled label="Cliente" value={customerId} />
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-main">Tipo de cuenta</span>
          <select
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-text-main focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            {...register("type")}
          >
            <option value="SAVINGS">Ahorros</option>
            <option value="CHECKING">Corriente</option>
          </select>
        </label>
      </form>
    </Modal>
  );
};
