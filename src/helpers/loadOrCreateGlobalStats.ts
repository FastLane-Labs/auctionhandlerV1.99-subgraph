import { ZERO, STATS_ID } from "./common";
import { GlobalStat } from "../../generated/schema";

export function loadOrCreateGlobalStats(): GlobalStat {
  let stats = GlobalStat.load(STATS_ID);
  if (!stats) {
    stats = new GlobalStat(STATS_ID);

    stats.totalExecutedBundlesCount = ZERO;
    stats.totalExecutedBundlesWithRefundCount = ZERO;
    stats.totalExecutedFastBidsCount = ZERO;

    stats.totalValidatorsPaid = ZERO;

    stats.totalUniqueSearchers = ZERO;

    stats.save();
  }
  return stats;
}
