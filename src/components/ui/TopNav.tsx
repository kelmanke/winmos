import { Flex, Box } from '@chakra-ui/react'
import { TabsWithLine } from './tabs/TabsWithLine.tsx'
import LotteryNav from '../pages/lottery/ui/LotteryNav.tsx'
import { useAccount } from 'wagmi'

const TopNav = () => {
  const { address, isConnected } = useAccount()
  return (
    <Flex px={3} py={3}>
      <Box
        mx={5}
        zIndex={111}
        my='auto'
        as='span'
        fontSize='2xl'
        css={{
          textShadow: `0 0 10px #FF7F50, 0 0 20px #FF7F50, 0 0 30px #FF7F50, 0 0 40px #FF7F50`,
          color: '#FF7F50',
          transition: 'text-shadow 0.5s ease-in-out'
        }}
        _hover={{
          css: {
            textShadow:` 0 0 20px #FF7F50, 0 0 30px #FF7F50, 0 0 40px #FF7F50, 0 0 50px #FF7F50, 0 0 60px #FF7F50`
          }
        }}
      >
        Winmos
      </Box>
      <TabsWithLine />
      <LotteryNav address={address ? address.toString() : ''} isConnected={isConnected} />
    </Flex>
  )
}

export default TopNav
