import { Address } from 'wagmi'
import lottery from './abi/lottery.json'
import winners from './abi/winners.json'

const lotteryContractAddr: Address = '0x55bF345E1A04E43e558DB462E92f0cF8833214BE'
const winnersContractAddr: Address = '0xcD02C29795F8995e14165Ae4DD5f2Aa9aEb4E28F'
const lotteryContractAbi = lottery
const winnersContractABI = winners

export const lotteryContractMain = {
  address: lotteryContractAddr,
  abi: lotteryContractAbi
}

export const winnersContractMain = {
  address: winnersContractAddr,
  abi: winnersContractABI
}
