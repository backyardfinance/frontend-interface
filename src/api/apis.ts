import { api } from "./axios";
import { AdminApi, Configuration, QuoteApi, SolanaApi, StrategyApi, TransactionsApi, VaultApi } from "./generated";

const basePath = import.meta.env.VITE_PUBLIC_BACKEND_URL || "/api";
const config = new Configuration({ baseOptions: { headers: {} } });

export const solanaApi = new SolanaApi(config, basePath, api);

export const vaultApi = new VaultApi(config, basePath, api);
export const strategyApi = new StrategyApi(config, basePath, api);
export const transactionApi = new TransactionsApi(config, basePath, api);
export const quoteApi = new QuoteApi(config, basePath, api);
export const adminApi = new AdminApi(config, basePath, api);
