import { useEffect, useState } from "react";
import type { Account } from "../types/account.types";
import { selectedAccountStorage } from "../utils/storage";

export const useSelectedAccount = (accounts: Account[], customerId?: string, preferredAccountId?: string) => {
  const [selectedAccountId, setSelectedAccountIdState] = useState(() => {
    if (preferredAccountId) {
      return preferredAccountId;
    }

    if (!customerId) {
      return "";
    }

    return selectedAccountStorage.get(customerId) ?? "";
  });

  const setSelectedAccountId = (accountId: string) => {
    setSelectedAccountIdState(accountId);

    if (customerId && accountId) {
      selectedAccountStorage.set(customerId, accountId);
    }
  };

  useEffect(() => {
    if (!accounts.length) {
      if (selectedAccountId) {
        setSelectedAccountIdState("");
      }

      if (customerId) {
        selectedAccountStorage.clear(customerId);
      }
      return;
    }

    if (preferredAccountId && accounts.some((account) => account.id === preferredAccountId)) {
      if (selectedAccountId !== preferredAccountId) {
        setSelectedAccountId(preferredAccountId);
      }
      return;
    }

    if (!accounts.some((account) => account.id === selectedAccountId)) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, customerId, preferredAccountId, selectedAccountId]);

  return {
    selectedAccountId,
    setSelectedAccountId,
    selectedAccount: accounts.find((account) => account.id === selectedAccountId) ?? null
  };
};
