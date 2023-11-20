import {
  Bytes,
  TypedMap,
  JSONValue,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO_STR = "0x0000000000000000000000000000000000000000";

export const ADDRESS_ZERO = Bytes.fromHexString(ADDRESS_ZERO_STR);

export const ZERO = BigInt.fromI32(0);
export const ZERO_INT = 0;
export const ONE = BigInt.fromI32(1);
export const NEG_ONE = BigInt.fromI32(-1);
export const ZERO_BIG_DEC = BigDecimal.zero();

export const HOURLY = "HOURLY";
export const DAILY = "DAILY";
export const WEEKLY = "WEEKLY";

export const HOURLY_VAL = 3600;
export const DAILY_VAL = HOURLY_VAL * 24;
export const WEEKLY_VAL = DAILY_VAL * 7;

export const BUNDLES = "bundles";
export const BUNDLES_WITH_REFUND = "bundlesWithRefund";
export const FAST_BIDS = "fastBids";

export const STATS_ID = Bytes.fromUTF8("MainStats");

export function getStringValue(
  obj: TypedMap<string, JSONValue>,
  key: string
): string {
  if (obj.isSet(key)) {
    const val = obj.get(key);
    if (val && !val.isNull()) {
      return val.toString();
    }
  }
  return "";
}

export function getBigIntValue(
  obj: TypedMap<string, JSONValue>,
  key: string
): BigInt {
  if (obj.isSet(key)) {
    const val = obj.get(key);
    if (val && !val.isNull()) {
      return val.toBigInt();
    }
  }
  return ZERO;
}
