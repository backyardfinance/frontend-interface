import { useQuery } from "@tanstack/react-query";
import { getVaults } from "@/services/mock-data-api";

export const useVaults = () => {
  const { data: vaults } = useQuery({
    queryKey: ["vaults"],
    queryFn: () => getVaults(),
  });

  return vaults;
};
