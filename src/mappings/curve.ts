import { RemoveLiquidity, Curve3Pool }    from "../../generated/curve_3pool/Curve3Pool";
import { RemoveLiquidity, CurveCompound } from "../../generated/curve_compound/CurveCompound";
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
  let vaultContract = CurveCompound.bind(vaultAddress);
  let vaultName     = "curve_usdp";

  let timestamp         = event.block.timestamp
  let txnHash           = event.transaction.hash
  let totalSupply       = event.params.token_supply;
  let pricePerFullShare = vaultContract.get_virtual_price();
  createPriceHistory(vaultAddress, vaultName, totalSupply, pricePerFullShare, timestamp, txnHash)
}
