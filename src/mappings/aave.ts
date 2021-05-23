import { ReserveDataUpdated } from "../../generated/aave_pool/AavePool";
import { AavePool } from "../../generated/aave_pool/AavePool";
import { AssetIndexUpdated } from "../../generated/aave_rewards/AaveRewards";
import { AaveRewards } from "../../generated/aave_rewards/AaveRewards";
import { AaveAToken } from "../../generated/aave_pool/AaveAToken";
import { createPriceHistory, createOtherRewardHistory } from "../utils/helpers"
import { RewardOther } from "../../generated/schema";

// For calculating base apy
//reserve update event is emitted when reserve data (including liquidityIndex) is updated
//to calculate APY of day1, need to do the following calculation
// previous_day_liquidity_change = (liquidityIndex_day1 -liquidityIndex_day0) /1e27
// seconds_between_liquidity_data = timestamp_day1 -timstamp_day0
// convert to APY = previous_day_liquidity_change * (seconds_in_a_year / seconds_between_liquidity_data)
export function handlePriceHistoryUpdates(event: ReserveDataUpdated): void {
  let vaultAddress = event.address;
  let vaultContract = AavePool.bind(vaultAddress);
  let reserveData = vaultContract.getReserveData(event.params.reserve)
  let aTokenAddress = reserveData.aTokenAddress
  let aToken = AaveAToken.bind(aTokenAddress)
  let vaultName = "Aave" + aToken.symbol()

  createPriceHistory(
    aTokenAddress,
    vaultName,
    aToken.totalSupply(),
    reserveData.liquidityIndex,
    event.block.timestamp,
    event.transaction.hash
  )
}

export function handleRewardsEvents(event: AssetIndexUpdated): void {
  let rewardsAddress = event.address;
  let rewardsContract = AaveRewards.bind(rewardsAddress);
  let rewardToken = rewardsContract.REWARD_TOKEN();
  let aTokenAddress = event.params.asset;
  let aToken = AaveAToken.bind(aTokenAddress);
  let rewardIndex = event.params.index
  createOtherRewardHistory(
    event.block.timestamp,
    event.transaction.hash,
    rewardsAddress,
    aTokenAddress,
    rewardIndex,
    null, //total_supply does not apply to aave. They use emissionPerSecond, Representing the total rewards distributed per second per asset unit, on the distribution
    rewardToken
  )
  //createOtherRewardHistory(event,aTokenAddress,rewardToken);
}
