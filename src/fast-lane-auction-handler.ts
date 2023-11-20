import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  RelayFastBid as RelayFastBidEvent,
  RelayFlashBid as RelayFlashBidEvent,
  RelayFlashBidWithRefund as RelayFlashBidWithRefundEvent,
} from "../generated/FastLaneAuctionHandler/FastLaneAuctionHandler";
import {
  Collection,
  HourlyCollectionSnapshotGlobal,
  DailyCollectionSnapshotGlobal,
  WeeklyCollectionSnapshotGlobal,
  HourlyValidatorSnapshot,
  DailyValidatorSnapshot,
  WeeklyValidatorSnapshot,
  RelayFastBid,
  RelayFlashBid,
  RelayFlashBidWithRefund,
} from "../generated/schema";

import {
  ONE,
  STATS_ID,
  HOURLY,
  DAILY,
  WEEKLY,
  HOURLY_VAL,
  DAILY_VAL,
  WEEKLY_VAL,
  BUNDLES,
  BUNDLES_WITH_REFUND,
  FAST_BIDS,
} from "./helpers/common";
import { loadOrCreateGlobalStats } from "./helpers/loadOrCreateGlobalStats";
import { loadOrCreateValidator } from "./helpers/loadOrCreateValidator";
import { loadOrCreateSearcher } from "./helpers/loadOrCreateSearcher";
import {
  loadOrCreateHourlyCollectionSnapshotGlobal,
  loadOrCreateHourlyValidatorSnapshot,
} from "./helpers/collectionshapshots/loadOrCreateHourlyCollectionSnapshots";
import {
  loadOrCreateDailyValidatorSnapshot,
  loadOrCreateDailyCollectionSnapshotGlobal,
} from "./helpers/collectionshapshots/loadOrCreateDailyCollectionSnapshots";
import {
  loadOrCreateWeeklyValidatorSnapshot,
  loadOrCreateWeeklyCollectionSnapshotGlobal,
} from "./helpers/collectionshapshots/loadOrCreateWeeklyCollectionSnapshots";

function updateTimeRange(
  event: RelayFlashBidEvent | RelayFlashBidWithRefundEvent | RelayFastBidEvent,
  bidAmount: BigInt,
  timeRangeName: string,
  bidType: string,
  divBy: number
): void {
  let timeRange = event.block.timestamp
    .div(BigInt.fromI32(divBy as i32))
    .toI32();
  let entityGlobalId = `${STATS_ID.toHexString()}-${timeRangeName}-${timeRange.toString()}`;
  let entityLocalId = `${event.params.validator.toHexString()}-${timeRangeName}-${timeRange.toString()}`;

  let globalEntityForRange:
    | HourlyCollectionSnapshotGlobal
    | DailyCollectionSnapshotGlobal
    | WeeklyCollectionSnapshotGlobal;

  let localEntityForRange:
    | HourlyValidatorSnapshot
    | DailyValidatorSnapshot
    | WeeklyValidatorSnapshot;

  switch (timeRangeName) {
    case HOURLY:
      globalEntityForRange = loadOrCreateHourlyCollectionSnapshotGlobal(
        entityGlobalId
      );
      localEntityForRange = loadOrCreateHourlyValidatorSnapshot(
        entityLocalId,
        event.params.validator
      );
      break;
    case DAILY:
      globalEntityForRange = loadOrCreateDailyCollectionSnapshotGlobal(
        entityGlobalId
      );
      localEntityForRange = loadOrCreateDailyValidatorSnapshot(
        entityLocalId,
        event.params.validator
      );
      break;
    case WEEKLY:
      globalEntityForRange = loadOrCreateWeeklyCollectionSnapshotGlobal(
        entityGlobalId
      );
      localEntityForRange = loadOrCreateWeeklyValidatorSnapshot(
        entityLocalId,
        event.params.validator
      );
      break;
    default:
      log.error("Invalid time range name: {}", [timeRangeName]);
      return;
  }

  let globalCollection: Collection;
  let localCollection: Collection;

  switch (bidType) {
    case BUNDLES:
      globalCollection = Collection.load(
        globalEntityForRange.bundlesCollection
      )!;
      localCollection = Collection.load(localEntityForRange.bundlesCollection)!;
      break;

    case BUNDLES_WITH_REFUND:
      globalCollection = Collection.load(
        globalEntityForRange.bundlesWithRefundCollection
      )!;
      localCollection = Collection.load(
        localEntityForRange.bundlesWithRefundCollection
      )!;
      break;

    case FAST_BIDS:
      globalCollection = Collection.load(
        globalEntityForRange.fastBidsCollection
      )!;
      localCollection = Collection.load(
        localEntityForRange.fastBidsCollection
      )!;
      break;

    default:
      log.error("Invalid bid type: {}", [bidType]);
      return;
  }

  // Global Specific:
  // Add the validator in range
  if (!globalCollection.validators.includes(event.params.validator)) {
    const vList = globalCollection.validators;
    vList.push(event.params.validator);
    globalCollection.validators = vList;
    globalCollection.save();
  }

  // Both
  globalCollection.rangeTransactions = globalCollection.rangeTransactions + 1;
  globalCollection.rangeVolume = globalCollection.rangeVolume.plus(bidAmount);
  if (globalCollection.timestamp == 0)
    globalCollection.timestamp = (timeRange * divBy) as i32;
  if (bidAmount > globalCollection.topBid) globalCollection.topBid = bidAmount;

  localCollection.rangeTransactions = localCollection.rangeTransactions + 1;
  localCollection.rangeVolume = localCollection.rangeVolume.plus(bidAmount);
  if (localCollection.timestamp == 0)
    localCollection.timestamp = (timeRange * divBy) as i32;
  if (bidAmount > localCollection.topBid) localCollection.topBid = bidAmount;

  globalCollection.save();
  localCollection.save();
}

