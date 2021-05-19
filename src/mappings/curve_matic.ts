
import { RemoveLiquidity }   from "../../generated/Curve_aave/CurveAaveContract";
import { createPriceHistory } from "../utils/helpers"
import { CurveAaveContract } from "../../generated/Curve_aave/CurveAaveContract";

import { CurveRewardsOnlyGauge } from "../../generated/Curve_aave_gauge_matic/CurveRewardsOnlyGauge";
import { Deposit } from "../../generated/Curve_aave_gauge_matic/CurveRewardsOnlyGauge";
import { RewardOther } from "../../generated/schema";
import { roundToDay } from "../utils/helpers";
import { BigInt, Address,log } from "@graphprotocol/graph-ts";

export function handleCurveAaveTransfer_matic(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveAaveContract.bind(vaultAddress);
  let vaultName     = "curve_aave_matic";

  createPriceHistory(
    vaultAddress,
    vaultName,
    event.params.token_supply,
    vaultContract.get_virtual_price(),
    event.block.timestamp,
    event.transaction.hash
  )
}

export function handleCurveAaveGaugeUpdate_matic(event: Deposit): void {
  let vault = Address.fromString("0x445FE580eF8d70FF569aB36e80c647af338db351"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic
  log.info('handleCurveAaveGaugeUpdate_matic was executed',[])
//if rewards contract is not 0 then load the rewards gaugeContract
//save that to additional rewards entity
  createOtherRewardHistory(event,vault,rewardToken)
}
function createOtherRewardHistory(event: Deposit, vaultID: Address, rewardToken: String): RewardOther {
  let gaugeAddress = event.address;
  let timestamp = event.block.timestamp
  let txnHash=event.transaction.hash
  let gaugeContract = CurveRewardsOnlyGauge.bind(gaugeAddress);

  let adjustedTimestamp = roundToDay(timestamp)
  let dailyID = adjustedTimestamp.toString() + gaugeAddress.toHexString();
  let additionalReward = RewardOther.load(dailyID);
  if (additionalReward != null) {
    log.info('Duplicate_RewardOther - txnHash:{} ,timeStamp:{}', [
      txnHash.toHexString(),
      adjustedTimestamp.toString(),
    ])
    return additionalReward as RewardOther;
  }
  log.info('New_RewardOther - txnHash:{} ,timeStamp:{}', [
    txnHash.toHexString(),
    timestamp.toString(),
  ])
  additionalReward = new RewardOther(dailyID);
  additionalReward.asset = vaultID.toHexString();
  additionalReward.gaugeId = gaugeAddress;
  additionalReward.rewardIntegral = gaugeContract.reward_integral(gaugeContract.reward_tokens(BigInt.fromI32(0)))
  additionalReward.totalSupply = gaugeContract.totalSupply()
  additionalReward.rewardContract = gaugeContract.reward_contract().toHexString()
  additionalReward.reward = gaugeContract.reward_balances(gaugeContract.reward_tokens(BigInt.fromI32(0)))
  additionalReward.rewardTokenID = gaugeContract.reward_tokens(BigInt.fromI32(0)).toHexString()
  additionalReward.timestamp = adjustedTimestamp;
  additionalReward.txnHash = txnHash;

  additionalReward.save();

  return additionalReward as RewardOther;
}
