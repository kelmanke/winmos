import { HStack, Image, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'

type Props = {
  unbondingRequests: any[]
}
const PendingUnbondedTable = ({ unbondingRequests }: Props) => {
  return (
    <Table
      boxShadow='0px 4px 10px #FF7F50;'
      maxH={'100%'}
      width='fit-content'
      mx='auto'
      mt={10}
      zIndex={111}
      color='white'
      backgroundColor='blackAlpha.600'
      borderRadius={8}
    >
      <Thead top={0}>
        <Tr>
          <Th color='white'>Amount</Th>
          <Th color='white'>Unbonding Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {unbondingRequests?.length > 0 ? (
          unbondingRequests.map((item: any, index) => (
            <Tr key={index} borderTop='2px solid transparent' borderBottom='2px solid transparent'>
              <Td>
                <HStack spacing={3}>
                  <Image my='auto' w='25px' h='25px' src={'https://assets.coingecko.com/coins/images/24023/large/evmos.png?1653958927'} />
                  <Text color='muted' fontSize='lg'>
                    {item.amount}
                  </Text>
                </HStack>
              </Td>
              <Td>
                <Text color='muted'>
                  {new Date(item.completionTime).toDateString() + ' ' + new Date(item.completionTime).toLocaleTimeString()}
                </Text>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td>
              <Text color='orange.200'>No unbonding requests yet.</Text>
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  )
}

export default PendingUnbondedTable
