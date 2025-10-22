import axios from "axios";

const baseURL = import.meta.env.VITE_PUBLIC_BACKEND_URL;

const api = axios.create({ baseURL });

export { api };
