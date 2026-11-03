import type { DataProvider } from "./types.js";
import { LocalProvider } from "./localProvider.js";
import { ApiFootballProvider } from "./apiFootballProvider.js";

export function getProvider(): DataProvider {
  const kind = process.env.DATA_PROVIDER ?? "local";
  if (kind === "api-football") {
    const key = process.env.API_FOOTBALL_KEY;
    if (!key) throw new Error("DATA_PROVIDER=api-football needs API_FOOTBALL_KEY");
    return new ApiFootballProvider(key);
  }
  return new LocalProvider();
}
