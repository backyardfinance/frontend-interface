const STORAGE_KEYS = {
  ACCESS_TOKEN: "backyard-access-token",
  REFRESH_TOKEN: "backyard-refresh-token",
  SLIPPAGE: "backyard-slippage",
} as const;

export const localStorageService = {
  // Access Token
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  removeAccessToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Refresh Token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Both Tokens
  setTokens: (accessToken: string, refreshToken?: string): void => {
    localStorageService.setAccessToken(accessToken);
    if (refreshToken) {
      localStorageService.setRefreshToken(refreshToken);
    }
  },

  clearTokens: (): void => {
    localStorageService.removeAccessToken();
    localStorageService.removeRefreshToken();
  },

  hasTokens: (): boolean => {
    return !!(localStorageService.getAccessToken() && localStorageService.getRefreshToken());
  },

  getSlippage: (): number => {
    const slippage = localStorage.getItem(STORAGE_KEYS.SLIPPAGE);
    return slippage ? Number(slippage) : 0.01;
  },

  setSlippage: (slippage: number): void => {
    localStorage.setItem(STORAGE_KEYS.SLIPPAGE, slippage.toString());
  },
};
