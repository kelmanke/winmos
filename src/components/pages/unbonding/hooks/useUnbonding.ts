import { usePendingUndelegations } from '../../../utils/queryHooks'
import { useWithdrawUnbonded } from '../../lottery/hooks/txHooks'
import { useEffect, useState } from 'react'
import { startEventListenerNLL } from '../../../../events/eventListenerNLL'
import { parseBigNumber } from '../../../utils/helperFunctions'

export const useUnbonding = () => {
  const { availableToWithdraw, unbondingRequests, refetch: refetchPendingUndelegations } = usePendingUndelegations()
  const { withdrawUnbonded, waitTx } = useWithdrawUnbonded(availableToWithdraw)
  let [eventResult, setEventResult] = useState<any>()

  useEffect(() => {
    startEventListenerNLL('Withdraw', (address, amount, eventType) => {
      setEventResult({
        eventAddress: address,
        eventAmount: parseBigNumber(amount) / 1e18,
        eventType: eventType
      })
    })
  }, [])

  useEffect(() => {
    refetchPendingUndelegations()
  }, [eventResult])

  return { availableToWithdraw, unbondingRequests, withdrawUnbonded, waitTx }
}
