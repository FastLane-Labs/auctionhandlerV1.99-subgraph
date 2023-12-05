import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  RelayFastBid as RelayFastBidEvent,
  RelayFlashBid as RelayFlashBidEvent,
  RelayFlashBidWithRefund as RelayFlashBidWithRefundEvent,
  RelayProcessingPaidValidator as RelayProcessingPaidValidatorEvent,
  CustomPaymentProcessorPaid as CustomPaymentProcessorPaidEvent
} from "../generated/FastLaneAuctionHandler/FastLaneAuctionHandler";
import {
  Collection,
  RelayFastBid,
  RelayFlashBid,
  RelayFlashBidWithRefund,
  RelayProcessingPaidValidator,
  CustomPaymentProcessorPaid
} from "../generated/schema";

import { ONE, STATS_ID, HOURLY_VAL, DAILY_VAL, WEEKLY_VAL } from "./helpers/common";
import { loadOrCreateGlobalStats } from "./helpers/loadOrCreateGlobalStats";
import { loadOrCreateValidator } from "./helpers/loadOrCreateValidator";
import { loadOrCreateSearcher } from "./helpers/loadOrCreateSearcher";
import {
  loadOrCreateHourlyCollectionSnapshotGlobal,
  loadOrCreateHourlyValidatorSnapshot
} from "./helpers/collectionshapshots/loadOrCreateHourlyCollectionSnapshots";
import {
  loadOrCreateDailyValidatorSnapshot,
  loadOrCreateDailyCollectionSnapshotGlobal
} from "./helpers/collectionshapshots/loadOrCreateDailyCollectionSnapshots";
import {
  loadOrCreateWeeklyValidatorSnapshot,
  loadOrCreateWeeklyCollectionSnapshotGlobal
} from "./helpers/collectionshapshots/loadOrCreateWeeklyCollectionSnapshots";

function updateHourly(
  relayFlashBidEvent: RelayFlashBidEvent | null,
  relayFlashBidWithRefundEvent: RelayFlashBidWithRefundEvent | null,
  relayFastBidEvent: RelayFastBidEvent | null,
  bidAmount: BigInt,
  divBy: number
): void {
  let nonNullEvent = 0;
  let timestamp: BigInt = BigInt.fromI32(0);
  let validator: Bytes = Bytes.fromI32(0);

  if (relayFlashBidEvent != null) {
    nonNullEvent++;
    timestamp = relayFlashBidEvent.block.timestamp;
    validator = relayFlashBidEvent.params.validator;
  }

  if (relayFlashBidWithRefundEvent != null) {
    nonNullEvent++;
    timestamp = relayFlashBidWithRefundEvent.block.timestamp;
    validator = relayFlashBidWithRefundEvent.params.validator;
  }

  if (relayFastBidEvent != null) {
    nonNullEvent++;
    timestamp = relayFastBidEvent.block.timestamp;
    validator = relayFastBidEvent.params.validator;
  }

  if (nonNullEvent != 1) {
    log.error("Exactly 1 event required", []);
    return;
  }

  let timeRange = timestamp.div(BigInt.fromI32(divBy as i32)).toI32();
  let globalEntityForRange = loadOrCreateHourlyCollectionSnapshotGlobal(
    `${STATS_ID.toHexString()}-HOURLY-${timeRange.toString()}`
  );
  let localEntityForRange = loadOrCreateHourlyValidatorSnapshot(
    `${validator.toHexString()}-HOURLY-${timeRange.toString()}`,
    validator
  );

  let globalCollection: Collection;
  let localCollection: Collection;

  if (relayFlashBidEvent != null) {
    globalCollection = Collection.load(globalEntityForRange.bundlesCollection)!;
    localCollection = Collection.load(localEntityForRange.bundlesCollection)!;
  } else if (relayFlashBidWithRefundEvent != null) {
    globalCollection = Collection.load(globalEntityForRange.bundlesWithRefundCollection)!;
    localCollection = Collection.load(localEntityForRange.bundlesWithRefundCollection)!;
  } else {
    // relayFastBidEvent
    globalCollection = Collection.load(globalEntityForRange.fastBidsCollection)!;
    localCollection = Collection.load(localEntityForRange.fastBidsCollection)!;
  }

  // Global Specific:
  // Add the validator in range
  if (!globalCollection.validators.includes(validator)) {
    const vList = globalCollection.validators;
    vList.push(validator);
    globalCollection.validators = vList;
    globalCollection.save();
  }

  // Both
  globalCollection.rangeTransactions = globalCollection.rangeTransactions + 1;
  globalCollection.rangeVolume = globalCollection.rangeVolume.plus(bidAmount);
  if (globalCollection.timestamp == 0) globalCollection.timestamp = (timeRange * divBy) as i32;
  if (bidAmount > globalCollection.topBid) globalCollection.topBid = bidAmount;

  localCollection.rangeTransactions = localCollection.rangeTransactions + 1;
  localCollection.rangeVolume = localCollection.rangeVolume.plus(bidAmount);
  if (localCollection.timestamp == 0) localCollection.timestamp = (timeRange * divBy) as i32;
  if (bidAmount > localCollection.topBid) localCollection.topBid = bidAmount;

  globalCollection.save();
  localCollection.save();
}

