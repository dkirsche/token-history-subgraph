import { Asset, PriceHistoryDaily } from "../../../../generated/schema";
import { V1Contract } from "../../../../generated/yBUSDVault/V1Contract";
import { Address, log } from "@graphprotocol/graph-ts";
import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { getOrCreateToken } from "./token";

export function getOrCreateVaultAsAsset(vaultAddress: Address, timestamp: BigInt): PriceHistoryDaily {
  let vault = Asset.load(vaultAddress.toHexString());
  let vaultContract = V1Contract.bind(vaultAddress);

  if (vault == null) {
    vault = new Asset(vaultAddress.toHexString());
  }

  // Might be worth using the "try_" version of these calls in the future.
  let tokenAddress = vaultContract.token();
  let token = getOrCreateToken(tokenAddress);

  vault.totalSupply = vaultContract.totalSupply();
  vault.name = vaultContract.name();
  vault.save();

  let priceHistoryID = roundToDay(timestamp).toString();
  let transfer = PriceHistoryDaily.load(priceHistoryID);
  if (transfer == null) {
    transfer = new PriceHistoryDaily(priceHistoryID);
  }
  transfer.asset = vault.id;
  transfer.token = token.id;
  transfer.pricePerShare = vaultContract.getPricePerFullShare();
  transfer.timestamp = timestamp;

  transfer.save();
  return transfer as PriceHistoryDaily;
}

function roundToDay(timeStamp:BigInt): BigInt {
    timeStamp -= timeStamp % BigInt.fromI32(24 * 60 * 60);//subtract amount of time since midnight
    return timeStamp;
}
