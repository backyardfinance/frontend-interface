import axios from "axios";
import { JUPITER_API_URL } from "@/config";
import { Configuration, DefaultApi } from "./generated-swap";
import { Configuration as TokensConfiguration, DefaultApi as TokensDefaultApi } from "./generated-tokens";

/// ----------------------------------------------------------------------------------------------
// --------------------------------- Jupiter Ultra Swap API --------------------------------------
// -----------------------------------------------------------------------------------------------
const jupiterSwapApiUrl = `${JUPITER_API_URL}/ultra/v1`;
const swapApi = axios.create({ baseURL: jupiterSwapApiUrl });
const config = new Configuration({ baseOptions: { headers: {} } });
export const jupiterSwapApi = new DefaultApi(config, jupiterSwapApiUrl, swapApi);
export * as JupiterSwap from "./generated-swap";

/// ----------------------------------------------------------------------------------------------
// --------------------------------- Jupiter Tokens API ------------------------------------------
// -----------------------------------------------------------------------------------------------
const tokensApiUrl = `${JUPITER_API_URL}/tokens/v2`;
const tokensApi = axios.create({ baseURL: tokensApiUrl });
const tokensConfig = new TokensConfiguration({ baseOptions: { headers: {} } });
export const jupiterTokensApi = new TokensDefaultApi(tokensConfig, tokensApiUrl, tokensApi);
export * as JupiterTokens from "./generated-tokens";
