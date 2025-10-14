export const VAULT_ID = ":vaultId";

export const APP_ROUTES = {
  HOME: "/",
  VAULTS: "/vaults",
  VAULT_BY_ID: `/vaults/${VAULT_ID}`,
  PRESETS: "/presets",
  DASHBOARD: "/dashboard",
} as const;

export const toVaultRoute = (vaultId: string) => APP_ROUTES.VAULT_BY_ID.replace(VAULT_ID, vaultId);

export const NavItems = [
  {
    title: "Vaults",
    path: APP_ROUTES.VAULTS,
  },
  {
    title: "Presets",
    path: APP_ROUTES.PRESETS,
  },
  {
    title: "Dashboard",
    path: APP_ROUTES.DASHBOARD,
  },
];
