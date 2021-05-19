import { CurveContract } from "../../generated/Curve_ySwap/CurveContract";
import { RemoveLiquidity }    from "../../generated/curve_3pool/Curve3Pool";
import { CurveAaveContract } from "../../generated/Curve_aave/CurveAaveContract";
import { Curve3Pool }    from "../../generated/curve_3pool/Curve3Pool";
import { CurveCompound } from "../../generated/curve_compound/CurveCompound";
import { CurveUSDP } from "../../generated/curve_usdp/CurveUSDP";
import { CurveSUSD } from "../../generated/curve_susd/CurveSUSD";
import { CurveRen } from "../../generated/curve_ren/CurveRen";
import { createPriceHistory } from "../utils/helpers"

export function handleCurveTransfer(event: RemoveLiquidity): void {
  let vaultAddress = event.address;
  let vaultContract = CurveContract.bind(vaultAddress);
  let vaultName = "Curve_ySwap"

  createPriceHistory(
    vaultAddress,
    vaultName,
    event.params.token_supply,
    vaultContract.get_virtual_price(),
    event.block.timestamp,
    event.transaction.hash
  )
}

export function handleCurveAaveTransfer(event: RemoveLiquidity): void {
  let vaultAddress = event.address;
  let vaultContract = CurveAaveContract.bind(vaultAddress);
  let vaultName = "Curve_aave"

  createPriceHistory(
    vaultAddress,
    vaultName,
    event.params.token_supply,
    vaultContract.get_virtual_price(),
    event.block.timestamp,
    event.transaction.hash
  )
}

export function handleCurve3PoolTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = Curve3Pool.bind(vaultAddress);
  let vaultName     = "curve_3pool";

  createPriceHistory(
    vaultAddress,
    vaultName,
    event.params.token_supply,
    vaultContract.get_virtual_price(),
    event.block.timestamp,
    event.transaction.hash
  )
}


export function handleCurveCompoundTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveCompound.bind(vaultAddress);
  let vaultName     = "curve_compound";

  createPriceHistory(
    vaultAddress,
    vaultName,
    event.params.token_supply,
    vaultContract.get_virtual_price(),
    event.block.timestamp,
    event.transaction.hash
  )
}


export function handleCurveUSDPTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveUSDP.bind(vaultAddress);
  let vaultName     = "curve_usdp";

  createPriceHistory(
    vaultAddress,
    vaultName,
    event.params.token_supply,
    vaultContract.get_virtual_price(),
    event.block.timestamp,
    event.transaction.hash
  )
}

export function handleCurveSUSDTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveSUSD.bind(vaultAddress);
  let vaultName     = "curve_susd";

  createPriceHistory(
    vaultAddress,
    vaultName,
    event.params.token_supply,
    vaultContract.get_virtual_price(),
    event.block.timestamp,
    event.transaction.hash
  )
}


export function handleCurveRenTransfer(event: RemoveLiquidity): void {
  let vaultAddress  = event.address;
  let vaultContract = CurveRen.bind(vaultAddress);
  let vaultName     = "curve_ren";

  createPriceHistory(
    vaultAddress,
    vaultName,
    event.params.token_supply,
    vaultContract.get_virtual_price(),
    event.block.timestamp,
    event.transaction.hash
  )
}
