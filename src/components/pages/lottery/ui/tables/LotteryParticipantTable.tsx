import { Heading, HStack, Skeleton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { useLotteryParticipants } from './hooks/useLotteryParticipants.ts'
import EvmosToken from '../../../../ui/tokens/EvmosToken.tsx'

const LotteryParticipantTable = () => {
  const { delegationData, totalStaked, address, isLoading } = useLotteryParticipants()
  if (delegationData?.length === 0) {
    return (
      <Heading mx='auto' color='white'>
        No Participants
      </Heading>
    )
  } else {
    return (
      <Skeleton isLoaded={!isLoading}>
        <Table maxH={'100%'} color='white' bgColor='blackAlpha.600' borderRadius={8} boxShadow='0px 0px 10px #FF7F50'>
          <Thead top={0}>
            <Tr>
              <Th color='white'>Address</Th>
              <Th color='white'>Amount</Th>
              <Th color='white'>Chance of Winning</Th>
            </Tr>
          </Thead>
          <Tbody>
            {delegationData?.length > 0 &&
              delegationData.map((item: any, index: any) => (
                <Tr key={index} borderBottom='2px solid transparent' borderTop='2px solid transparent'>
                  <Td>
                    <Text color='muted'>{item.address === address ? `${item.address} (Me)` : item.address}</Text>
                  </Td>
                  <Td>
                    <HStack spacing={3}>
                      <EvmosToken w='25px' h='25px' />
                      <Text color='white' my='auto' fontSize='lg'>
                        {item.delegatedAmount}
                      </Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Text color='muted'>{(item.chance / totalStaked).toFixed(2)} %</Text>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Skeleton>
    )
  }
}

export default LotteryParticipantTable
