import { Box, Button, Flex, HStack, Input, InputGroup, InputLeftElement, InputRightElement, Text } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import EvmosToken from '../../../../ui/tokens/EvmosToken.tsx'
import { useGenericCard } from './hooks/useGenericCard.ts'
import { useContractUndelegations } from '../../../../utils/queryHooks.ts'

const GenericTxCard = (props: { txType: string }) => {
  const { message, accountBalance, depositData, delegationData, amountError, write, isLoading, amount, setAmount, setAmountError, waitTx } =
    useGenericCard(props.txType)
  const { undelegations } = useContractUndelegations()
  const limitReached = props.txType === 'Exit' && undelegations?.length === 7

  return (
    <Flex color='white' px={5} py={3} flexDir='column'>
      <Flex justifyContent='space-between'>
        <Box>
          <HStack spacing={2} my='auto'>
            <EvmosToken w='20px' h='20px' />
            <Text>TEVMOS</Text>
          </HStack>
          <Text>{`${message}: ${message === 'Deposits' ? depositData : delegationData}`}</Text>
        </Box>
        {(props.txType === 'Withdraw' || props.txType === 'Deposit') && (
          <Box>
            <HStack spacing={2}>
              <EvmosToken w='20px' h='20px' />
              <Text>TEVMOS</Text>
            </HStack>
            <Text>Balance: {accountBalance}</Text>
          </Box>
        )}
      </Flex>
      <HStack py={5} spacing={5}>
        <InputGroup display='flex' borderColor='#FF7F50'>
          <InputLeftElement pointerEvents='none' h='100%' w='70px' children={<EvmosToken w='35px' h='35px' />} />
          <Input
            height='60px'
            bg='#28222F'
            pl='60px'
            fontSize='24px'
            onChange={(e) => {
              const value = e.target.value
              const regex = /^[0-9]*$/
              const isValidInteger = regex.test(value)
              if (value === '' || isValidInteger) {
                setAmount(value)
                setAmountError('')
              } else {
                setAmountError('Please enter a whole number.')
              }
            }}
            placeholder='0'
            value={amount}
          />
          <InputRightElement h='100%' w='100px'>
            <Button fontSize='20px' textColor='white' onClick={() => setAmount(accountBalance)}>
              Max
            </Button>
          </InputRightElement>
        </InputGroup>
      </HStack>
      {amountError && <Text color={'red'}>{amountError}</Text>}
      <HStack spacing={2} justifyContent='flex-end'>
        <Button
          w='100%'
          borderRadius={10}
          fontSize='20px'
          h='50px'
          isLoading={waitTx?.isLoading}
          isDisabled={amountError === "Available amount exceeded" || amount === '' || limitReached}
          onClick={(e) => {
            e.preventDefault()
            write?.()
          }}
        >
          {limitReached ? 'Unbonding Limit Reached' : props.txType}
        </Button>
      </HStack>
      {isLoading && (
        <Box
          position='fixed'
          top='0'
          left='0'
          right='0'
          bottom='0'
          zIndex='999'
          backdropFilter='blur(4px)'
          backgroundColor='rgba(0, 0, 0, 0.6)'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Spinner size='xl' color='white' />
        </Box>
      )}
    </Flex>
  )
}

export default GenericTxCard
