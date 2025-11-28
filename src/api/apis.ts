import { BACKEND_URL } from "@/config";
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

const backendUrl = BACKEND_URL;
const config = new Configuration({ baseOptions: { headers: {} } });

export const solanaApi = new SolanaApi(config, backendUrl, api);

export const vaultApi = new VaultApi(config, backendUrl, api);
export const strategyApi = new StrategyApi(config, backendUrl, api);
export const transactionApi = new TransactionsApi(config, backendUrl, api);
export const quoteApi = new QuoteApi(config, backendUrl, api);

//whitelist
export const authApi = new AuthApi(config, backendUrl, api);
export const usersApi = new UsersApi(config, backendUrl, api);
export const whitelistApi = new WhitelistApi(config, backendUrl, api);
