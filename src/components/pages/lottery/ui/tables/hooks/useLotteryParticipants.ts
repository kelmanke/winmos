import { useAllDelegations } from '../../../../../utils/queryHooks.ts'
import { useEffect, useState } from 'react'
import { useGetTotalStaked } from '../../../../../utils/queryHooks.ts'
import { startEventListenerNLL } from '../../../../../../events/eventListenerNLL.ts'
import { parseBigNumber } from '../../../../../utils/helperFunctions.ts'
import { useAccount } from 'wagmi'

export const useLotteryParticipants = () => {
  const { address } = useAccount()
  const { allDelegations, refetch: refetchAllDelegations, isLoading } = useAllDelegations()
  const [delegationData, setDelegationData] = useState<any>()
  const { totalStaked, refetch: refetchTotalStaked } = useGetTotalStaked()
  let [eventResult, setEventResult] = useState<any>()

  useEffect(() => {
    parseDelegationData(allDelegations)
    const events = ['EnterLottery', 'ExitLottery']
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
  const parseDelegationData = (currentDelegations: any) => {
    let initialDelegations: any = []
    currentDelegations?.map((item: any) => {
      initialDelegations.push({
        address: item[0],
        delegatedAmount: parseInt(item[1]._hex, 16) / 1e18,
        chance: (parseInt(item[1]._hex, 16) / 1e18) * 100
      })
    })
    setDelegationData(initialDelegations)
  }

  useEffect(() => {
    const fetchData = async () => {
      await refetchTotalStaked()
      await refetchAllDelegations().then((res) => {
        parseDelegationData(res.data)
      })
    }

    fetchData()
  }, [eventResult])

  return {
    delegationData,
    totalStaked,
    address,
    isLoading
  }
}
