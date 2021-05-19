import { Transfer, V1Contract } from "../../generated/yUSDVault/V1Contract";
import { RemoveLiquidity, CurveContract } from "../../generated/Curve_ySwap/CurveContract";

import { createPriceHistory } from "../utils/helpers";
import { ZERO_ADDRESS } from "../utils/constants";
import { BigDecimal, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";

export function handleYEarnTransfer(event: Transfer): void {
  let vaultAddress = event.address;
  let vaultContract = V1Contract.bind(vaultAddress);
  let vaultName = vaultContract.name()

  createPriceHistory(
    vaultAddress,
    vaultName,
    vaultContract.totalSupply(),
    vaultContract.getPricePerFullShare(),
    event.block.timestamp,
    event.transaction.hash
  )
}
