import { Loading } from "@/common/components/loading";
import { Button } from "@/common/components/ui/button";
import { AverageAPYChart } from "@/dashboard/components/AverageAPYChart";
import { DashboardData } from "@/dashboard/components/DashboardData";
import { DashboardTable } from "@/dashboard/components/DashboardTable";
import { PlatformExposureChart } from "@/dashboard/components/PlatformExposureChart";
import { PositionPerformanceChart } from "@/dashboard/components/PositionPerformanceChart";
import { TokenExposureChart } from "@/dashboard/components/TokenExposureChart";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useStrategiesPositions } from "./hooks/useStrategiesPositions";

export default function DashboardPage() {
  const { isLoading } = useStrategiesPositions();

  const { address, signIn } = useSolanaWallet();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <DashboardData disabled={!address} />
      {address ? (
        <>
          <div className="grid grid-cols-[347px_347px_254px_254px] justify-center gap-4">
            <PositionPerformanceChart />
            <AverageAPYChart />
            <PlatformExposureChart />
            <TokenExposureChart />
          </div>
          <DashboardTable />
        </>
      ) : (
        <div className="mt-40 flex flex-col items-center justify-center gap-4">
          <p className="text-center font-bold text-neutral-400 text-xl leading-[normal] md:text-3xl">
            Connect your wallet to continue
          </p>
          <Button onClick={signIn} variant="secondary">
            Connect Wallet
          </Button>
        </div>
      )}
    </section>
  );
}
