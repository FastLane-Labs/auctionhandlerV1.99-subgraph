import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { ZERO, ZERO_INT, ZERO_BIG_DEC, STATS_ID, ADDRESS_ZERO } from "../common";
import { Collection, WeeklyCollectionSnapshotGlobal, WeeklyValidatorSnapshot } from "../../../generated/schema";

export function loadOrCreateWeeklyCollectionSnapshotGlobal(id: string): WeeklyCollectionSnapshotGlobal {
  let snap = WeeklyCollectionSnapshotGlobal.load(id);
  if (!snap) {
    snap = new WeeklyCollectionSnapshotGlobal(id);
    snap.target = STATS_ID;

    let bundlesCollection = new Collection(`${id}-bundles`);
    bundlesCollection.timestamp = ZERO_INT;
    bundlesCollection.rangeVolume = ZERO;
    bundlesCollection.rangeTransactions = ZERO_INT;
    bundlesCollection.validators = [];
    bundlesCollection.topBid = ZERO;
    bundlesCollection.save();
    snap.bundlesCollection = bundlesCollection.id;

    let bundlesWithRefundCollection = new Collection(`${id}-bundlesWithRefund`);
    bundlesWithRefundCollection.timestamp = ZERO_INT;
    bundlesWithRefundCollection.rangeVolume = ZERO;
    bundlesWithRefundCollection.rangeTransactions = ZERO_INT;
    bundlesWithRefundCollection.validators = [];
    bundlesWithRefundCollection.topBid = ZERO;
    bundlesWithRefundCollection.save();
    snap.bundlesWithRefundCollection = bundlesWithRefundCollection.id;

    let fastBidsCollection = new Collection(`${id}-fastBids`);
    fastBidsCollection.timestamp = ZERO_INT;
    fastBidsCollection.rangeVolume = ZERO;
    fastBidsCollection.rangeTransactions = ZERO_INT;
    fastBidsCollection.validators = [];
    fastBidsCollection.topBid = ZERO;
    fastBidsCollection.save();
    snap.fastBidsCollection = fastBidsCollection.id;

    snap.save();
  }
  return snap;
}

export function loadOrCreateWeeklyValidatorSnapshot(id: string, validatorAddress: Bytes): WeeklyValidatorSnapshot {
  let snap = WeeklyValidatorSnapshot.load(id);
  if (!snap) {
    snap = new WeeklyValidatorSnapshot(id);
    snap.target = validatorAddress;

    let bundlesCollection = new Collection(`${id}-bundles`);
    bundlesCollection.timestamp = ZERO_INT;
    bundlesCollection.rangeVolume = ZERO;
    bundlesCollection.rangeTransactions = ZERO_INT;
    bundlesCollection.validators = [];
    bundlesCollection.topBid = ZERO;
    bundlesCollection.save();
    snap.bundlesCollection = bundlesCollection.id;

    let bundlesWithRefundCollection = new Collection(`${id}-bundlesWithRefund`);
    bundlesWithRefundCollection.timestamp = ZERO_INT;
    bundlesWithRefundCollection.rangeVolume = ZERO;
    bundlesWithRefundCollection.rangeTransactions = ZERO_INT;
    bundlesWithRefundCollection.validators = [];
    bundlesWithRefundCollection.topBid = ZERO;
    bundlesWithRefundCollection.save();
    snap.bundlesWithRefundCollection = bundlesWithRefundCollection.id;

    let fastBidsCollection = new Collection(`${id}-fastBids`);
    fastBidsCollection.timestamp = ZERO_INT;
    fastBidsCollection.rangeVolume = ZERO;
    fastBidsCollection.rangeTransactions = ZERO_INT;
    fastBidsCollection.validators = [];
    fastBidsCollection.topBid = ZERO;
    fastBidsCollection.save();
    snap.fastBidsCollection = fastBidsCollection.id;

    snap.save();
  }
  return snap;
}
