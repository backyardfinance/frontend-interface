import { useState } from "react";
import { Table } from "../table";

export const RecentActivity = () => {
  const [page, setPage] = useState(1);
  const activity = [
    {
      id: "1",
      token: "USDT",
      amount: "1000",
      strategy: "STR-02",
      status: "DEPOSIT", //"WITHDRAW",
    },
    {
      id: "2",
      token: "USDC",
      amount: "1000",
      strategy: "STR-02",
      status: "WITHDRAW", //"WITHDRAW",
    },
    {
      id: "3",
      token: "USDT",
      amount: "1000",
      strategy: "STR-02",
      status: "DEPOSIT", //"WITHDRAW",
    },
    {
      id: "4",
      token: "USDT",
      amount: "1000",
      strategy: "STR-02",
      status: "DEPOSIT", //"WITHDRAW",
    },
    {
      id: "5",
      token: "USDT",
      amount: "1000",
      strategy: "STR-02",
      status: "DEPOSIT", //"WITHDRAW",
    },
    {
      id: "6",
      token: "USDT",
      amount: "1000",
      strategy: "STR-02",
      status: "DEPOSIT", //"WITHDRAW",
    },
    {
      id: "7",
      token: "USDT",
      amount: "1000",
      strategy: "STR-02",
      status: "DEPOSIT", //"WITHDRAW",
    },
  ];

  const table = {
    headers: ["id", "token", "amount", "strategy", "status"],
    rows: activity.map((item) => [item.id, item.token, item.amount, item.strategy, item.status]),
  };

  return (
    <div className="flex min-h-[131px] flex-col gap-4 rounded-[23px] border-2 border-[#F6F6F6] border-solid px-4 py-4 [background:#FAFAFA]">
      <p className="font-bold text-neutral-800 text-sm">Recent Activity</p>
      <div className="flex flex-1">
        {!activity.length ? (
          <>
            <p className="flex-1 self-center text-center font-normal text-[#949494] text-sm">
              You don't have any activity yet
            </p>
            <div className="w-[90%] self-center border-[#F3F3F3] border-b" />
          </>
        ) : (
          <Table
            headers={table.headers}
            pagination={{ currentPage: page, totalPages: Math.ceil(activity.length / 5), onPageChange: setPage }}
            // rows={table.rows}
            rowClassName="bg-white"
            rows={table.rows.slice((page - 1) * 5, page * 5)}
          />
        )}
      </div>
    </div>
  );
};
