
# Winmos

**Winmos** is a no loss lottery hosted on Evmos Testnet that gathers user staking rewards
and picks 1 winner every 24 hours.

## Overview

**Winmos** is a no loss lottery implementation on Evmos utilizing EVM extensions to stake 
and distribute rewards. It utilizes the contract balance to ensure on-chain funds are locked so
the lottery has a fair winner each time inflation rewards are distributed.

### EVM Extensions

The addition of `Staking.sol` and `Distribution.sol` allow for smart contracts to 
execute Cosmos transactions without leaving the EVM environment. This allows **Winmos** to
onboard new users to the EVM and Evmos by providing a no loss lottery system similar to
PoolTogether on Ethereum.

## Smart Contract Design

### Approach

After watching the workshops and reviewing the example code from the
[extensions repo](https://github.com/evmos/extensions/tree/main/examples/no-loss-lottery)
**Winmos** expanded the concept by creating a fully automated client, winner selection
and withdrawing systems. Users can safely deposit and withdraw from the contract as well as
enter and exit the lottery all through EVM transaction that ensure their funds are tracked
by the contract state. A winner is picked based on the number of EVMOS they have staked
ensuring higher odds to users that have pledged more. A random number to shuffle participants
and pick a winning range is generated using the 
[DIAOracle](https://docs.diadata.org/documentation/oracle-documentation/randomness-oracle)

### Limitations

- The maximum of 7 unbonding delegations that is allowed on the Cosmos SDK could limit
how often users can make small undelegations.

- Ethereum allows for depositing into a contract and using that same balance in a follow-up
operation. This doesn't work on Evmos so an additional `Deposit` transaction is required.

### Future improvements

By mainnet we want to include additional features:
- weekly and monthly draws with more winners (top 3 for weekly, top 5 for monthly).
- no loss dice game.
- no loss coin price prediction game using Oracle service for real time prices.

