import { useState } from "react";
import { Link } from "react-router";
import { getTokenImage } from "@/common/assets/tokens";
import { Table } from "@/common/components/table";
import { Badge } from "@/common/components/ui/badge";
import { ArrowIcon } from "@/icons/arrow";
import { toVaultRoute } from "@/routes";

export const RecentActivity = () => {
  const [page, setPage] = useState(1);
  const activity = [] as {
    id: string;
    token: string;
    amount: string;
    strategy: string;
    status: string;
  }[];

  const table = {
    headers: ["token", "amount", "strategy", "status"],
    rows: activity.map((item) => [
      <span className="inline-flex items-center gap-1" key={item.id}>
        <span className="size-3">{getTokenImage(item.token)}</span>
        {item.token}
      </span>,
      item.amount,
      <Badge key={item.id} variant="secondary">
        {item.strategy}
      </Badge>,
      <Badge key={item.id} text="xxs" variant="secondary">
        {item.status}
      </Badge>,
    ]),
  };

  return (
    <div className="flex min-h-[131px] flex-col gap-4 rounded-[23px] border-2 border-[#F6F6F6] border-solid px-4 py-4 [background:#FAFAFA]">
      <p className="font-bold text-neutral-800 text-sm">Recent Activity</p>
      <div className="flex flex-1 flex-col">
        {!activity.length ? (
          <>
            <p className="flex-1 self-center text-center font-normal text-[#949494] text-sm">
              You don't have any activity yet
            </p>
            <div className="w-[90%] self-center border-[#F3F3F3] border-b" />
          </>
        ) : (
          <Table
            action={(rowIndex) => {
              const item = activity[(rowIndex + (page - 1) * 5) % activity.length];
              return (
                <Link
                  className="flex size-[17px] items-center justify-center rounded-[21.5px] bg-[#F8F8F8]"
                  to={toVaultRoute(item.id)}
                >
                  <ArrowIcon className="size-2 rotate-45" />
                </Link>
              );
            }}
            headers={table.headers}
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(activity.length / 5),
              onPageChange: setPage,
            }}
            rowClassName="bg-white"
            rows={table.rows.slice((page - 1) * 5, page * 5)}
          />
        )}
      </div>
    </div>
  );
};
