import type { StrategyInfoResponseStrategyStatusEnum } from "@/api";
import type { BadgeVariants } from "@/common/components/ui/badge";

export const getBadgeStrategyStatusVariant = (status: StrategyInfoResponseStrategyStatusEnum): BadgeVariants => {
  if (status === "CONFIRMED") return "purple";
  if (status === "PROCESSING") return "blue";
  if (status === "FAILED") return "red";
  return "default";
};
