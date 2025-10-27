import { Route, Routes } from "react-router";
import { APP_ROUTES } from "@/config/routes";
import DefaultLayout from "@/layouts/default";
import DashboardPage from "@/pages/dashboard-page";
import IndexPage from "@/pages/index";
import StrategyIdPage from "@/pages/strategy-id-page";
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
        <Route element={<StrategyIdPage />} path={APP_ROUTES.STRATEGY_BY_ID} />

        <Route element={<IndexPage />} path={APP_ROUTES.REDIRECT} />
      </Route>
    </Routes>
  );
}

export default App;
