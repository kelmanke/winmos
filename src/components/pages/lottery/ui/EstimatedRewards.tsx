import { useEstimatedLotteryPool } from '../../../utils/queryHooks.ts'
import { Box, Text, Skeleton, HStack } from '@chakra-ui/react'
import EvmosToken from '../../../ui/tokens/EvmosToken.tsx'

const EstimatedRewards = () => {
  const { estimatedLotteryPool, isLoading } = useEstimatedLotteryPool()

  return (
    <Box my='auto' mx='auto' color='white'>
      <Skeleton isLoaded={!isLoading}>
        <Text fontSize='3xl'>Estimated Prize Pool</Text>
        <HStack spacing={3} justifyContent='center'>
          <EvmosToken w='35px' h='35px' />
          <Text fontSize='2xl' fontWeight='bold'>
            {estimatedLotteryPool}
          </Text>
        </HStack>
      </Skeleton>
    </Box>
  )
}

export default EstimatedRewards
