import { Bytes } from "@graphprotocol/graph-ts";
import { ZERO, ZERO_INT, STATS_ID } from "../common";
import { Collection, HourlyCollectionSnapshotGlobal, HourlyValidatorSnapshot } from "../../../generated/schema";

export function loadOrCreateHourlyCollectionSnapshotGlobal(id: string): HourlyCollectionSnapshotGlobal {
  let snap = HourlyCollectionSnapshotGlobal.load(id);
  if (!snap) {
    snap = new HourlyCollectionSnapshotGlobal(id);
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

export function loadOrCreateHourlyValidatorSnapshot(id: string, validatorAddress: Bytes): HourlyValidatorSnapshot {
  let snap = HourlyValidatorSnapshot.load(id);
  if (!snap) {
    snap = new HourlyValidatorSnapshot(id);
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
