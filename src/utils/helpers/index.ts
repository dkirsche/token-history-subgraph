import { getOrCreateVaultAsAsset, getOrCreatePriceHistory } from "./yVault/yVault";
import { BigDecimal, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";


export {
  getOrCreateVaultAsAsset,
} from "./yVault/yVault";

export {
  getOrCreatePriceHistory
} from "./yVault/yVault";


export function createPriceHistory(vaultAddress: Address, vaultName: String, totalSupply:BigInt, pricePerFullShare:BigInt, timestamp: BigInt, txnHash: Bytes): void {
  let vault        = getOrCreateVaultAsAsset(vaultAddress,vaultName,totalSupply);
  let priceHistory = getOrCreatePriceHistory(vault, pricePerFullShare, timestamp, txnHash);
}
