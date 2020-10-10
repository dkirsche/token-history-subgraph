import { Asset, PriceHistoryDaily } from "../../../../generated/schema";
import { V1Contract } from "../../../../generated/yBUSDVault/V1Contract";
import { Address, log } from "@graphprotocol/graph-ts";
import { getOrCreateToken } from "./token";

export function getOrCreateVaultAsAsset(vaultAddress: Address): Asset {
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

  return vault as Asset;
}

export function getOrCreateVaultTransfer(
  id: String,
  createIfNotFound: boolean = true
): PriceHistoryDaily {
  let transfer = PriceHistoryDaily.load(id);

  if (transfer == null && createIfNotFound) {
    transfer = new PriceHistoryDaily(id);
  }

  return transfer as PriceHistoryDaily;
}
