export const APP_ROUTES = {
  HOME: "/",
  VAULTS: "/vaults",
  PRESETS: "/presets",
  DASHBOARD: "/dashboard",
} as const;

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
