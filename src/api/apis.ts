import { api } from "./axios";
import { Configuration, SolanaApi } from "./generated";

const basePath = import.meta.env.VITE_PUBLIC_BACKEND_URL;
const config = new Configuration({ baseOptions: { headers: {} } });

export const solanaApi = new SolanaApi(config, basePath, api);
