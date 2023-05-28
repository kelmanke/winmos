import { Address } from 'wagmi'
import lottery from './abi/lottery.json'
import winners from './abi/winners.json'

const lotteryContractAddr: Address = '0x5a0cD5B73e2c7c908d4c0E74299aee8dF1D3A05f'
const winnersContractAddr: Address = '0x14FEF717bB704C0054E73Dc98676831CD5b569C2'
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
