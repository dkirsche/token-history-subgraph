import { UpdateLiquidityLimit } from "../../generated/Curve_aave_gauge/CurveAaveGaugeContract";
import { CurveAaveContract } from "../../generated/Curve_aave/CurveAaveContract";
import { CurveAaveGaugeContract } from "../../generated/Curve_aave_gauge/CurveAaveGaugeContract";
import { CurveGaugeController } from "../../generated/Curve_aave_gauge/CurveGaugeController";
import { Asset, RewardHistoryDaily } from "../../generated/schema";
import { roundToDay } from "../utils/helpers";
import { BigDecimal, BigInt, Address, Bytes,log } from "@graphprotocol/graph-ts";


export function handleCurveAaveGaugeUpdate(event: UpdateLiquidityLimit): void {
  let gaugeAddress = event.address;
  let gaugeController = Address.fromString("0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB")
  let asset = "0xDeBF20617708857ebe4F679508E7b7863a8A8EeE";
  let rewardToken = "CRV" //this will need to be updated to be dynamic
  let workingSupply = event.params.working_supply

  let timestamp = event.block.timestamp
  let txnHash=event.transaction.hash

  createRewardHistory(asset,gaugeAddress,gaugeController,rewardToken,workingSupply,timestamp,txnHash)
}

function createRewardHistory(vaultID: String, gaugeAddress: Address, gaugeControllerAddress: Address, rewardToken: String, workingSupply:BigInt, timestamp: BigInt, txnHash: Bytes): RewardHistoryDaily {
  let gaugeContract = CurveAaveGaugeContract.bind(gaugeAddress);
  let gaugeController = CurveGaugeController.bind(gaugeControllerAddress);

  let adjustedTimestamp = roundToDay(timestamp)
  let rewardHistoryID = adjustedTimestamp.toString() + gaugeContract.name();
  let dailyReward = RewardHistoryDaily.load(rewardHistoryID);
  if (dailyReward != null) {
    log.info('Duplicate - txnHash:{} ,timeStamp:{}, calculatedTimestamp:{}', [
      txnHash.toHexString(),
      timestamp.toString(),
      rewardHistoryID,
    ])
    return dailyReward as RewardHistoryDaily;
  }

  let relative_weight = gaugeController.gauge_relative_weight(gaugeAddress);
  let gaugeDailyReward= gaugeContract.inflation_rate() * BigInt.fromI32(86400) * relative_weight //inflation rate is per second convert to day

  dailyReward = new RewardHistoryDaily(rewardHistoryID);
  dailyReward.asset = vaultID;
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
