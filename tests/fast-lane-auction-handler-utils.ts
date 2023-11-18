import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  CustomPaymentProcessorPaid,
  RelayFastBid,
  RelayFeeCollected,
  RelayFlashBid,
  RelayFlashBidWithRefund,
  RelayInvestigateOutcome,
  RelayProcessingPaidValidator,
  RelaySimulatedFlashBid,
  RelayValidatorPayeeUpdated,
  RelayWithdrawStuckERC20,
  RelayWithdrawStuckNativeToken
} from "../generated/FastLaneAuctionHandler/FastLaneAuctionHandler"

export function createCustomPaymentProcessorPaidEvent(
  payor: Address,
  payee: Address,
  paymentProcessor: Address,
  totalAmount: BigInt,
  startBlock: BigInt,
  endBlock: BigInt
): CustomPaymentProcessorPaid {
  let customPaymentProcessorPaidEvent = changetype<CustomPaymentProcessorPaid>(
    newMockEvent()
  )

  customPaymentProcessorPaidEvent.parameters = new Array()

  customPaymentProcessorPaidEvent.parameters.push(
    new ethereum.EventParam("payor", ethereum.Value.fromAddress(payor))
  )
  customPaymentProcessorPaidEvent.parameters.push(
    new ethereum.EventParam("payee", ethereum.Value.fromAddress(payee))
  )
  customPaymentProcessorPaidEvent.parameters.push(
    new ethereum.EventParam(
      "paymentProcessor",
      ethereum.Value.fromAddress(paymentProcessor)
    )
  )
  customPaymentProcessorPaidEvent.parameters.push(
    new ethereum.EventParam(
      "totalAmount",
      ethereum.Value.fromUnsignedBigInt(totalAmount)
    )
  )
  customPaymentProcessorPaidEvent.parameters.push(
    new ethereum.EventParam(
      "startBlock",
      ethereum.Value.fromUnsignedBigInt(startBlock)
    )
  )
  customPaymentProcessorPaidEvent.parameters.push(
    new ethereum.EventParam(
      "endBlock",
      ethereum.Value.fromUnsignedBigInt(endBlock)
    )
  )

  return customPaymentProcessorPaidEvent
}

export function createRelayFastBidEvent(
  sender: Address,
  validator: Address,
  success: boolean,
  bidAmount: BigInt,
  searcherContractAddress: Address
): RelayFastBid {
  let relayFastBidEvent = changetype<RelayFastBid>(newMockEvent())

  relayFastBidEvent.parameters = new Array()

  relayFastBidEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  relayFastBidEvent.parameters.push(
    new ethereum.EventParam("validator", ethereum.Value.fromAddress(validator))
  )
  relayFastBidEvent.parameters.push(
    new ethereum.EventParam("success", ethereum.Value.fromBoolean(success))
  )
  relayFastBidEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )
  relayFastBidEvent.parameters.push(
    new ethereum.EventParam(
      "searcherContractAddress",
      ethereum.Value.fromAddress(searcherContractAddress)
    )
  )

  return relayFastBidEvent
}

export function createRelayFeeCollectedEvent(
  payor: Address,
  payee: Address,
  amount: BigInt
): RelayFeeCollected {
  let relayFeeCollectedEvent = changetype<RelayFeeCollected>(newMockEvent())

  relayFeeCollectedEvent.parameters = new Array()

  relayFeeCollectedEvent.parameters.push(
    new ethereum.EventParam("payor", ethereum.Value.fromAddress(payor))
  )
  relayFeeCollectedEvent.parameters.push(
    new ethereum.EventParam("payee", ethereum.Value.fromAddress(payee))
  )
  relayFeeCollectedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return relayFeeCollectedEvent
}

