import { Transfer } from "../../generated/yUSDVault/V1Contract";
import { RemoveLiquidity } from "../../generated/Curve_ySwap/CurveContract";
import { V1Contract } from "../../generated/yUSDVault/V1Contract";
import { CurveContract } from "../../generated/Curve_ySwap/CurveContract";
import {
  getOrCreateVaultAsAsset, getOrCreatePriceHistory
} from "../utils/helpers";
import { ZERO_ADDRESS } from "../utils/constants";

export function handleYEarnTransfer(event: Transfer): void {
  let vaultAddress = event.address;
  let timestamp = event.block.timestamp
  let txnHash=event.transaction.hash
  let vaultContract = V1Contract.bind(vaultAddress);
  let vaultName = vaultContract.name()
  let totalSupply = vaultContract.totalSupply()
  let pricePerFullShare = vaultContract.getPricePerFullShare()

  let vault = getOrCreateVaultAsAsset(vaultAddress, vaultName,totalSupply);
  let priceHistory = getOrCreatePriceHistory(vault, pricePerFullShare, timestamp, txnHash);
}
export function handleCurveTransfer(event: RemoveLiquidity): void {
  let vaultAddress = event.address;
  let timestamp = event.block.timestamp
  let txnHash=event.transaction.hash
  let vaultContract = CurveContract.bind(vaultAddress);
  let vaultName = "Curve_ySwap"
  let totalSupply = event.params.token_supply
  let pricePerFullShare = vaultContract.get_virtual_price()
  let vault = getOrCreateVaultAsAsset(vaultAddress,vaultName,totalSupply);
  let priceHistory = getOrCreatePriceHistory(vault, pricePerFullShare, timestamp, txnHash);
}
