import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ZERO, ZERO_INT } from "./common";
import { Searcher } from "../../generated/schema";
import { loadOrCreateGlobalStats } from "./loadOrCreateGlobalStats";

export function loadOrCreateSearcher(searcherAddress: Bytes): Searcher {
  let searcher = Searcher.load(searcherAddress);
  if (!searcher) {
    searcher = new Searcher(searcherAddress);
    searcher.address = searcherAddress;

    searcher.bundlesLanded = ZERO;
    searcher.bundlesWithRefundLanded = ZERO;
    searcher.fastBidsLanded = ZERO;

    searcher.totalTipped = ZERO;

    searcher.totalBundlesTipped = ZERO;
    searcher.totalBundlesWithRefundTipped = ZERO;
    searcher.totalFastBidsTipped = ZERO;

    searcher.lastBundleLandedTimestamp = ZERO_INT;
    searcher.lastBundleWithRefundLandedTimestamp = ZERO_INT;
    searcher.lastFastBidLandedTimestamp = ZERO_INT;

    searcher.save();

    const stats = loadOrCreateGlobalStats();
    stats.totalUniqueSearchers = stats.totalUniqueSearchers.plus(
      BigInt.fromI32(1)
    );
    stats.save();
  }
  return searcher;
}
