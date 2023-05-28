import { useAccount, useBalance, useContractRead } from 'wagmi'
import { lotteryContractMain, winnersContractMain } from '../../config/contracts.ts'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { baseURL } from '../../api/evmos.ts'
import { validatorAddr } from '../../config/validators.ts'

type UnbondingRequest = {
  completionTime: number
  amount: number
  isUnbonded: boolean
}

export const useContractUndelegations = () => {
  const { data: undelegations } = useContractRead({
    ...lotteryContractMain,
    functionName: 'getUndelegations',
    args: [validatorAddr]
  })

  return {
    undelegations
  }
}

export const useTotalDelegated = () => {
  const { data } = useContractRead({
    ...lotteryContractMain,
    functionName: 'totalStaked'
  })

  return {
    totalDelegated: data as number
  }
}

export const usePendingUndelegations = () => {
  const { address } = useAccount()
  const { data, isError, isLoading, refetch } = useContractRead({
    ...lotteryContractMain,
    functionName: 'getPendingUndelegations',
    overrides: {
      from: address
    }
  })

  const unbondingRequests: UnbondingRequest[] = data?.map((item: any) => {
    const completionTime = new Date(parseInt(item.completionTime._hex, 16) * 1000)
    return {
      completionTime: completionTime,
      amount: parseInt(item.amount._hex, 16) / 1e18,
      isUnbonded: new Date() > completionTime
    }
  })

  const availableToWithdraw = unbondingRequests?.reduce((total, item) => {
    return item.isUnbonded ? total + item.amount : total
  }, 0)
  return {
    availableToWithdraw,
    unbondingRequests,
    isError,
    isLoading,
    refetch
  }
}

export const useAllDelegations = () => {
  const { data, isError, isLoading, refetch } = useContractRead({
    ...lotteryContractMain,
    functionName: 'getAllDelegations'
  })
  return {
    allDelegations: data as any[],
    isError,
    isLoading,
    refetch
  }
}

export const useAllWinners = () => {
  const { data, isError, isLoading, refetch } = useContractRead({
    ...winnersContractMain,
    functionName: 'getAllWinners'
  })

  return {
    allWinners: data as any[],
    isError,
    isLoading,
    refetch
  }
}

export const useWinningsAmountForUser = () => {
  const { address } = useAccount()
  const { data, isError, isLoading, refetch } = useContractRead({
    ...winnersContractMain,
    functionName: 'winnings',
    args: [address]
  })

  return {
    amountWon: data ? BigNumber.from(data) / 1e18 : 0,
    isError,
    isLoading,
    refetch
  }
}

export const useAccountBalance = () => {
  const { address } = useAccount()
  const { data, isError, isLoading, refetch } = useBalance({
    address: address
  })

  return {
    accountBalance: Number(data?.formatted).toFixed(3),
    isError,
    isLoading,
    refetch
  }
}

export const useGetDeposits = () => {
  const { address } = useAccount()
  const { data, isError, isLoading, refetch } = useContractRead({
    ...lotteryContractMain,
    functionName: 'deposits',
    args: [address]
  })

  return {
    balance: data ? (data as any) / 1e18 : 0,
    isError,
    isLoading,
    refetch
  }
}

export const useGetNumberOfRounds = () => {
  const { data, isError, isLoading } = useContractRead({
    ...lotteryContractMain,
    functionName: 'getNumberOfRounds'
  })
  const typeCastData = data as any
  const hexString = typeCastData && typeCastData._hex
  return {
    balance: data ? parseInt(hexString, 16) : 0,
    isError,
    isLoading
  }
}

export const useGetTotalStaked = () => {
  const { data, isError, isLoading, refetch } = useContractRead({
    ...lotteryContractMain,
    functionName: 'totalStaked'
  })
  const totalStaked: any = data
  return {
    totalStaked: parseInt(totalStaked?._hex, 16) / 1e18,
    isError,
    isLoading,
    refetch
  }
}

export const useGetParticipants = () => {
  const { data, isError, isLoading } = useContractRead({
    ...lotteryContractMain,
    functionName: 'getCurrentParticipants'
  })

  return {
    participantsData: data as string[],
    isError,
    isLoading
  }
}

export const useGetDelegations = (address: any) => {
  const { data, isError, isLoading, refetch } = useContractRead({
    ...lotteryContractMain,
    functionName: 'delegations',
    args: [address]
  })

  return {
    delegation: data ? (data as any) / 1e18 : 0,
    isError,
    isLoading,
    refetch
  }
}

export const useEstimatedLotteryPool = () => {
  const { totalDelegated } = useTotalDelegated()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [estimatedLotteryPool, setEstimatedLotteryPool] = useState<string>('')
  const fetchPromises = [
    fetch(baseURL + 'cosmos/staking/v1beta1/pool'),
    fetch(baseURL + 'evmos/inflation/v1/params'),
    fetch(baseURL + 'evmos/inflation/v1/inflation_rate'),
    fetch(baseURL + 'evmos/inflation/v1/circulating_supply')
  ]
  Promise.all(fetchPromises)
    .then((responses) => {
      return Promise.all(responses.map((response) => response.json()))
    })
    .then((data) => {
      const stakingChunk = data[1].params.inflation_distribution.staking_rewards
      const totalStakingRatio = Number(data[0].pool.bonded_tokens) / Number(data[3].circulating_supply.amount)
      const inflationRate = (data[2].inflation_rate / 100) * stakingChunk
      const estimatedAPR = (inflationRate * (1 - 0.05)) / totalStakingRatio
      const total = Number(((estimatedAPR / 365) * totalDelegated) / 1e18).toFixed(3)
      setEstimatedLotteryPool(total)
      setIsLoading(false)
    })

  return {
    estimatedLotteryPool,
    isLoading
  }
}
