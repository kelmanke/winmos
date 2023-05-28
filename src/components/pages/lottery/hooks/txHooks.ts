import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useState } from 'react'
import { lotteryContractMain, winnersContractMain } from '../../../../config/contracts.ts'
import { BigNumber, ethers } from 'ethers'
import { validatorAddr } from '../../../../config/validators.ts'
import { useTxConfirmation } from '../../../utils/hooks.ts'

export const useDeposit = () => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<string>('')
  const { config } = usePrepareContractWrite({
    ...lotteryContractMain,
    functionName: 'deposit',
    overrides: {
      from: address,
      value: ethers.utils.parseEther(amount != '' ? amount : '0')
    }
  })

  const { data: response, write, isSuccess, isLoading, status, isError } = useContractWrite(config)
  const { waitTx } = useTxConfirmation(response?.hash, amount, 'Deposited')

  return {
    waitTx,
    amount,
    setAmount,
    write,
    isSuccess,
    isLoading,
    response,
    status,
    isError
  }
}

export const useWithdraw = () => {
  const [amount, setAmount] = useState<string>('')
  const { config } = usePrepareContractWrite({
    ...lotteryContractMain,
    functionName: 'withdraw',
    args: [ethers.utils.parseEther(amount != '' ? amount : '0')]
  })

  const { data: response, isLoading, isSuccess, write, isError } = useContractWrite(config)
  const { waitTx } = useTxConfirmation(response?.hash, amount, 'Withdrew')

  return {
    waitTx,
    amount,
    setAmount,
    write,
    isSuccess,
    isLoading,
    response,
    isError
  }
}
export const useWithdrawUnbonded = (amount: any) => {
  const { config } = usePrepareContractWrite({
    ...lotteryContractMain,
    functionName: 'withdrawAllUnbonded'
  })

  const { data: response, isLoading, isSuccess, write, isError } = useContractWrite(config)
  const { waitTx } = useTxConfirmation(response?.hash, amount, 'Withdrew Unbonded - ')

  return {
    waitTx,
    withdrawUnbonded: write,
    isSuccess,
    isLoading,
    response,
    isError
  }
}

export const useEnterLottery = () => {
  const [amount, setAmount] = useState<string>('')
  const { config } = usePrepareContractWrite({
    ...lotteryContractMain,
    functionName: 'enterLottery',
    args: [validatorAddr, ethers.utils.parseEther(amount != '' ? amount : '0')],
    overrides: {
      gasLimit: BigNumber.from(5000000)
    }
  })

  const { data: response, isLoading, isSuccess, write, isError } = useContractWrite(config)
  const { waitTx } = useTxConfirmation(response?.hash, amount, 'Entered Lottery with')

  return {
    waitTx,
    amount,
    setAmount,
    write,
    isSuccess,
    isLoading,
    response,
    isError
  }
}

export const useExitLottery = () => {
  const [amount, setAmount] = useState<string>('')
  const { config } = usePrepareContractWrite({
    ...lotteryContractMain,
    functionName: 'exitLottery',
    args: [validatorAddr, ethers.utils.parseEther(amount != '' ? amount : '0')],
    overrides: {
      gasLimit: BigNumber.from(5000000)
    }
  })

  const { data: response, isLoading, isSuccess, isError, write } = useContractWrite(config)
  const { waitTx } = useTxConfirmation(response?.hash, amount, 'Exited Lottery with')

  return {
    waitTx,
    amount,
    setAmount,
    write,
    isSuccess,
    isLoading,
    response,
    isError
  }
}

export const useWithdrawWinnings = (amountWon: any) => {
  const { config } = usePrepareContractWrite({
    ...winnersContractMain,
    functionName: 'withdrawWinnings'
  })

  const { data: winnings, isLoading, isSuccess, write, isError } = useContractWrite(config)
  const { waitTx } = useTxConfirmation(winnings?.hash, Number(amountWon).toFixed(10), 'Withdrew Winnings - ')

  return {
    waitTx,
    withdrawWinnings: write,
    isSuccess,
    isLoading,
    winnings,
    isError
  }
}
