import axios from "axios";
import { JUPITER_API_KEY, JUPITER_API_URL } from "@/config";
import { Configuration, DefaultApi } from "./generated/swap";

// -----------------------------------------------------------------------------------------------
// --------------------------------- Jupiter Ultra Swap API --------------------------------------
// -----------------------------------------------------------------------------------------------
const jupiterSwapApiUrl = `${JUPITER_API_URL}/ultra/v1`;
const swapApi = axios.create({ baseURL: jupiterSwapApiUrl });
const config = new Configuration({
  baseOptions: { headers: { "x-api-key": JUPITER_API_KEY } },
});
export const jupiterSwapApi = new DefaultApi(config, jupiterSwapApiUrl, swapApi);
export * as JupiterSwap from "./generated/swap";
