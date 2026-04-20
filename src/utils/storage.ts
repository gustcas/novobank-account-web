const REFRESH_TOKEN_KEY = "novobank_refresh_token";
const SELECTED_ACCOUNT_KEY_PREFIX = "novobank_selected_account_";
const BALANCE_VISIBILITY_KEY_PREFIX = "novobank_balance_visibility_";

export const refreshTokenStorage = {
  get: () => sessionStorage.getItem(REFRESH_TOKEN_KEY),
  set: (token: string) => sessionStorage.setItem(REFRESH_TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(REFRESH_TOKEN_KEY)
};

const getSelectedAccountKey = (customerId: string) => `${SELECTED_ACCOUNT_KEY_PREFIX}${customerId}`;

export const selectedAccountStorage = {
  get: (customerId: string) => sessionStorage.getItem(getSelectedAccountKey(customerId)),
  set: (customerId: string, accountId: string) => sessionStorage.setItem(getSelectedAccountKey(customerId), accountId),
  clear: (customerId: string) => sessionStorage.removeItem(getSelectedAccountKey(customerId)),
  clearAll: () => {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(SELECTED_ACCOUNT_KEY_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  }
};

const getBalanceVisibilityKey = (scope: string) => `${BALANCE_VISIBILITY_KEY_PREFIX}${scope}`;

export const balanceVisibilityStorage = {
  get: (scope: string) => sessionStorage.getItem(getBalanceVisibilityKey(scope)),
  set: (scope: string, isVisible: boolean) => sessionStorage.setItem(getBalanceVisibilityKey(scope), String(isVisible)),
  clear: (scope: string) => sessionStorage.removeItem(getBalanceVisibilityKey(scope)),
  clearAll: () => {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(BALANCE_VISIBILITY_KEY_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  }
};
