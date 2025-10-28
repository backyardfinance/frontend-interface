import axios from "axios";

const baseURL = import.meta.env.VITE_PUBLIC_BACKEND_URL || "/api";

const api = axios.create({ baseURL });

export { api };
