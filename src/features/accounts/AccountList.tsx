import type { Account } from "../../types/account.types";
import { Badge } from "../../components/ui/Badge";
import { Table, TBody, Td, THead, Th, Tr } from "../../components/ui/Table";
import { formatAccountNumber } from "../../utils/formatAccountNumber";
import { formatAccountStatus } from "../../utils/formatAccountStatus";
import { formatCurrency } from "../../utils/formatCurrency";

interface AccountListProps {
  accounts: Account[];
  onSelect: (accountId: string) => void;
}

export const AccountList = ({ accounts, onSelect }: AccountListProps) => (
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
);
