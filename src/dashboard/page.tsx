import { AverageAPYChart } from "@/dashboard/components/AverageAPYChart";
import { DashboardData } from "@/dashboard/components/DashboardData";
import { DashboardTable } from "@/dashboard/components/DashboardTable";
import { PlatformExposureChart } from "@/dashboard/components/PlatformExposureChart";
import { PositionPerformanceChart } from "@/dashboard/components/PositionPerformanceChart";
import { TokenExposureChart } from "@/dashboard/components/TokenExposureChart";

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
      <DashboardTable />
    </section>
  );
}
