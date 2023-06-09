import { Heading, HStack, Image, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { formatAddress, parseBigNumber } from '../../../utils/helperFunctions.ts'

type Props = {
  allWinners: any[]
}

const AllWinnersTable = ({ allWinners }: Props) => {
  return (
    <>
      {allWinners?.length > 0 ? (
        <Table zIndex={111} w='100%' bg='blackAlpha.800' borderRadius={8}>
          <Thead top={0}>
            <Tr>
              <Th color='white'>Round</Th>
              <Th color='white'>Address</Th>
              <Th color='white'>Amount Won</Th>
              <Th color='white'>Winning Number</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allWinners?.length > 0 ? (
              allWinners.map((item: any, index: any) => (
                <Tr key={index} borderTop='2px solid transparent' borderBottom='2px solid transparent' color='white'>
                  <Td>{item.round}</Td>
                  <Td>
                    <Text color='muted'>{formatAddress(item.winnerAddress)}</Text>
                  </Td>
                  <Td>
                    <HStack spacing={3}>
                      <Image
                        my='auto'
                        w='25px'
                        h='25px'
                        src={'https://assets.coingecko.com/coins/images/24023/large/evmos.png?1653958927'}
                      />
                      <Text color='muted'>{(parseBigNumber(item.winingAmount) / 1e18).toFixed(3)}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Text color='muted'>{parseBigNumber(item.winningNumber)}</Text>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td>
                  <Text color='orange.200'>No winners selected.</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      ) : (
        <Heading zIndex={111} color='white' my='auto'>
          No winners yet.
        </Heading>
      )}
    </>
  )
}

export default AllWinnersTable
