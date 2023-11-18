import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { CustomPaymentProcessorPaid } from "../generated/schema"
import { CustomPaymentProcessorPaid as CustomPaymentProcessorPaidEvent } from "../generated/FastLaneAuctionHandler/FastLaneAuctionHandler"
import { handleCustomPaymentProcessorPaid } from "../src/fast-lane-auction-handler"
import { createCustomPaymentProcessorPaidEvent } from "./fast-lane-auction-handler-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let payor = Address.fromString("0x0000000000000000000000000000000000000001")
    let payee = Address.fromString("0x0000000000000000000000000000000000000001")
    let paymentProcessor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let totalAmount = BigInt.fromI32(234)
    let startBlock = BigInt.fromI32(234)
    let endBlock = BigInt.fromI32(234)
    let newCustomPaymentProcessorPaidEvent = createCustomPaymentProcessorPaidEvent(
      payor,
      payee,
      paymentProcessor,
      totalAmount,
      startBlock,
      endBlock
    )
    handleCustomPaymentProcessorPaid(newCustomPaymentProcessorPaidEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CustomPaymentProcessorPaid created and stored", () => {
    assert.entityCount("CustomPaymentProcessorPaid", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CustomPaymentProcessorPaid",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "payor",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CustomPaymentProcessorPaid",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "payee",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CustomPaymentProcessorPaid",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "paymentProcessor",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CustomPaymentProcessorPaid",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalAmount",
      "234"
    )
    assert.fieldEquals(
      "CustomPaymentProcessorPaid",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "startBlock",
      "234"
    )
    assert.fieldEquals(
      "CustomPaymentProcessorPaid",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "endBlock",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
