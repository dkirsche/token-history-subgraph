import { UpdateLiquidityLimit } from "../../generated/Curve_aave_gauge/CurveAaveGaugeContract";
import { CurveAaveContract } from "../../generated/Curve_aave/CurveAaveContract";
import { CurveAaveGaugeContract } from "../../generated/Curve_aave_gauge/CurveAaveGaugeContract";
import { CurveRewardsOnlyGauge } from "../../generated/Curve_aave_gauge_matic/CurveRewardsOnlyGauge";
import { Deposit } from "../../generated/Curve_aave_gauge_matic/CurveRewardsOnlyGauge";
import { CurveGaugeController } from "../../generated/Curve_aave_gauge/CurveGaugeController";
import { Asset, RewardHistoryDaily, RewardOther } from "../../generated/schema";
import { roundToDay } from "../utils/helpers";
import { BigDecimal, BigInt, Address, Bytes,log } from "@graphprotocol/graph-ts";

export function handleCurveAaveGaugeUpdate_matic(event: Deposit): void {
  let vault = Address.fromString("0x445FE580eF8d70FF569aB36e80c647af338db351"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic
  log.info('handleCurveAaveGaugeUpdate_matic was executed',[])
//if rewards contract is not 0 then load the rewards gaugeContract
//save that to additional rewards entity
  createOtherRewardHistory(event,vault,rewardToken)
}
export function handleCurveAaveGaugeUpdate(event: UpdateLiquidityLimit): void {
  let vault = Address.fromString("0xDeBF20617708857ebe4F679508E7b7863a8A8EeE"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic

  createRewardHistory(event,vault,rewardToken)
}

export function handleCurveYGaugeUpdate(event: UpdateLiquidityLimit): void {
  let vault = Address.fromString("0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic

  createRewardHistory(event,vault,rewardToken)
}
export function handleCurve3PoolGaugeUpdate(event: UpdateLiquidityLimit): void {
  let vault = Address.fromString("0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic

  createRewardHistory(event,vault,rewardToken)
}
export function handleCurveCompoundGaugeUpdate(event: UpdateLiquidityLimit): void {
  let vault = Address.fromString("0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic

  createRewardHistory(event,vault,rewardToken)
}
export function handleCurveUSDPGaugeUpdate(event: UpdateLiquidityLimit): void {
  let vault = Address.fromString("0x42d7025938bEc20B69cBae5A77421082407f053A"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic

  createRewardHistory(event,vault,rewardToken)
}
export function handleCurveSUSDGaugeUpdate(event: UpdateLiquidityLimit): void {
  let vault = Address.fromString("0xA5407eAE9Ba41422680e2e00537571bcC53efBfD"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic

  createRewardHistory(event,vault,rewardToken)
}
export function handleCurveRenGaugeUpdate(event: UpdateLiquidityLimit): void {
  let vault = Address.fromString("0x93054188d876f558f4a66B2EF1d97d16eDf0895B"); //address of vault that uses this guage
  let rewardToken = "CRV" //this will need to be updated to be dynamic

  createRewardHistory(event,vault,rewardToken)
}

function createRewardHistory(event: UpdateLiquidityLimit, vaultID: Address, rewardToken: String): RewardHistoryDaily {
  let gaugeAddress = event.address;
  let workingSupply = event.params.working_supply
  let timestamp = event.block.timestamp
  let txnHash=event.transaction.hash
  let gaugeControllerAddress = Address.fromString("0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"); //global gauge controller. should update this to lookup via address registry

  let gaugeContract = CurveAaveGaugeContract.bind(gaugeAddress);
  let gaugeController = CurveGaugeController.bind(gaugeControllerAddress);

  let adjustedTimestamp = roundToDay(timestamp)
  let rewardHistoryID = adjustedTimestamp.toString() + gaugeAddress.toHexString();
  let dailyReward = RewardHistoryDaily.load(rewardHistoryID);
  if (dailyReward != null) {
    log.info('Duplicate - txnHash:{} ,timeStamp:{}, rewardHistoryID:{}', [
      txnHash.toHexString(),
      timestamp.toString(),
      rewardHistoryID,
    ])
    return dailyReward as RewardHistoryDaily;
  }

  let relative_weight = gaugeController.gauge_relative_weight(gaugeAddress);
  let gaugeDailyReward= gaugeContract.inflation_rate() * BigInt.fromI32(86400) * relative_weight //inflation rate is per second convert to day

  dailyReward = new RewardHistoryDaily(rewardHistoryID);
  dailyReward.asset = vaultID.toHexString();
  dailyReward.gaugeId = gaugeAddress;
  dailyReward.rewardPerShareBoosted = new BigDecimal(gaugeDailyReward) / new BigDecimal(workingSupply)
  dailyReward.rewardPerShareNotBoosted = new BigDecimal(gaugeDailyReward) / new BigDecimal(workingSupply) / BigDecimal.fromString("2.5")
  dailyReward.workingSupply = workingSupply
  dailyReward.reward = gaugeDailyReward
  dailyReward.rewardToken = rewardToken
  dailyReward.rewardTokenID = gaugeContract.crv_token().toHexString()
  dailyReward.timestamp = adjustedTimestamp;
  dailyReward.txnHash = txnHash;

  dailyReward.save();

  return dailyReward as RewardHistoryDaily;
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