export function handleRelayFastBid(event: RelayFastBidEvent): void {
  // Entity
  let entity = new RelayFastBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.validator = event.params.validator;
  entity.success = event.params.success;
  entity.bidAmount = event.params.bidAmount;
  entity.searcherContractAddress = event.params.searcherContractAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Searcher
  const searcher = loadOrCreateSearcher(event.params.sender);
  searcher.fastBidsLanded = searcher.fastBidsLanded.plus(ONE);
  searcher.lastFastBidLandedTimestamp = event.block.timestamp.toI32();
  searcher.totalFastBidsTipped = searcher.totalFastBidsTipped.plus(
    event.params.bidAmount
  );
  searcher.totalTipped = searcher.totalTipped.plus(event.params.bidAmount);
  searcher.save();

  // Validator
  const validator = loadOrCreateValidator(event.params.validator);
  validator.totalFastBidsTips = validator.totalFastBidsTips.plus(
    event.params.bidAmount
  );
  validator.totalTips = validator.totalTips.plus(event.params.bidAmount);
  validator.lastFastBidReceivedTimestamp = event.block.timestamp.toI32();
  validator.totalExecutedFastBidsCount = validator.totalExecutedFastBidsCount.plus(
    ONE
  );
  validator.save();

  // Stats
  const stats = loadOrCreateGlobalStats();
  stats.totalExecutedFastBidsCount = stats.totalExecutedFastBidsCount.plus(ONE);
  stats.totalValidatorsPaid = stats.totalValidatorsPaid.plus(
    event.params.bidAmount
  );
  stats.save();

  // Update time ranges
  updateTimeRange(
    event,
    event.params.bidAmount,
    HOURLY,
    FAST_BIDS,
    HOURLY_VAL as i32
  );

  updateTimeRange(
    event,
    event.params.bidAmount,
    DAILY,
    FAST_BIDS,
    DAILY_VAL as i32
  );

  updateTimeRange(
    event,
    event.params.bidAmount,
    WEEKLY,
    FAST_BIDS,
    WEEKLY_VAL as i32
  );
}

