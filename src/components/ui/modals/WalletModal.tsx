import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  VStack,
  StackDivider,
  Flex,
  Text,
  Image
} from '@chakra-ui/react'
import { supportedWallets } from '../../../config/wallets.ts'
import { useConnect } from 'wagmi'

export const WalletModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { connect, connectors } = useConnect()

  return (
    <>
      <Button rounded='xl' onClick={onOpen}>
        Connect
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch'>
              {supportedWallets.map((wallet, key) => {
                const connector = connectors[key]
                return (
                  <Flex
                    key={key}
                    borderRadius={8}
                    p={2}
                    onClick={() => connect({ connector })}
                    cursor='pointer'
                    sx={{
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        textColor: 'white',
                        backgroundColor: 'black'
                      }
                    }}
                  >
                    <Image src={wallet.img} boxSize='50px' />
                    <Text my='auto' px={5}>
                      {wallet.name}
                    </Text>
                  </Flex>
                )
              })}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
