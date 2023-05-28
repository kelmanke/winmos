import { Flex } from '@chakra-ui/react'
import { TabsWithLine } from './tabs/TabsWithLine.tsx'
import LotteryNav from '../pages/lottery/ui/LotteryNav.tsx'
import { useAccount } from 'wagmi'

const TopNav = () => {
  const { address, isConnected } = useAccount()
  return (
    <Flex px={3} py={3}>
      <TabsWithLine />
      <LotteryNav address={address ? address.toString() : ''} isConnected={isConnected} />
    </Flex>
  )
}

export default TopNav