export function createRelayFlashBidEvent(
  sender: Address,
  oppTxHash: Bytes,
  validator: Address,
  bidAmount: BigInt,
  amountPaid: BigInt,
  searcherContractAddress: Address
): RelayFlashBid {
  let relayFlashBidEvent = changetype<RelayFlashBid>(newMockEvent())

  relayFlashBidEvent.parameters = new Array()

  relayFlashBidEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  relayFlashBidEvent.parameters.push(
    new ethereum.EventParam(
      "oppTxHash",
      ethereum.Value.fromFixedBytes(oppTxHash)
    )
  )
  relayFlashBidEvent.parameters.push(
    new ethereum.EventParam("validator", ethereum.Value.fromAddress(validator))
  )
  relayFlashBidEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )
  relayFlashBidEvent.parameters.push(
    new ethereum.EventParam(
      "amountPaid",
      ethereum.Value.fromUnsignedBigInt(amountPaid)
    )
  )
  relayFlashBidEvent.parameters.push(
    new ethereum.EventParam(
      "searcherContractAddress",
      ethereum.Value.fromAddress(searcherContractAddress)
    )
  )

  return relayFlashBidEvent
}

export function createRelayFlashBidWithRefundEvent(
  sender: Address,
  oppTxHash: Bytes,
  validator: Address,
  bidAmount: BigInt,
  amountPaid: BigInt,
  searcherContractAddress: Address,
  refundedAmount: BigInt,
  refundAddress: Address
): RelayFlashBidWithRefund {
  let relayFlashBidWithRefundEvent = changetype<RelayFlashBidWithRefund>(
    newMockEvent()
  )

  relayFlashBidWithRefundEvent.parameters = new Array()

  relayFlashBidWithRefundEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  relayFlashBidWithRefundEvent.parameters.push(
    new ethereum.EventParam(
      "oppTxHash",
      ethereum.Value.fromFixedBytes(oppTxHash)
    )
  )
  relayFlashBidWithRefundEvent.parameters.push(
    new ethereum.EventParam("validator", ethereum.Value.fromAddress(validator))
  )
  relayFlashBidWithRefundEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )
  relayFlashBidWithRefundEvent.parameters.push(
    new ethereum.EventParam(
      "amountPaid",
      ethereum.Value.fromUnsignedBigInt(amountPaid)
    )
  )
  relayFlashBidWithRefundEvent.parameters.push(
    new ethereum.EventParam(
      "searcherContractAddress",
      ethereum.Value.fromAddress(searcherContractAddress)
    )
  )
  relayFlashBidWithRefundEvent.parameters.push(
    new ethereum.EventParam(
      "refundedAmount",
      ethereum.Value.fromUnsignedBigInt(refundedAmount)
    )
  )
  relayFlashBidWithRefundEvent.parameters.push(
    new ethereum.EventParam(
      "refundAddress",
      ethereum.Value.fromAddress(refundAddress)
    )
  )

  return relayFlashBidWithRefundEvent
}

export function createRelayInvestigateOutcomeEvent(
  validator: Address,
  sender: Address,
  blockNumber: BigInt,
  existingBidAmount: BigInt,
  newBidAmount: BigInt,
  existingGasPrice: BigInt,
  newGasPrice: BigInt
): RelayInvestigateOutcome {
  let relayInvestigateOutcomeEvent = changetype<RelayInvestigateOutcome>(
    newMockEvent()
  )

  relayInvestigateOutcomeEvent.parameters = new Array()

  relayInvestigateOutcomeEvent.parameters.push(
    new ethereum.EventParam("validator", ethereum.Value.fromAddress(validator))
  )
  relayInvestigateOutcomeEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  relayInvestigateOutcomeEvent.parameters.push(
    new ethereum.EventParam(
      "blockNumber",
      ethereum.Value.fromUnsignedBigInt(blockNumber)
    )
  )
  relayInvestigateOutcomeEvent.parameters.push(
    new ethereum.EventParam(
      "existingBidAmount",
      ethereum.Value.fromUnsignedBigInt(existingBidAmount)
    )
  )
  relayInvestigateOutcomeEvent.parameters.push(
    new ethereum.EventParam(
      "newBidAmount",
      ethereum.Value.fromUnsignedBigInt(newBidAmount)
    )
  )
  relayInvestigateOutcomeEvent.parameters.push(
    new ethereum.EventParam(
      "existingGasPrice",
      ethereum.Value.fromUnsignedBigInt(existingGasPrice)
    )
  )
  relayInvestigateOutcomeEvent.parameters.push(
    new ethereum.EventParam(
      "newGasPrice",
      ethereum.Value.fromUnsignedBigInt(newGasPrice)
    )
  )

  return relayInvestigateOutcomeEvent
}

