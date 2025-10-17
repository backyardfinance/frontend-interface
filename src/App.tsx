import { Route, Routes } from "react-router";
import { APP_ROUTES } from "@/config/routes";
import DefaultLayout from "@/layouts/default";
import DashboardPage from "@/pages/dashboard-page";
import DashboardStrategyIdPage from "@/pages/dashboard-strategy-id-page";
import IndexPage from "@/pages/index";
import VaultIdPage from "@/pages/vault-id-page";
import VaultsPage from "@/pages/vaults-page";

function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route element={<IndexPage />} path={APP_ROUTES.HOME} />

        <Route element={<VaultsPage />} path={APP_ROUTES.VAULTS} />
        <Route element={<VaultIdPage />} path={APP_ROUTES.VAULT_BY_ID} />

        <Route element={<DashboardPage />} path={APP_ROUTES.DASHBOARD} />
        <Route element={<DashboardStrategyIdPage />} path={APP_ROUTES.DASHBOARD_STRATEGY_BY_ID} />

        <Route element={<IndexPage />} path={APP_ROUTES.REDIRECT} />
      </Route>
    </Routes>
  );
}

export default App;
