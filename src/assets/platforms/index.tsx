import { cn } from "@/utils";
import DriftIcon from "./Drift.svg?react";
import HyloIcon from "./Hylo.svg?react";
import JupyterIcon from "./Jupyter.svg?react";
import SynatraIcon from "./Synatra.svg?react";

export const getPlatformImage = (name: string, className?: string) => {
  switch (name) {
    case "Drift":
      return <DriftIcon className={cn(className)} />;
    case "Hylo":
      return <HyloIcon className={cn(className)} />;
    case "Jupyter":
      return <JupyterIcon className={cn(className)} />;
    case "Synatra":
      return <SynatraIcon className={cn(className)} />;
  }
};
