import { AverageAPYChart } from "@/components/dashboard/AverageAPYChart";
import { DashboardData } from "@/components/dashboard/DashboardData";
import { PlatformExposureChart } from "@/components/dashboard/PlatformExposureChart";
import { PositionPerformanceChart } from "@/components/dashboard/PositionPerformanceChart";
import { TokenExposureChart } from "@/components/dashboard/TokenExposureChart";

export default function DashboardPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <DashboardData />
      <div className="grid grid-cols-[347px_347px_254px_254px] justify-center gap-4">
        <PositionPerformanceChart />
        <AverageAPYChart />
        <PlatformExposureChart />
        <TokenExposureChart />
      </div>
    </section>
  );
}
