import { Asset, PriceHistoryDaily } from "../../../../generated/schema";
import { Address, log } from "@graphprotocol/graph-ts";
import { BigDecimal, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";


export function getOrCreateVaultAsAsset(vaultAddress: Address, vaultName: String, totalSupply:BigInt): Asset {
  let vault = Asset.load(vaultAddress.toHexString());
  if (vault == null) {
    vault = new Asset(vaultAddress.toHexString());
    vault.name = vaultName;
  }
  vault.totalSupply = totalSupply;
  vault.save();
  return vault as Asset;
}
export function getOrCreatePriceHistory(vault: Asset, pricePerFullShare:BigInt, timestamp: BigInt, txnHash: Bytes): PriceHistoryDaily {
  let adjustedTimestamp = roundToDay(timestamp)
  let priceHistoryID = adjustedTimestamp.toString() + vault.name;
  let transfer = PriceHistoryDaily.load(priceHistoryID);
  if (transfer != null) {
    log.info('Duplicate - txnHash:{} ,timeStamp:{}, calculatedTimestamp:{}', [
      txnHash.toHexString(),
      timestamp.toString(),
      priceHistoryID,
    ])
  }
  if (transfer == null) {
    transfer = new PriceHistoryDaily(priceHistoryID);
    transfer.asset = vault.id;
    transfer.pricePerShare = pricePerFullShare;
    transfer.timestamp = adjustedTimestamp;
    transfer.txnHash = txnHash;

    transfer.save();
  }
  return transfer as PriceHistoryDaily;
}
export function createOtherRewardHistory(
  timestamp: BigInt,
  txnHash: Bytes,
  rewardAddress: Address,
  assetAddress: Address,
  rewards: BigInt,
  totalSupply: BigInt,
  rewardToken: Address
): RewardOther {


  let adjustedTimestamp = roundToDay(timestamp)
  let dailyID = adjustedTimestamp.toString() + rewardAddress.toHexString();
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
  additionalReward.asset = assetAddress.toHexString();
  additionalReward.gaugeId = rewardAddress;
  additionalReward.rewardIntegral = rewards
  additionalReward.totalSupply = totalSupply
  additionalReward.rewardTokenID = rewardToken.toHexString()
  additionalReward.timestamp = adjustedTimestamp;
  additionalReward.txnHash = txnHash;

  additionalReward.save();

  return additionalReward as RewardOther;
}

export function roundToDay(timeStamp:BigInt): BigInt {
    timeStamp -= timeStamp % BigInt.fromI32(24 * 60 * 60);//subtract amount of time since midnight
    return timeStamp;
}