export function handleRelayFlashBid(event: RelayFlashBidEvent): void {
  // Entity
  let entity = new RelayFlashBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.oppTxHash = event.params.oppTxHash;
  entity.validator = event.params.validator;
  entity.bidAmount = event.params.bidAmount;
  entity.amountPaid = event.params.amountPaid;
  entity.searcherContractAddress = event.params.searcherContractAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Searcher
  const searcher = loadOrCreateSearcher(event.params.sender);
  searcher.bundlesLanded = searcher.bundlesLanded.plus(ONE);
  searcher.lastBundleLandedTimestamp = event.block.timestamp.toI32();
  searcher.totalBundlesTipped = searcher.totalBundlesTipped.plus(
    event.params.amountPaid
  );
  searcher.totalTipped = searcher.totalTipped.plus(event.params.amountPaid);
  searcher.save();

  // Validator
  const validator = loadOrCreateValidator(event.params.validator);
  validator.totalBundlesTips = validator.totalBundlesTips.plus(
    event.params.amountPaid
  );
  validator.totalTips = validator.totalTips.plus(event.params.amountPaid);
  validator.lastBundleReceivedTimestamp = event.block.timestamp.toI32();
  validator.totalExecutedBundlesCount = validator.totalExecutedBundlesCount.plus(
    ONE
  );
  validator.save();

  // Stats
  const stats = loadOrCreateGlobalStats();
  stats.totalExecutedBundlesCount = stats.totalExecutedBundlesCount.plus(ONE);
  stats.totalValidatorsPaid = stats.totalValidatorsPaid.plus(
    event.params.amountPaid
  );
  stats.save();

  // Update time ranges
  updateTimeRange(
    event,
    event.params.amountPaid,
    HOURLY,
    BUNDLES,
    HOURLY_VAL as i32
  );

  updateTimeRange(
    event,
    event.params.amountPaid,
    DAILY,
    BUNDLES,
    DAILY_VAL as i32
  );

  updateTimeRange(
    event,
    event.params.amountPaid,
    WEEKLY,
    BUNDLES,
    WEEKLY_VAL as i32
  );
}

export function handleRelayFlashBidWithRefund(
  event: RelayFlashBidWithRefundEvent
): void {
  // Entity
  let entity = new RelayFlashBidWithRefund(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.oppTxHash = event.params.oppTxHash;
  entity.validator = event.params.validator;
  entity.bidAmount = event.params.bidAmount;
  entity.amountPaid = event.params.amountPaid;
  entity.searcherContractAddress = event.params.searcherContractAddress;
  entity.refundedAmount = event.params.refundedAmount;
  entity.refundAddress = event.params.refundAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Searcher
  const searcher = loadOrCreateSearcher(event.params.sender);
  searcher.bundlesWithRefundLanded = searcher.bundlesWithRefundLanded.plus(ONE);
  searcher.lastBundleWithRefundLandedTimestamp = event.block.timestamp.toI32();
  searcher.totalBundlesWithRefundTipped = searcher.totalBundlesWithRefundTipped.plus(
    event.params.amountPaid
  );
  searcher.totalTipped = searcher.totalTipped.plus(event.params.amountPaid);
  searcher.save();

  // Validator share (amount paid by searcher minus refunded amount)
  const validatorShare = event.params.amountPaid.minus(
    event.params.refundedAmount
  );

  // Validator
  const validator = loadOrCreateValidator(event.params.validator);
  validator.totalBundlesWithRefundTips = validator.totalBundlesWithRefundTips.plus(
    validatorShare
  );
  validator.totalTips = validator.totalTips.plus(validatorShare);
  validator.lastBundleWithRefundReceivedTimestamp = event.block.timestamp.toI32();
  validator.totalExecutedBundlesWithRefundCount = validator.totalExecutedBundlesWithRefundCount.plus(
    ONE
  );
  validator.save();

  // Stats
  const stats = loadOrCreateGlobalStats();
  stats.totalExecutedBundlesWithRefundCount = stats.totalExecutedBundlesWithRefundCount.plus(
    ONE
  );
  stats.totalValidatorsPaid = stats.totalValidatorsPaid.plus(validatorShare);
  stats.save();

  // Update time ranges
  updateTimeRange(
    event,
    event.params.amountPaid,
    HOURLY,
    BUNDLES_WITH_REFUND,
    HOURLY_VAL as i32
  );

  updateTimeRange(
    event,
    event.params.amountPaid,
    DAILY,
    BUNDLES_WITH_REFUND,
    DAILY_VAL as i32
  );

  updateTimeRange(
    event,
    event.params.amountPaid,
    WEEKLY,
    BUNDLES_WITH_REFUND,
    WEEKLY_VAL as i32
  );
}