function updateDaily(
  relayFlashBidEvent: RelayFlashBidEvent | null,
  relayFlashBidWithRefundEvent: RelayFlashBidWithRefundEvent | null,
  relayFastBidEvent: RelayFastBidEvent | null,
  bidAmount: BigInt,
  divBy: number
): void {
  let nonNullEvent = 0;
  let timestamp: BigInt = BigInt.fromI32(0);
  let validator: Bytes = Bytes.fromI32(0);

  if (relayFlashBidEvent != null) {
    nonNullEvent++;
    timestamp = relayFlashBidEvent.block.timestamp;
    validator = relayFlashBidEvent.params.validator;
  }

  if (relayFlashBidWithRefundEvent != null) {
    nonNullEvent++;
    timestamp = relayFlashBidWithRefundEvent.block.timestamp;
    validator = relayFlashBidWithRefundEvent.params.validator;
  }

  if (relayFastBidEvent != null) {
    nonNullEvent++;
    timestamp = relayFastBidEvent.block.timestamp;
    validator = relayFastBidEvent.params.validator;
  }

  if (nonNullEvent != 1) {
    log.error("Exactly 1 event required", []);
    return;
  }

  let timeRange = timestamp.div(BigInt.fromI32(divBy as i32)).toI32();
  let globalEntityForRange = loadOrCreateDailyCollectionSnapshotGlobal(
    `${STATS_ID.toHexString()}-DAILY-${timeRange.toString()}`
  );
  let localEntityForRange = loadOrCreateDailyValidatorSnapshot(
    `${validator.toHexString()}-DAILY-${timeRange.toString()}`,
    validator
  );

  let globalCollection: Collection;
  let localCollection: Collection;

  if (relayFlashBidEvent != null) {
    globalCollection = Collection.load(globalEntityForRange.bundlesCollection)!;
    localCollection = Collection.load(localEntityForRange.bundlesCollection)!;
  } else if (relayFlashBidWithRefundEvent != null) {
    globalCollection = Collection.load(globalEntityForRange.bundlesWithRefundCollection)!;
    localCollection = Collection.load(localEntityForRange.bundlesWithRefundCollection)!;
  } else {
    // relayFastBidEvent
    globalCollection = Collection.load(globalEntityForRange.fastBidsCollection)!;
    localCollection = Collection.load(localEntityForRange.fastBidsCollection)!;
  }

  // Global Specific:
  // Add the validator in range
  if (!globalCollection.validators.includes(validator)) {
    const vList = globalCollection.validators;
    vList.push(validator);
    globalCollection.validators = vList;
    globalCollection.save();
  }

  // Both
  globalCollection.rangeTransactions = globalCollection.rangeTransactions + 1;
  globalCollection.rangeVolume = globalCollection.rangeVolume.plus(bidAmount);
  if (globalCollection.timestamp == 0) globalCollection.timestamp = (timeRange * divBy) as i32;
  if (bidAmount > globalCollection.topBid) globalCollection.topBid = bidAmount;

  localCollection.rangeTransactions = localCollection.rangeTransactions + 1;
  localCollection.rangeVolume = localCollection.rangeVolume.plus(bidAmount);
  if (localCollection.timestamp == 0) localCollection.timestamp = (timeRange * divBy) as i32;
  if (bidAmount > localCollection.topBid) localCollection.topBid = bidAmount;

  globalCollection.save();
  localCollection.save();
}

