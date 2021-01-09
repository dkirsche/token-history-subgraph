import { Transfer } from "../../generated/yUSDVault/V1Contract";
import { RemoveLiquidity } from "../../generated/Curve_ySwap/CurveContract";
import { V1Contract } from "../../generated/yUSDVault/V1Contract";
import { CurveContract } from "../../generated/Curve_ySwap/CurveContract";
import { CurveAaveContract } from "../../generated/Curve_aave/CurveAaveContract";
import {
  getOrCreateVaultAsAsset, getOrCreatePriceHistory
} from "../utils/helpers";
import { ZERO_ADDRESS } from "../utils/constants";
import { BigDecimal, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";

export function handleYEarnTransfer(event: Transfer): void {
  let vaultAddress = event.address;
  let vaultContract = V1Contract.bind(vaultAddress);
  let vaultName = vaultContract.name()

  let timestamp = event.block.timestamp
  let txnHash=event.transaction.hash
  let totalSupply = vaultContract.totalSupply()
  let pricePerFullShare = vaultContract.getPricePerFullShare()
  createPriceHistory(vaultAddress,vaultName,totalSupply,pricePerFullShare, timestamp, txnHash)
}
export function handleCurveTransfer(event: RemoveLiquidity): void {
  let vaultAddress = event.address;
  let vaultContract = CurveContract.bind(vaultAddress);
  let vaultName = "Curve_ySwap"

  let timestamp = event.block.timestamp
  let txnHash=event.transaction.hash
  let totalSupply = event.params.token_supply
  let pricePerFullShare = vaultContract.get_virtual_price()
  createPriceHistory(vaultAddress,vaultName,totalSupply,pricePerFullShare, timestamp, txnHash)
}
export function handleCurveAaveTransfer(event: RemoveLiquidity): void {
  let vaultAddress = event.address;
  let vaultContract = CurveAaveContract.bind(vaultAddress);
  let vaultName = "Curve_aave"

  let pricePerFullShare = vaultContract.get_virtual_price()
  let totalSupply = event.params.token_supply
  let timestamp = event.block.timestamp
  let txnHash=event.transaction.hash
  createPriceHistory(vaultAddress,vaultName,totalSupply,pricePerFullShare, timestamp, txnHash)
}

function createPriceHistory(vaultAddress: Address, vaultName: String, totalSupply:BigInt, pricePerFullShare:BigInt, timestamp: BigInt, txnHash: Bytes): void {
  let vault = getOrCreateVaultAsAsset(vaultAddress,vaultName,totalSupply);
  let priceHistory = getOrCreatePriceHistory(vault, pricePerFullShare, timestamp, txnHash);
}
