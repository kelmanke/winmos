import { Box, Button, Flex, Heading, HStack, Image } from '@chakra-ui/react'
import TopNav from '../../ui/TopNav'
import nebula from '../../../assets/images/nebula-2.png'
import PendingUnbondedTable from './ui/PendingUnbondedTable.tsx'
import { useUnbonding } from './hooks/useUnbonding.ts'
import EvmosToken from '../../ui/tokens/EvmosToken.tsx'

const UnbondingTable = () => {
  const { availableToWithdraw, unbondingRequests, withdrawUnbonded, waitTx } = useUnbonding()

  return (
    <Flex flexDir='column' as='section' height='100%' bg='black' zIndex={111}>
      <Image src={nebula} className='overlay' />
      <TopNav />
      <Flex flexDir='column'>
        <Box zIndex={111} color='white'>
          <Flex flexDir='column' pt={5}>
            <HStack mx={'auto'}>
              <EvmosToken w='35px' h='35px' />
              <Heading>Unbonded TEVMOS: {availableToWithdraw}</Heading>
            </HStack>
            <Button
              mt={5}
              w='500px'
              color={'white'}
              borderRadius={10}
              fontSize='20px'
              h='50px'
              mx='auto'
              isLoading={waitTx.isLoading}
              isDisabled={!(availableToWithdraw > 0)}
              onClick={(e) => {
                e.preventDefault()
                withdrawUnbonded?.()
              }}
            >
              {!(availableToWithdraw > 0) ? 'Nothing to withdraw yet' : 'Withdraw Unbonded'}
            </Button>
          </Flex>
        </Box>
        <PendingUnbondedTable unbondingRequests={unbondingRequests} />
      </Flex>
    </Flex>
  )
}

export default UnbondingTable
