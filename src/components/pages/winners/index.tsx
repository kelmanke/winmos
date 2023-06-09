import TopNav from '../../ui/TopNav.tsx'
import { Box, Button, Flex, Heading, Image, SimpleGrid } from '@chakra-ui/react'
import nebula from '../../../assets/images/nebula-1.png'
import { useUserWinnings } from './hooks/useUserWinnings.ts'
import AllWinnersTable from './ui/AllWinnersTable.tsx'
import UserWinningsTable from './ui/UserWinningsTable.tsx'
export const Winners = () => {
  const { amountWon, userWinnings, withdrawWinnings, allWinners, waitTx } = useUserWinnings()
  
  return (
    <Box as='section' bg='black' minHeight="100vh">
      <Image src={nebula} className='overlay' />
      <TopNav />
      <Button
        mx='auto'
        w='500px'
        color={'white'}
        borderRadius={10}
        fontSize='20px'
        h='50px'
        isLoading={waitTx.isLoading}
        isDisabled={!(amountWon > 0)}
        onClick={(e) => {
          e.preventDefault()
          withdrawWinnings?.()
        }}
      >
        {!(amountWon > 0) ? 'Nothing to withdraw yet' : 'Withdraw Winnings'}
      </Button>
      <SimpleGrid columns={2} spacing={10} px={5}>
        <Flex flexDir='column' zIndex={111} w='100%'>
          <Heading color='white' alignSelf='center' py={5}>
            All Winners
          </Heading>
          <Box
            maxHeight={`calc(100vh - 250px)`}
            boxShadow='0px 0px 10px #FF7F50'
            overflowY = {allWinners?.length > 0 ? "auto" : "hidden"}
          >
            <AllWinnersTable allWinners={allWinners} />
          </Box>
        </Flex>
        <Flex flexDir='column' zIndex={111} w='100%'>
          <Heading color='white' alignSelf='center' py={5}>
            Personal Winnings
          </Heading>
          <Box
            maxHeight={`calc(100vh - 250px)`}
            boxShadow='0px 0px 10px #FF7F50'
            overflowY={userWinnings?.length > 0 ? "auto" : "hidden"}
          >
            <UserWinningsTable userWinnings={userWinnings} />
          </Box>
        </Flex>
      </SimpleGrid>
    </Box>
  )
}
