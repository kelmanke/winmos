import { Address } from 'wagmi'
import lottery from './abi/lottery.json'
import winners from './abi/winners.json'

const lotteryContractAddr: Address = '0xf42a3F261a0E122Fb7F01a5296F727EA86cF7701'
const winnersContractAddr: Address = '0x0b4E16E348A6396b4337b42BCFc19dF787A64454'
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
