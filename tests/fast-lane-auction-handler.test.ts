import { assert, describe, test, clearStore, beforeAll, afterAll, afterEach } from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { STATS_ID } from "../src/helpers/common";
import {
  handleRelayFlashBid,
  handleRelayFlashBidWithRefund,
  handleRelayFastBid
} from "../src/fast-lane-auction-handler";
import {
  createRelayFlashBidEvent,
  createRelayFlashBidWithRefundEvent,
  createRelayFastBidEvent
} from "./fast-lane-auction-handler-utils";

const ADDRESS_0 = Address.fromString("0x0000000000000000000000000000000000000000");
const ADDRESS_1 = Address.fromString("0x0000000000000000000000000000000000000001");
const ADDRESS_2 = Address.fromString("0x0000000000000000000000000000000000000002");
const ADDRESS_3 = Address.fromString("0x0000000000000000000000000000000000000003");

const HASH_0 = Bytes.fromHexString("0x00");

let _STATS_ID = STATS_ID.toHexString();

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  afterEach(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  // **************************************************
  // FlashBid
  // **************************************************
  test("createRelayFlashBidEvent created and stored", () => {
    let newRelayFlashBidEvent = createRelayFlashBidEvent(
      ADDRESS_0,
      HASH_0,
      ADDRESS_1,
      BigInt.fromI32(100),
      BigInt.fromI32(100),
      ADDRESS_2
    );
    handleRelayFlashBid(newRelayFlashBidEvent);

    // Event
    let entityId = newRelayFlashBidEvent.transaction.hash
      .concatI32(newRelayFlashBidEvent.logIndex.toI32())
      .toHexString();
    assert.entityCount("RelayFlashBid", 1);
    assert.fieldEquals("RelayFlashBid", entityId, "sender", ADDRESS_0.toHexString());
    assert.fieldEquals("RelayFlashBid", entityId, "oppTxHash", HASH_0.toHexString());
    assert.fieldEquals("RelayFlashBid", entityId, "validator", ADDRESS_1.toHexString());
    assert.fieldEquals("RelayFlashBid", entityId, "bidAmount", "100");
    assert.fieldEquals("RelayFlashBid", entityId, "amountPaid", "100");
    assert.fieldEquals("RelayFlashBid", entityId, "searcherContractAddress", ADDRESS_2.toHexString());

    // Searcher
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "bundlesLanded", "1");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "bundlesWithRefundLanded", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "fastBidsLanded", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalTipped", "100");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalBundlesTipped", "100");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalBundlesWithRefundTipped", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalFastBidsTipped", "0");
    assert.fieldEquals(
      "Searcher",
      ADDRESS_0.toHexString(),
      "lastBundleLandedTimestamp",
      newRelayFlashBidEvent.block.timestamp.toI32().toString()
    );
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "lastBundleWithRefundLandedTimestamp", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "lastFastBidLandedTimestamp", "0");

    // Validator
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalTips", "100");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalBundlesTips", "100");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalBundlesWithRefundTips", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalFastBidsTips", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedBundlesCount", "1");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedBundlesWithRefundCount", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedFastBidsCount", "0");
    assert.fieldEquals(
      "Validator",
      ADDRESS_1.toHexString(),
      "lastBundleReceivedTimestamp",
      newRelayFlashBidEvent.block.timestamp.toI32().toString()
    );
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "lastBundleWithRefundReceivedTimestamp", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "lastFastBidReceivedTimestamp", "0");

    // Global
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedBundlesCount", "1");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedBundlesWithRefundCount", "0");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedFastBidsCount", "0");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalValidatorsPaid", "100");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalUniqueSearchers", "1");
  });

  // **************************************************
  // FlashBidWithRefund
  // **************************************************
  test("createRelayFlashBidWithRefundEvent created and stored", () => {
    let newRelayFlashBidWithRefundEvent = createRelayFlashBidWithRefundEvent(
      ADDRESS_0,
      HASH_0,
      ADDRESS_1,
      BigInt.fromI32(150),
      BigInt.fromI32(150),
      ADDRESS_2,
      BigInt.fromI32(10),
      ADDRESS_3
    );
    handleRelayFlashBidWithRefund(newRelayFlashBidWithRefundEvent);

    // Entity
    let entityId = newRelayFlashBidWithRefundEvent.transaction.hash
      .concatI32(newRelayFlashBidWithRefundEvent.logIndex.toI32())
      .toHexString();
    assert.entityCount("RelayFlashBidWithRefund", 1);
    assert.fieldEquals("RelayFlashBidWithRefund", entityId, "sender", ADDRESS_0.toHexString());
    assert.fieldEquals("RelayFlashBidWithRefund", entityId, "oppTxHash", HASH_0.toHexString());
    assert.fieldEquals("RelayFlashBidWithRefund", entityId, "validator", ADDRESS_1.toHexString());
    assert.fieldEquals("RelayFlashBidWithRefund", entityId, "bidAmount", "150");
    assert.fieldEquals("RelayFlashBidWithRefund", entityId, "amountPaid", "150");
    assert.fieldEquals("RelayFlashBidWithRefund", entityId, "searcherContractAddress", ADDRESS_2.toHexString());
    assert.fieldEquals("RelayFlashBidWithRefund", entityId, "refundedAmount", "10");
    assert.fieldEquals("RelayFlashBidWithRefund", entityId, "refundAddress", ADDRESS_3.toHexString());

    // Searcher
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "bundlesLanded", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "bundlesWithRefundLanded", "1");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "fastBidsLanded", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalTipped", "150");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalBundlesTipped", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalBundlesWithRefundTipped", "150");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalFastBidsTipped", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "lastBundleLandedTimestamp", "0");
    assert.fieldEquals(
      "Searcher",
      ADDRESS_0.toHexString(),
      "lastBundleWithRefundLandedTimestamp",
      newRelayFlashBidWithRefundEvent.block.timestamp.toI32().toString()
    );
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "lastFastBidLandedTimestamp", "0");

    // Validator
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalTips", "140"); // bidAmount - refundedAmount
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalBundlesTips", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalBundlesWithRefundTips", "140"); // bidAmount - refundedAmount
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalFastBidsTips", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedBundlesCount", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedBundlesWithRefundCount", "1");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedFastBidsCount", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "lastBundleReceivedTimestamp", "0");
    assert.fieldEquals(
      "Validator",
      ADDRESS_1.toHexString(),
      "lastBundleWithRefundReceivedTimestamp",
      newRelayFlashBidWithRefundEvent.block.timestamp.toI32().toString()
    );
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "lastFastBidReceivedTimestamp", "0");

    // Global
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedBundlesCount", "0");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedBundlesWithRefundCount", "1");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedFastBidsCount", "0");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalValidatorsPaid", "140");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalUniqueSearchers", "1");
  });

  // **************************************************
  // FastBid
  // **************************************************
  test("createRelayFastBidEvent created and stored", () => {
    let newRelayFastBidEvent = createRelayFastBidEvent(ADDRESS_0, ADDRESS_1, true, BigInt.fromI32(200), ADDRESS_2);
    handleRelayFastBid(newRelayFastBidEvent);

    // Entity
    let entityId = newRelayFastBidEvent.transaction.hash.concatI32(newRelayFastBidEvent.logIndex.toI32()).toHexString();
    assert.entityCount("RelayFastBid", 1);
    assert.fieldEquals("RelayFastBid", entityId, "sender", ADDRESS_0.toHexString());
    assert.fieldEquals("RelayFastBid", entityId, "validator", ADDRESS_1.toHexString());
    assert.fieldEquals("RelayFastBid", entityId, "success", "true");
    assert.fieldEquals("RelayFastBid", entityId, "bidAmount", "200");
    assert.fieldEquals("RelayFastBid", entityId, "searcherContractAddress", ADDRESS_2.toHexString());

    // Searcher
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "bundlesLanded", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "bundlesWithRefundLanded", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "fastBidsLanded", "1");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalTipped", "200");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalBundlesTipped", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalBundlesWithRefundTipped", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "totalFastBidsTipped", "200");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "lastBundleLandedTimestamp", "0");
    assert.fieldEquals("Searcher", ADDRESS_0.toHexString(), "lastBundleWithRefundLandedTimestamp", "0");
    assert.fieldEquals(
      "Searcher",
      ADDRESS_0.toHexString(),
      "lastFastBidLandedTimestamp",
      newRelayFastBidEvent.block.timestamp.toI32().toString()
    );

    // Validator
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalTips", "200");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalBundlesTips", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalBundlesWithRefundTips", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalFastBidsTips", "200");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedBundlesCount", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedBundlesWithRefundCount", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "totalExecutedFastBidsCount", "1");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "lastBundleReceivedTimestamp", "0");
    assert.fieldEquals("Validator", ADDRESS_1.toHexString(), "lastBundleWithRefundReceivedTimestamp", "0");
    assert.fieldEquals(
      "Validator",
      ADDRESS_1.toHexString(),
      "lastFastBidReceivedTimestamp",
      newRelayFastBidEvent.block.timestamp.toI32().toString()
    );

    // Global
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedBundlesCount", "0");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedBundlesWithRefundCount", "0");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalExecutedFastBidsCount", "1");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalValidatorsPaid", "200");
    assert.fieldEquals("GlobalStat", _STATS_ID, "totalUniqueSearchers", "1");
  });
});
