interface FeesDisplayProps {
  depositFee: number;
  routeFee: number;
}

export const FeesDisplay = ({ depositFee, routeFee }: FeesDisplayProps) => {
  const fees = [
    { name: "Deposit fee", value: `${depositFee}%` },
    { name: "Route fee", value: `${routeFee}%` },
  ];
  return (
    <div className="flex flex-col gap-[7px] px-[14px] pb-[14px] font-normal text-xs text-zinc-400">
      {fees.map((fee) => (
        <div className="flex flex-row justify-between" key={fee.name}>
          <div>{fee.name}:</div>
          <div>{fee.value}</div>
        </div>
      ))}
    </div>
  );
};
