export const VAULT_ID = ":vaultId";
export const STRATEGY_ID = ":strategyId";

export const APP_ROUTES = {
  HOME: "/",
  VAULTS: "/vaults",
  VAULT_BY_ID: `/vaults/${VAULT_ID}`,
  DASHBOARD: "/dashboard",
  DASHBOARD_STRATEGY_BY_ID: `/dashboard/strategy/${STRATEGY_ID}`,
  REDIRECT: "*",
} as const;

export const toVaultRoute = (vaultId: string) => APP_ROUTES.VAULT_BY_ID.replace(VAULT_ID, vaultId);
export const toStrategyRoute = (strategyId: string) =>
  APP_ROUTES.DASHBOARD_STRATEGY_BY_ID.replace(STRATEGY_ID, strategyId);

export const NavItems = [
  {
    title: "Vaults",
    path: APP_ROUTES.VAULTS,
  },
  {
    title: "Dashboard",
    path: APP_ROUTES.DASHBOARD,
  },
];
