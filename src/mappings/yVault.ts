import { Transfer } from "../../generated/yUSDVault/V1Contract";
import {
  getOrCreateVaultAsAsset,
  getOrCreateVaultTransfer,
} from "../utils/helpers";
import { ZERO_ADDRESS } from "../utils/constants";

export function handleTransfer(event: Transfer): void {
  let transactionId = event.address
    .toHexString()
    .concat("-")
    .concat(event.transaction.hash.toHexString())
    .concat("-")
    .concat(event.logIndex.toString());

  let vaultAddress = event.address;
  let vault = getOrCreateVaultAsAsset(vaultAddress);

  let timestamp = event.block.timestamp;
  let value = event.params.value;
  let totalSupply = vault.totalSupply;

  vault.save();

  let priceHistory = getOrCreateVaultTransfer(transactionId);

  priceHistory.asset = vault.id;
  priceHistory.pricePerShare = vault.pricePerShare;

  priceHistory.save();
}
