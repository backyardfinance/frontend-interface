import { Route, Routes } from "react-router";
import { APP_ROUTES } from "@/config/routes";
import DashboardLayout from "@/layouts/dashboard";
import LandingLayout from "@/layouts/landing";
import DashboardPage from "@/pages/dashboard-page";
import IndexPage from "@/pages/landing/index";
import StrategyIdPage from "@/pages/strategy-id-page";
import VaultIdPage from "@/pages/vault-id-page";
import VaultsPage from "@/pages/vaults-page";
import WhitelistPage from "@/pages/whitelist";

function App() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route element={<IndexPage />} path={APP_ROUTES.HOME} />
        <Route element={<WhitelistPage />} path={APP_ROUTES.WHITELIST} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route element={<VaultsPage />} path={APP_ROUTES.VAULTS} />
        <Route element={<VaultIdPage />} path={APP_ROUTES.VAULT_BY_ID} />

        <Route element={<DashboardPage />} path={APP_ROUTES.DASHBOARD} />
        <Route element={<StrategyIdPage />} path={APP_ROUTES.STRATEGY_BY_ID} />
      </Route>
      <Route element={<IndexPage />} path={APP_ROUTES.REDIRECT} />
    </Routes>
  );
}

export default App;
