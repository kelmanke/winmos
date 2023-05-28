import { useEffect, useState } from 'react'
import { useAllWinners, useWinningsAmountForUser } from '../../../utils/queryHooks.ts'
import { useAccount } from 'wagmi'
import { useWithdrawWinnings } from '../../lottery/hooks/txHooks.ts'
import { startEventListenerNLL } from '../../../../events/eventListenerNLL.ts'
import { startEventListenerWinners } from '../../../../events/eventListenerWinners.ts'
import { parseBigNumber } from '../../../utils/helperFunctions.ts'

export const useUserWinnings = () => {
  const [userWinnings, setUserWinnings] = useState<any[]>([])
  const { allWinners, refetch: refetchWinners } = useAllWinners()
  const { amountWon, refetch: refetchUserWinnings } = useWinningsAmountForUser()
  const { address } = useAccount()
  const { withdrawWinnings, waitTx } = useWithdrawWinnings(amountWon)
  let [eventResult, setEventResult] = useState<any>()

  const filterAllWinnersByUser = () => {
    let filterArray = allWinners.filter((item) => item.winnerAddress === address)
    setUserWinnings(filterArray)
  }

  useEffect(() => {
      startEventListenerNLL("PickWinner", (address, amount, eventType) => {
        setEventResult({
          eventAddress: address,
          eventAmount: parseBigNumber(amount) / 1e18,
          eventType: eventType
        })
      })
      startEventListenerWinners("WithdrawWinnings", (address, amount, eventType) => {
        setEventResult({
          eventAddress: address,
          eventAmount: parseBigNumber(amount) / 1e18,
          eventType: eventType
        })
      })
  }, [])

  useEffect(() => {
    refetchWinners()
    refetchUserWinnings()
    allWinners && filterAllWinnersByUser()
  }, [allWinners, eventResult])

  return { amountWon, userWinnings, withdrawWinnings, allWinners, waitTx }
}