export function createRelayProcessingPaidValidatorEvent(
  validator: Address,
  validatorPayment: BigInt,
  initiator: Address
): RelayProcessingPaidValidator {
  let relayProcessingPaidValidatorEvent = changetype<
    RelayProcessingPaidValidator
  >(newMockEvent())

  relayProcessingPaidValidatorEvent.parameters = new Array()

  relayProcessingPaidValidatorEvent.parameters.push(
    new ethereum.EventParam("validator", ethereum.Value.fromAddress(validator))
  )
  relayProcessingPaidValidatorEvent.parameters.push(
    new ethereum.EventParam(
      "validatorPayment",
      ethereum.Value.fromUnsignedBigInt(validatorPayment)
    )
  )
  relayProcessingPaidValidatorEvent.parameters.push(
    new ethereum.EventParam("initiator", ethereum.Value.fromAddress(initiator))
  )

  return relayProcessingPaidValidatorEvent
}

export function createRelaySimulatedFlashBidEvent(
  sender: Address,
  amount: BigInt,
  oppTxHash: Bytes,
  validator: Address,
  searcherContractAddress: Address
): RelaySimulatedFlashBid {
  let relaySimulatedFlashBidEvent = changetype<RelaySimulatedFlashBid>(
    newMockEvent()
  )

  relaySimulatedFlashBidEvent.parameters = new Array()

  relaySimulatedFlashBidEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  relaySimulatedFlashBidEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  relaySimulatedFlashBidEvent.parameters.push(
    new ethereum.EventParam(
      "oppTxHash",
      ethereum.Value.fromFixedBytes(oppTxHash)
    )
  )
  relaySimulatedFlashBidEvent.parameters.push(
    new ethereum.EventParam("validator", ethereum.Value.fromAddress(validator))
  )
  relaySimulatedFlashBidEvent.parameters.push(
    new ethereum.EventParam(
      "searcherContractAddress",
      ethereum.Value.fromAddress(searcherContractAddress)
    )
  )

  return relaySimulatedFlashBidEvent
}

export function createRelayValidatorPayeeUpdatedEvent(
  validator: Address,
  payee: Address,
  initiator: Address
): RelayValidatorPayeeUpdated {
  let relayValidatorPayeeUpdatedEvent = changetype<RelayValidatorPayeeUpdated>(
    newMockEvent()
  )

  relayValidatorPayeeUpdatedEvent.parameters = new Array()

  relayValidatorPayeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("validator", ethereum.Value.fromAddress(validator))
  )
  relayValidatorPayeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("payee", ethereum.Value.fromAddress(payee))
  )
  relayValidatorPayeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("initiator", ethereum.Value.fromAddress(initiator))
  )

  return relayValidatorPayeeUpdatedEvent
}

export function createRelayWithdrawStuckERC20Event(
  receiver: Address,
  token: Address,
  amount: BigInt
): RelayWithdrawStuckERC20 {
  let relayWithdrawStuckErc20Event = changetype<RelayWithdrawStuckERC20>(
    newMockEvent()
  )

  relayWithdrawStuckErc20Event.parameters = new Array()

  relayWithdrawStuckErc20Event.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  relayWithdrawStuckErc20Event.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  relayWithdrawStuckErc20Event.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return relayWithdrawStuckErc20Event
}

export function createRelayWithdrawStuckNativeTokenEvent(
  receiver: Address,
  amount: BigInt
): RelayWithdrawStuckNativeToken {
  let relayWithdrawStuckNativeTokenEvent = changetype<
    RelayWithdrawStuckNativeToken
  >(newMockEvent())

  relayWithdrawStuckNativeTokenEvent.parameters = new Array()

  relayWithdrawStuckNativeTokenEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  relayWithdrawStuckNativeTokenEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return relayWithdrawStuckNativeTokenEvent
}
