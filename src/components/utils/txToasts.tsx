import { Flex, Link, Text, useToast } from '@chakra-ui/react'

export const useDisplayToast = () => {
  const toast = useToast()
  const displayToast = ({ title, status, hash }: any) => {
    toast({
      isClosable: true,
      duration: 8000,
      render: () => (
        <Flex color='white' flexDir='column' borderRadius={8} bgColor={status === 0 ? '#317873' : 'red'} p={3}>
          <Text my='auto' mx='auto' fontWeight='bold'>
            {status === 0 ? 'Transaction Successful' : 'Transaction Failed'}
          </Text>
          <Text mx='auto' my='auto'>
            {title}
          </Text>
          <Text mx='auto' my='auto'>
            <Link isExternal href={`https://testnet.escan.live/tx/${hash}`}>
              Tx Hash: {hash.slice(0, 4)}....{hash.slice(hash.length - 4)}
            </Link>
          </Text>
        </Flex>
      )
    })
  }

  return { displayToast }
}
