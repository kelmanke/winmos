import { Box, Button, Flex } from '@chakra-ui/react'
import { useDisconnect } from 'wagmi'
import { WalletModal } from '../../../ui/modals/WalletModal.tsx'

type Props = {
  address: string
  isConnected: boolean
}

const LotteryNav = ({ address, isConnected }: Props) => {
  const { disconnect } = useDisconnect()
  return (
    <Box as='nav' w='100%'>
      <Flex w='100%' justifyContent='space-between' px={2} py={2}>
        <Flex justifyContent='center' flexGrow={1}></Flex>
        {isConnected ? (
          <Button onClick={() => disconnect()} rounded='xl'>
            Connected to {address.slice(0, 4)}....{address.slice(address.length - 4)}
          </Button>
        ) : (
          <WalletModal />
        )}
      </Flex>
    </Box>
  )
}

export default LotteryNav
