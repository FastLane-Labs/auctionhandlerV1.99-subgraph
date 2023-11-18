import {
  CustomPaymentProcessorPaid as CustomPaymentProcessorPaidEvent,
  RelayFastBid as RelayFastBidEvent,
  RelayFeeCollected as RelayFeeCollectedEvent,
  RelayFlashBid as RelayFlashBidEvent,
  RelayFlashBidWithRefund as RelayFlashBidWithRefundEvent,
  RelayInvestigateOutcome as RelayInvestigateOutcomeEvent,
  RelayProcessingPaidValidator as RelayProcessingPaidValidatorEvent,
  RelaySimulatedFlashBid as RelaySimulatedFlashBidEvent,
  RelayValidatorPayeeUpdated as RelayValidatorPayeeUpdatedEvent,
  RelayWithdrawStuckERC20 as RelayWithdrawStuckERC20Event,
  RelayWithdrawStuckNativeToken as RelayWithdrawStuckNativeTokenEvent
} from "../generated/FastLaneAuctionHandler/FastLaneAuctionHandler"
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
} from "../generated/schema"

export function handleCustomPaymentProcessorPaid(
  event: CustomPaymentProcessorPaidEvent
): void {
  let entity = new CustomPaymentProcessorPaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.payor = event.params.payor
  entity.payee = event.params.payee
  entity.paymentProcessor = event.params.paymentProcessor
  entity.totalAmount = event.params.totalAmount
  entity.startBlock = event.params.startBlock
  entity.endBlock = event.params.endBlock

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayFastBid(event: RelayFastBidEvent): void {
  let entity = new RelayFastBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.validator = event.params.validator
  entity.success = event.params.success
  entity.bidAmount = event.params.bidAmount
  entity.searcherContractAddress = event.params.searcherContractAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayFeeCollected(event: RelayFeeCollectedEvent): void {
  let entity = new RelayFeeCollected(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.payor = event.params.payor
  entity.payee = event.params.payee
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayFlashBid(event: RelayFlashBidEvent): void {
  let entity = new RelayFlashBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.oppTxHash = event.params.oppTxHash
  entity.validator = event.params.validator
  entity.bidAmount = event.params.bidAmount
  entity.amountPaid = event.params.amountPaid
  entity.searcherContractAddress = event.params.searcherContractAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayFlashBidWithRefund(
  event: RelayFlashBidWithRefundEvent
): void {
  let entity = new RelayFlashBidWithRefund(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.oppTxHash = event.params.oppTxHash
  entity.validator = event.params.validator
  entity.bidAmount = event.params.bidAmount
  entity.amountPaid = event.params.amountPaid
  entity.searcherContractAddress = event.params.searcherContractAddress
  entity.refundedAmount = event.params.refundedAmount
  entity.refundAddress = event.params.refundAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayInvestigateOutcome(
  event: RelayInvestigateOutcomeEvent
): void {
  let entity = new RelayInvestigateOutcome(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.validator = event.params.validator
  entity.sender = event.params.sender
  entity.blockNumber = event.params.blockNumber
  entity.existingBidAmount = event.params.existingBidAmount
  entity.newBidAmount = event.params.newBidAmount
  entity.existingGasPrice = event.params.existingGasPrice
  entity.newGasPrice = event.params.newGasPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayProcessingPaidValidator(
  event: RelayProcessingPaidValidatorEvent
): void {
  let entity = new RelayProcessingPaidValidator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.validator = event.params.validator
  entity.validatorPayment = event.params.validatorPayment
  entity.initiator = event.params.initiator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelaySimulatedFlashBid(
  event: RelaySimulatedFlashBidEvent
): void {
  let entity = new RelaySimulatedFlashBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.amount = event.params.amount
  entity.oppTxHash = event.params.oppTxHash
  entity.validator = event.params.validator
  entity.searcherContractAddress = event.params.searcherContractAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayValidatorPayeeUpdated(
  event: RelayValidatorPayeeUpdatedEvent
): void {
  let entity = new RelayValidatorPayeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.validator = event.params.validator
  entity.payee = event.params.payee
  entity.initiator = event.params.initiator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayWithdrawStuckERC20(
  event: RelayWithdrawStuckERC20Event
): void {
  let entity = new RelayWithdrawStuckERC20(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.receiver = event.params.receiver
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRelayWithdrawStuckNativeToken(
  event: RelayWithdrawStuckNativeTokenEvent
): void {
  let entity = new RelayWithdrawStuckNativeToken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.receiver = event.params.receiver
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
