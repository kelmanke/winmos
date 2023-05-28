import { Heading, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { convertTimeStampToDate, parseBigNumber } from '../../../utils/helperFunctions.ts'
import EvmosToken from '../../../ui/tokens/EvmosToken.tsx'

type Props = {
  userWinnings: any[]
}
const UserWinningsTable = ({ userWinnings }: Props) => {
  return (
    <>
      {userWinnings?.length > 0 ? (
        <Table color='white' w='100%' bg='blackAlpha.800' borderRadius={8} boxShadow='0px 0px 10px #FF7F50'>
          <Thead>
            <Tr>
              <Th color='white'>Date</Th>
              <Th color='white'>Amount Won</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userWinnings.map((item: any, index: any) => (
              <Tr key={index} borderTop='2px solid transparent' borderBottom='2px solid transparent'>
                <Td>
                  <Text color='muted'>{convertTimeStampToDate(item.timestamp).toLocaleDateString()}</Text>
                </Td>
                <Td>
                  <HStack spacing={3}>
                    <EvmosToken w='25px' h='25px' />
                    <Text color='muted'>{(parseBigNumber(item.winingAmount) / 1e18).toFixed(10)}</Text>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Heading zIndex={111} color='white' my='auto'>
          No winnings yet.
        </Heading>
      )}
    </>
  )
}

export default UserWinningsTable
