import { Button, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export const TabsWithLine = () => {
  const tabs = ['lottery', 'winners', 'unbonding']
  const navigate = useNavigate()
  return (
    <HStack spacing='3'>
      {tabs.map((tab, index) => (
        <Button
          key={index}
          color='white'
          bg='transparent'
          borderRadius='xl'
          onClick={() => navigate(`/${tab}`)}
          _hover={{ boxShadow: 'lg', bg: 'whiteAlpha.200' }}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Button>
      ))}
    </HStack>
  )
}
