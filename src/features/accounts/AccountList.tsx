import type { Account } from "../../types/account.types";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Table, TBody, Td, THead, Th, Tr } from "../../components/ui/Table";
import { formatAccountNumber } from "../../utils/formatAccountNumber";
import { formatAccountStatus } from "../../utils/formatAccountStatus";
import { formatCurrency } from "../../utils/formatCurrency";

interface AccountListProps {
  accounts: Account[];
  onSelect: (accountId: string) => void;
}

export const AccountList = ({ accounts, onSelect }: AccountListProps) => (
  <>
    <div className="space-y-3 md:hidden">
      {accounts.map((account) => (
        <button key={account.id} className="w-full text-left" type="button" onClick={() => onSelect(account.id)}>
          <Card accent className="space-y-4 rounded-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Cuenta</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{formatAccountNumber(account.accountNumber)}</p>
              </div>
              <Badge variant={account.status}>{formatAccountStatus(account.status)}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tipo</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{account.type === "SAVINGS" ? "Ahorros" : "Corriente"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Saldo</p>
                <p className="mt-1 text-right font-mono text-2xl font-bold text-accent">{formatCurrency(account.balance, account.currency)}</p>
              </div>
            </div>
          </Card>
        </button>
      ))}
    </div>

    <div className="hidden md:block">
      <Table>
        <table className="w-full">
          <THead>
            <tr>
              <Th>Cuenta</Th>
              <Th>Tipo</Th>
              <Th>Estado</Th>
              <Th className="text-right">Saldo</Th>
            </tr>
          </THead>
          <TBody>
            {accounts.map((account) => (
              <Tr key={account.id} className="cursor-pointer" onClick={() => onSelect(account.id)}>
                <Td>{formatAccountNumber(account.accountNumber)}</Td>
                <Td>{account.type === "SAVINGS" ? "Ahorros" : "Corriente"}</Td>
                <Td>
                  <Badge variant={account.status}>{formatAccountStatus(account.status)}</Badge>
                </Td>
                <Td className="text-right font-mono">{formatCurrency(account.balance, account.currency)}</Td>
              </Tr>
            ))}
          </TBody>
        </table>
      </Table>
    </div>
  </>
);