function updateWeekly(
  relayFlashBidEvent: RelayFlashBidEvent | null,
  relayFlashBidWithRefundEvent: RelayFlashBidWithRefundEvent | null,
  relayFastBidEvent: RelayFastBidEvent | null,
  bidAmount: BigInt,
  divBy: number
): void {
  let nonNullEvent = 0;
  let timestamp: BigInt = BigInt.fromI32(0);
  let validator: Bytes = Bytes.fromI32(0);

  if (relayFlashBidEvent != null) {
    nonNullEvent++;
    timestamp = relayFlashBidEvent.block.timestamp;
    validator = relayFlashBidEvent.params.validator;
  }

  if (relayFlashBidWithRefundEvent != null) {
    nonNullEvent++;
    timestamp = relayFlashBidWithRefundEvent.block.timestamp;
    validator = relayFlashBidWithRefundEvent.params.validator;
  }

  if (relayFastBidEvent != null) {
    nonNullEvent++;
    timestamp = relayFastBidEvent.block.timestamp;
    validator = relayFastBidEvent.params.validator;
  }

  if (nonNullEvent != 1) {
    log.error("Exactly 1 event required", []);
    return;
  }

  let timeRange = timestamp.div(BigInt.fromI32(divBy as i32)).toI32();
  let globalEntityForRange = loadOrCreateWeeklyCollectionSnapshotGlobal(
    `${STATS_ID.toHexString()}-WEEKLY-${timeRange.toString()}`
  );
  let localEntityForRange = loadOrCreateWeeklyValidatorSnapshot(
    `${validator.toHexString()}-WEEKLY-${timeRange.toString()}`,
    validator
  );

  let globalCollection: Collection;
  let localCollection: Collection;

  if (relayFlashBidEvent != null) {
    globalCollection = Collection.load(globalEntityForRange.bundlesCollection)!;
    localCollection = Collection.load(localEntityForRange.bundlesCollection)!;
  } else if (relayFlashBidWithRefundEvent != null) {
    globalCollection = Collection.load(globalEntityForRange.bundlesWithRefundCollection)!;
    localCollection = Collection.load(localEntityForRange.bundlesWithRefundCollection)!;
  } else {
    // relayFastBidEvent
    globalCollection = Collection.load(globalEntityForRange.fastBidsCollection)!;
    localCollection = Collection.load(localEntityForRange.fastBidsCollection)!;
  }

  // Global Specific:
  // Add the validator in range
  if (!globalCollection.validators.includes(validator)) {
    const vList = globalCollection.validators;
    vList.push(validator);
    globalCollection.validators = vList;
    globalCollection.save();
  }

  // Both
  globalCollection.rangeTransactions = globalCollection.rangeTransactions + 1;
  globalCollection.rangeVolume = globalCollection.rangeVolume.plus(bidAmount);
  if (globalCollection.timestamp == 0) globalCollection.timestamp = (timeRange * divBy) as i32;
  if (bidAmount > globalCollection.topBid) globalCollection.topBid = bidAmount;

  localCollection.rangeTransactions = localCollection.rangeTransactions + 1;
  localCollection.rangeVolume = localCollection.rangeVolume.plus(bidAmount);
  if (localCollection.timestamp == 0) localCollection.timestamp = (timeRange * divBy) as i32;
  if (bidAmount > localCollection.topBid) localCollection.topBid = bidAmount;

  globalCollection.save();
  localCollection.save();
}

export function handleRelayFastBid(event: RelayFastBidEvent): void {
  if (!event.params.success) {
    // We don't index failed bids
    return;
  }

  // Entity
  let entity = new RelayFastBid(event.transaction.hash.concatI32(event.logIndex.toI32()));
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
  searcher.totalFastBidsTipped = searcher.totalFastBidsTipped.plus(event.params.bidAmount);
  searcher.totalTipped = searcher.totalTipped.plus(event.params.bidAmount);
  searcher.save();

  // Validator
  const validator = loadOrCreateValidator(event.params.validator);
  validator.totalFastBidsTips = validator.totalFastBidsTips.plus(event.params.bidAmount);
  validator.totalTips = validator.totalTips.plus(event.params.bidAmount);
  validator.lastFastBidReceivedTimestamp = event.block.timestamp.toI32();
  validator.totalExecutedFastBidsCount = validator.totalExecutedFastBidsCount.plus(ONE);
  validator.save();

  // Stats
  const stats = loadOrCreateGlobalStats();
  stats.totalExecutedFastBidsCount = stats.totalExecutedFastBidsCount.plus(ONE);
  stats.totalValidatorsPaid = stats.totalValidatorsPaid.plus(event.params.bidAmount);
  stats.save();

  // Update time ranges
  updateHourly(null, null, event, event.params.bidAmount, HOURLY_VAL as i32);
  updateDaily(null, null, event, event.params.bidAmount, DAILY_VAL as i32);
  updateWeekly(null, null, event, event.params.bidAmount, WEEKLY_VAL as i32);
}

