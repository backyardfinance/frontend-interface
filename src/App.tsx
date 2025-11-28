import { Route, Routes } from "react-router";
import DashboardPage from "@/dashboard/page";
import LandingPage from "@/landing/page";
import DashboardLayout from "@/layouts/dashboard";
import LandingLayout from "@/layouts/landing";
import { APP_ROUTES } from "@/routes";
import StrategyIdPage from "@/strategy/pages/strategy-id-page";
import VaultIdPage from "@/vaults/pages/vault";
import VaultsPage from "@/vaults/pages/vaults";
import WhitelistPage from "@/whitelist/page";

function App() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route element={<LandingPage />} path={APP_ROUTES.HOME} />
        <Route element={<WhitelistPage />} path={APP_ROUTES.WHITELIST} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route element={<VaultsPage />} path={APP_ROUTES.VAULTS} />
        <Route element={<VaultIdPage />} path={APP_ROUTES.VAULT_BY_ID} />

        <Route element={<DashboardPage />} path={APP_ROUTES.DASHBOARD} />
        <Route element={<StrategyIdPage />} path={APP_ROUTES.STRATEGY_BY_ID} />
      </Route>
      <Route element={<LandingPage />} path={APP_ROUTES.REDIRECT} />
    </Routes>
  );
}

export default App;
