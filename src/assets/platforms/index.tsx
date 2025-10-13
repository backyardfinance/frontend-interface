import type { Platform } from "@/utils/types";
import DriftIcon from "./Drift.svg?react";
import HyloIcon from "./Hylo.svg?react";
import JupyterIcon from "./Jupyter.svg?react";
import SynatraIcon from "./Synatra.svg?react";

export const getPlatformImage = (name: Platform) => {
  switch (name) {
    case "Drift":
      return <DriftIcon className="h-full w-full" />;
    case "Hylo":
      return <HyloIcon className="h-full w-full" />;
    case "Jupyter":
      return <JupyterIcon className="h-full w-full" />;
    case "Synatra":
      return <SynatraIcon className="h-full w-full" />;
  }
};
