import type { Vault } from "@/utils/types";
import apiClient from "./api-client";

export const getVaults = async () => {
  return (await apiClient.get("/get_vaults")).data as Vault[];
};
