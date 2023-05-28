import { Chain, configureChains } from 'wagmi'
import { evmos, evmosTestnet } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

export const { chains, provider } = configureChains(
  [evmos as Chain, evmosTestnet as Chain],
  [
    jsonRpcProvider({
      rpc: (_: Chain) => ({
        http: import.meta.env.VITE_RPC_ENDPOINT
      })
    })
  ]
)
