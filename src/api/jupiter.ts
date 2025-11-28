import axios from "axios";
import { Configuration, DefaultApi } from "./jupiter-generated";

const basePath = import.meta.env.VITE_PUBLIC_JUPITER_API_URL ?? "https://lite-api.jup.ag";

const baseURL = `${basePath}/ultra/v1`;

const api = axios.create({ baseURL });

const config = new Configuration({ baseOptions: { headers: {} } });

export const jupiterApi = new DefaultApi(config, baseURL, api);

// Export all types and APIs with Jupiter prefix
export * as Jupiter from "./jupiter-generated";
