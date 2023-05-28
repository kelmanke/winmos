import { Box, Flex, Image, SimpleGrid, Stack } from '@chakra-ui/react'
import Timer from './ui/Timer.tsx'
import DepositWithdrawCard from './ui/cards/DepositWithdrawPanel.tsx'
import EnterExitCard from './ui/cards/EnterExitPanel.tsx'
import LotteryParticipantTable from './ui/tables/LotteryParticipantTable.tsx'
import TopNav from '../../ui/TopNav.tsx'
import nebula from '../../../assets/images/nebula-3.png'
import EstimatedRewards from './ui/EstimatedRewards.tsx'
import clock from '../../../assets/images/clock-1.png'

export const Lottery = () => {
  return (
    <Box as='section' height='100%' w='100%' bg='black'>
      <Image src={nebula} className='overlay' />
      <TopNav />
      <Flex flexDir='column'>
        <Stack spacing={5} w='100%' zIndex={111}>
          <SimpleGrid columns={3} px={5} py={5} templateColumns='35% 30% 35%'>
            <DepositWithdrawCard />
            <Box backgroundImage={clock} backgroundSize={'cover'} backgroundPosition={'center center'}>
              <Stack bg='blackAlpha.500' h='100%' mx={5} borderRadius={8} justifyContent='center'>
                <Timer />
                <EstimatedRewards />
              </Stack>
            </Box>
            <EnterExitCard />
          </SimpleGrid>
        </Stack>
        <Box overflowY='auto' maxH='md' alignSelf='stretch' p={5} zIndex={1}>
          <LotteryParticipantTable />
        </Box>
      </Flex>
    </Box>
  )
}
