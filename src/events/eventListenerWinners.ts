import { watchContractEvent } from '@wagmi/core'
import { winnersContractMain } from '../config/contracts'

export const startEventListenerWinners = (
  eventName: string,
  callback: (address: any, amount: any, eventType: any) => void
) => {
  const unwatch = watchContractEvent(
    { ...winnersContractMain, eventName },
    (address: any, amount: any) => {
      callback(address, amount, eventName);
    }
  );

  return {
    unwatch
  }
}
