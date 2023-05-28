import { useEffect, useState } from 'react'
import { startEventListenerNLL } from '../../../../../../events/eventListenerNLL'
import { useAccountBalance, useGetDelegations, useGetDeposits } from '../../../../../utils/queryHooks'
import { useAccount } from 'wagmi'
import * as txHooks from '../../../hooks/txHooks.ts'
import { parseBigNumber } from '../../../../../utils/helperFunctions.ts'

export const useGenericCard = (txType: string) => {
  const { accountBalance, refetch: refetchAccountBalance } = useAccountBalance()
  const { address } = useAccount()
  let { balance: depositData, refetch: refetchDeposits } = useGetDeposits()
  let { delegation: delegationData, refetch: refetchDelegations } = useGetDelegations(address)
  const [amountError, setAmountError] = useState<any>()
  let [eventResult, setEventResult] = useState<any>()

  // Determine which function to use based on txType
  let txFunction: {
    amount: any
    setAmount: any
    write: any
    isSuccess?: boolean
    isLoading?: boolean
    isFetching?: boolean
    response: any
    status?: any
    isError?: any
    onSettled?: any
    onSuccess?: any
    waitTx?: any
  }
  let message: string = 'Deposits'
  let events: string[] = []
  switch (txType) {
    case 'Deposit':
      events = ['Deposit', 'Withdraw']
      txFunction = txHooks.useDeposit()
      break
    case 'Withdraw':
      events = ['Deposit', 'Withdraw']
      txFunction = txHooks.useWithdraw()
      break
    case 'Enter':
      events = ['EnterLottery', 'ExitLottery']
      message = 'Delegations'
      txFunction = txHooks.useEnterLottery()
      break
    case 'Exit':
      events = ['EnterLottery', 'ExitLottery']
      message = 'Delegations'
      txFunction = txHooks.useExitLottery()
      break
    default:
      // Handle unrecognized txType here
      break
  }
  // Access the necessary values from the txFunction
  const { amount, setAmount, write, isLoading, waitTx } = txFunction!

  useEffect(() => {
    events.map((eventName) => {
      startEventListenerNLL(eventName, (address, amount, eventType) => {
        setEventResult({
          eventAddress: address,
          eventAmount: parseBigNumber(amount) / 1e18,
          eventType: eventType
        })
      })
    })
  }, [])
  
  useEffect(() => {
   
    switch (txType) {
      case 'Deposit':
        if(+amount > +accountBalance) {
          setAmountError("Available amount exceeded")
        } else {
          setAmountError(false)
        }
        break
      case 'Withdraw':
        if(+amount > +depositData) {
          setAmountError("Available amount exceeded")
        } else {
          setAmountError(false)
        }
        break
      case 'Enter':
        if(+amount > +depositData) {
          setAmountError("Available amount exceeded")
        } else {
          setAmountError(false)
        }
        break
      case 'Exit':
        if(+amount > +delegationData) {
          setAmountError("Available amount exceeded")
        } else {
          setAmountError(false)
        }
        break
      default:
        // Handle unrecognized txType here
        break
    }
  }, [amount])

  useEffect(() => {
    setAmount('')
    refetchAccountBalance()
    refetchDelegations()
    refetchDeposits()
  }, [eventResult])

  return {
    waitTx,
    message,
    accountBalance,
    depositData,
    delegationData,
    amountError,
    write,
    isLoading,
    amount,
    setAmount,
    setAmountError
  }
}
