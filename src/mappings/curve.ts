import { RemoveLiquidity }    from "../../generated/curve_3pool/Curve3Pool";
import { Curve3Pool }    from "../../generated/curve_3pool/Curve3Pool";
import { CurveCompound } from "../../generated/curve_compound/CurveCompound";
import { CurveUSDP } from "../../generated/curve_usdp/CurveUSDP";
import { CurveSUSD } from "../../generated/curve_susd/CurveSUSD";
import { CurveRen } from "../../generated/curve_ren/CurveRen";
import { createPriceHistory } from "../utils/helpers"

export function handleCurve3PoolTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = Curve3Pool.bind(vaultAddress);
  let vaultName     = "curve_3pool";

  let timestamp         = event.block.timestamp
  let txnHash           = event.transaction.hash
  let totalSupply       = event.params.token_supply;
  let pricePerFullShare = vaultContract.get_virtual_price();
  createPriceHistory(vaultAddress, vaultName, totalSupply, pricePerFullShare, timestamp, txnHash)
}


export function handleCurveCompoundTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveCompound.bind(vaultAddress);
  let vaultName     = "curve_compound";

  let timestamp         = event.block.timestamp
  let txnHash           = event.transaction.hash
  let totalSupply       = event.params.token_supply;
  let pricePerFullShare = vaultContract.get_virtual_price();
  createPriceHistory(vaultAddress, vaultName, totalSupply, pricePerFullShare, timestamp, txnHash)
}


export function handleCurveUSDPTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveUSDP.bind(vaultAddress);
  let vaultName     = "curve_usdp";

  let timestamp         = event.block.timestamp
  let txnHash           = event.transaction.hash
  let totalSupply       = event.params.token_supply;
  let pricePerFullShare = vaultContract.get_virtual_price();
  createPriceHistory(vaultAddress, vaultName, totalSupply, pricePerFullShare, timestamp, txnHash)
}

export function handleCurveSUSDTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveSUSD.bind(vaultAddress);
  let vaultName     = "curve_susd";

  let timestamp         = event.block.timestamp
  let txnHash           = event.transaction.hash
  let totalSupply       = event.params.token_supply;
  let pricePerFullShare = vaultContract.get_virtual_price();
  createPriceHistory(vaultAddress, vaultName, totalSupply, pricePerFullShare, timestamp, txnHash)
}


export function handleCurveRenTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveRen.bind(vaultAddress);
  let vaultName     = "curve_ren";

  let timestamp         = event.block.timestamp
  let txnHash           = event.transaction.hash
  let totalSupply       = event.params.token_supply;
  let pricePerFullShare = vaultContract.get_virtual_price();
  createPriceHistory(vaultAddress, vaultName, totalSupply, pricePerFullShare, timestamp, txnHash)
}
