import type { Account } from "../../types/account.types";

export const AccountSelector = ({
  accounts,
  value,
  onChange,
  label = "Cuenta"
}: {
  accounts: Account[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-sm font-semibold text-slate-800">{label}</span>
    <select
      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {accounts.map((account) => (
        <option key={account.id} value={account.id}>
          {`${account.accountNumber} · ${account.type === "SAVINGS" ? "Ahorros" : "Corriente"}`}
        </option>
      ))}
    </select>
  </label>
);
