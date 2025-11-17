import { api } from "./axios";
import {
  AuthApi,
  Configuration,
  QuoteApi,
  SolanaApi,
  StrategyApi,
  TransactionsApi,
  UsersApi,
  VaultApi,
  WhitelistApi,
} from "./generated";

const basePath = import.meta.env.VITE_PUBLIC_BACKEND_URL || "/api";
console.log('basePath', basePath);
const config = new Configuration({ baseOptions: { headers: {} } });

export const solanaApi = new SolanaApi(config, basePath, api);

export const vaultApi = new VaultApi(config, basePath, api);
export const strategyApi = new StrategyApi(config, basePath, api);
export const transactionApi = new TransactionsApi(config, basePath, api);
export const quoteApi = new QuoteApi(config, basePath, api);

//whitelist
export const authApi = new AuthApi(config, basePath, api);
export const usersApi = new UsersApi(config, basePath, api);
export const whitelistApi = new WhitelistApi(config, basePath, api);
