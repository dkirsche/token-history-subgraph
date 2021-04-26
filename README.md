# token-history subgraph

The subgraph contains 2 entities

## Assets
* ID - Address of pool
* Name - description
* totalSupply

## PriceHistoryDaily
* ID - Date
* Asset!
* pricePerShare


# Getting Started
1. Run `yarn codegen` to generate Graph-queryable Solidity code (in `./generated`)
2. Run `yarn install` to install `node_modules`
3. You can use production subgraph to explore the data struct: https://api.thegraph.com/subgraphs/name/dkirsche/asset-price-history
or you can set up a local subgraph (see below)

## Finding start block
When defining the GraphQL schema, you can supply startBlock of the contract to significantly speed up deployment:

```
// https://thegraph.com/docs/define-a-subgraph#start-blocks
Note: The contract creation block can be quickly looked up on Etherscan:

1. Search for the contract by entering its address in the search bar.
2. Click on the creation transaction hash in the Contract Creator section.
3. Load the transaction details page where you'll find the start block for that contract.
```

## Setting up a local subgraph
1. Setup an ETH mainnet locally. You can use AlchemyAPI: https://alchemyapi.io/?r=2190e565-4752-43b5-ba0f-ed0cf4948249. Make sure to choose Mainnet and Production as your blockchain. Fork a local ETH mainnet by running (make sure hardhat is installed). I'm forking at earliest block number found in subgraph.yaml (https://etherscan.io/blocks?p=59078)

```
# https://hardhat.org/guides/mainnet-forking.html
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/QXyXlwAgmRhb84fAp_9abui_Rn8nhP7a --fork-block-number 10796945
``

This will create a local blockchain accessible from http://127.0.0.1:8545/.

2. Start a Graph node. Easiest way is to use scaffold-eth with the following changes:

```
  # In docker/graph-node/docker-compose.yml
  change network to 'mainnet:http://host.docker.internal:8545'
  rm -rf docker/graph-node/data/
  yarn graph-run-node
```

3. Run `yarn create-local && yarn deploy-local` create and deploy the subgraph.
