import { Bytes } from "@graphprotocol/graph-ts";
import { ZERO, ZERO_INT, STATS_ID } from "../common";
import {
  Collection,
  DailyCollectionSnapshotGlobal,
  DailyValidatorSnapshot,
} from "../../../generated/schema";

export function loadOrCreateDailyCollectionSnapshotGlobal(
  id: string
): DailyCollectionSnapshotGlobal {
  let snap = DailyCollectionSnapshotGlobal.load(id);
  if (!snap) {
    snap = new DailyCollectionSnapshotGlobal(id);
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

export function loadOrCreateDailyValidatorSnapshot(
  id: string,
  validatorAddress: Bytes
): DailyValidatorSnapshot {
  let snap = DailyValidatorSnapshot.load(id);
  if (!snap) {
    snap = new DailyValidatorSnapshot(id);
    snap.target = validatorAddress;

    let bundlesCollection = new Collection(`${id}-bundles`);
    bundlesCollection.timestamp = ZERO_INT;
    bundlesCollection.rangeVolume = ZERO;
    bundlesCollection.rangeTransactions = ZERO_INT;
    bundlesCollection.topBid = ZERO;
    bundlesCollection.save();
    snap.bundlesCollection = bundlesCollection.id;

    let bundlesWithRefundCollection = new Collection(`${id}-bundlesWithRefund`);
    bundlesWithRefundCollection.timestamp = ZERO_INT;
    bundlesWithRefundCollection.rangeVolume = ZERO;
    bundlesWithRefundCollection.rangeTransactions = ZERO_INT;
    bundlesWithRefundCollection.topBid = ZERO;
    bundlesWithRefundCollection.save();
    snap.bundlesWithRefundCollection = bundlesWithRefundCollection.id;

    let fastBidsCollection = new Collection(`${id}-fastBids`);
    fastBidsCollection.timestamp = ZERO_INT;
    fastBidsCollection.rangeVolume = ZERO;
    fastBidsCollection.rangeTransactions = ZERO_INT;
    fastBidsCollection.topBid = ZERO;
    fastBidsCollection.save();
    snap.fastBidsCollection = fastBidsCollection.id;

    snap.save();
  }
  return snap;
}