export function handleRelayFlashBid(event: RelayFlashBidEvent): void {
  // Entity
  let entity = new RelayFlashBid(event.transaction.hash.concatI32(event.logIndex.toI32()));
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
  searcher.totalBundlesTipped = searcher.totalBundlesTipped.plus(event.params.amountPaid);
  searcher.totalTipped = searcher.totalTipped.plus(event.params.amountPaid);
  searcher.save();

  // Validator
  const validator = loadOrCreateValidator(event.params.validator);
  validator.totalBundlesTips = validator.totalBundlesTips.plus(event.params.amountPaid);
  validator.totalTips = validator.totalTips.plus(event.params.amountPaid);
  validator.lastBundleReceivedTimestamp = event.block.timestamp.toI32();
  validator.totalExecutedBundlesCount = validator.totalExecutedBundlesCount.plus(ONE);
  validator.save();

  // Stats
  const stats = loadOrCreateGlobalStats();
  stats.totalExecutedBundlesCount = stats.totalExecutedBundlesCount.plus(ONE);
  stats.totalValidatorsPaid = stats.totalValidatorsPaid.plus(event.params.amountPaid);
  stats.save();

  // Update time ranges
  updateHourly(event, null, null, event.params.amountPaid, HOURLY_VAL as i32);
  updateDaily(event, null, null, event.params.amountPaid, DAILY_VAL as i32);
  updateWeekly(event, null, null, event.params.amountPaid, WEEKLY_VAL as i32);
}

export function handleRelayFlashBidWithRefund(event: RelayFlashBidWithRefundEvent): void {
  // Entity
  let entity = new RelayFlashBidWithRefund(event.transaction.hash.concatI32(event.logIndex.toI32()));
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
  searcher.totalBundlesWithRefundTipped = searcher.totalBundlesWithRefundTipped.plus(event.params.amountPaid);
  searcher.totalTipped = searcher.totalTipped.plus(event.params.amountPaid);
  searcher.save();

  // Validator share (amount paid by searcher minus refunded amount)
  const validatorShare = event.params.amountPaid.minus(event.params.refundedAmount);

  // Validator
  const validator = loadOrCreateValidator(event.params.validator);
  validator.totalBundlesWithRefundTips = validator.totalBundlesWithRefundTips.plus(validatorShare);
  validator.totalTips = validator.totalTips.plus(validatorShare);
  validator.lastBundleWithRefundReceivedTimestamp = event.block.timestamp.toI32();
  validator.totalExecutedBundlesWithRefundCount = validator.totalExecutedBundlesWithRefundCount.plus(ONE);
  validator.save();

  // Stats
  const stats = loadOrCreateGlobalStats();
  stats.totalExecutedBundlesWithRefundCount = stats.totalExecutedBundlesWithRefundCount.plus(ONE);
  stats.totalValidatorsPaid = stats.totalValidatorsPaid.plus(validatorShare);
  stats.save();

  // Update time ranges
  updateHourly(null, event, null, event.params.amountPaid, HOURLY_VAL as i32);
  updateDaily(null, event, null, event.params.amountPaid, DAILY_VAL as i32);
  updateWeekly(null, event, null, event.params.amountPaid, WEEKLY_VAL as i32);
}

export function handleRelayProcessingPaidValidator(event: RelayProcessingPaidValidatorEvent): void {
  let entity = new RelayProcessingPaidValidator(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.validator = event.params.validator;
  entity.validatorPayment = event.params.validatorPayment;
  entity.initiator = event.params.initiator;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCustomPaymentProcessorPaid(event: CustomPaymentProcessorPaidEvent): void {
  let entity = new CustomPaymentProcessorPaid(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.payor = event.params.payor;
  entity.payee = event.params.payee;
  entity.paymentProcessor = event.params.paymentProcessor;
  entity.totalAmount = event.params.totalAmount;
  entity.startBlock = event.params.startBlock;
  entity.endBlock = event.params.endBlock;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
