import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.tsx'
import { WagmiConfig, createClient } from 'wagmi'
import { provider, chains } from './config/chainsconfig'
import { MetaMaskConnector } from '@wagmi/connectors/metaMask'
import { theme } from './assets/theme/theme.ts'

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider: provider
})

const rootElement: HTMLElement | any = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <ChakraProvider theme={theme}>
    <WagmiConfig client={client as any}>
      <App />
    </WagmiConfig>
  </ChakraProvider>
)
