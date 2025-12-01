export type RpcResponse<T> = {
  id: number;
  jsonrpc: string;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
};

export type ParamsWithEncoding<T extends any[]> = [...T] | [...T, { encoding: "base58" | "base64" }];

export type ResultWithContext<T> = {
  context: {
    slot: number;
  };
  value: T;
};

// method: getTipAccounts
export type GetTipAccountsResult = string[];

// method: sendBundle
export type SendBundleParams = ParamsWithEncoding<[string[]]>;
export type SendBundleResult = string;

// method: sendTransaction
export type SendTransactionParams = ParamsWithEncoding<[string]>;
export type SendTransactionResult = string;

// method: getInflightBundleStatuses
export type GetInflightBundleStatusesParams = [string[]];
export type GetInflightBundleStatusesResult = ResultWithContext<
  {
    bundle_id: string;
    status: "Invalid" | "Pending" | "Failed" | "Landed";
    landed_slot: number | null;
  }[]
> | null;

// method: getBundleStatuses
export type GetBundleStatusesParams = [string[]];
export type GetBundleStatusesResult = ResultWithContext<
  {
    bundle_id: string;
    transactions: string[];
    slot: number;
    confirmation_status: "processed" | "confirmed" | "finalized";
    err: any;
  }[]
> | null;

// method: getTipFloor
export type GetTipFloorResult = {
  time: string;
  landed_tips_25th_percentile: number;
  landed_tips_50th_percentile: number;
  landed_tips_75th_percentile: number;
  landed_tips_95th_percentile: number;
  landed_tips_99th_percentile: number;
  ema_landed_tips_50th_percentile: number;
};
