import { useWaitForTransaction } from 'wagmi'
import { useDisplayToast } from './txToasts.tsx'

export const useTxConfirmation = (txHash: any, amount: any, type: string) => {
  const toast = useDisplayToast()
  const waitTx = useWaitForTransaction({
    hash: txHash,
    onSuccess: (data) => {
      toast.displayToast({
        title: `${type} ${amount} Evmos`,
        status: 0,
        hash: data.transactionHash
      })
    },
    onError: () => {
      toast.displayToast({
        status: 1,
        hash: txHash
      })
    }
  })

  return {
    waitTx
  }
}
