export interface AreaChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface PieChartDataPoint {
  percentage: number;
  fill?: string;
  [key: string]: string | number | undefined;
}

//Platform Exposure
export interface PlatformExposureDataPoint {
  platform: string;
  percentage: number;
}

//Token Exposure
export interface TokenExposureDataPoint {
  token: string;
  percentage: number;
}

export interface ChartDataRequest {
  timeRange: "all" | "90d" | "30d" | "7d";
}

export interface ChartDataResponse {
  data: AreaChartDataPoint[] | PlatformExposureDataPoint[] | TokenExposureDataPoint[];
  timeRange: "all" | "90d" | "30d" | "7d";
}
