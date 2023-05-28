import { Flex, Text, Container } from '@chakra-ui/react'
import { useGetParticipants } from '../../../utils/queryHooks'

const NumberOfParticipants = () => {
  const { participansData } = useGetParticipants()
  return (
    <Container>
      <Flex borderRadius={8} borderWidth='1px' px={5} py={5} flexDir='column' bg='white'>
        <Text>Currently there are {participansData && participansData.length} participants in the lottery</Text>
      </Flex>
    </Container>
  )
}

export default NumberOfParticipants
