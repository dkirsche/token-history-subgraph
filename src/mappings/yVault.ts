import { Transfer } from "../../generated/yUSDVault/V1Contract";
import {
  getOrCreateVaultAsAsset,
} from "../utils/helpers";
import { ZERO_ADDRESS } from "../utils/constants";

export function handleTransfer(event: Transfer): void {
  let vaultAddress = event.address;
  let timestamp = event.block.timestamp
  let priceHistory = getOrCreateVaultAsAsset(vaultAddress, timestamp);
}
