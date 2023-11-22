import { Bytes } from "@graphprotocol/graph-ts";
import { ZERO, ZERO_INT } from "./common";
import { Validator } from "../../generated/schema";

export function loadOrCreateValidator(validatorAddress: Bytes): Validator {
  let validator = Validator.load(validatorAddress);
  if (!validator) {
    validator = new Validator(validatorAddress);
    validator.address = validatorAddress;

    validator.totalTips = ZERO;

    validator.totalBundlesTips = ZERO;
    validator.totalBundlesWithRefundTips = ZERO;
    validator.totalFastBidsTips = ZERO;

    validator.totalExecutedBundlesCount = ZERO;
    validator.totalExecutedBundlesWithRefundCount = ZERO;
    validator.totalExecutedFastBidsCount = ZERO;

    validator.lastBundleReceivedTimestamp = ZERO_INT;
    validator.lastBundleWithRefundReceivedTimestamp = ZERO_INT;
    validator.lastFastBidReceivedTimestamp = ZERO_INT;

    validator.save();
  }
  return validator;
}
