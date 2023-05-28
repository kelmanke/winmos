import { Tab, TabList, Tabs, TabPanels, TabPanel, TabIndicator, Box } from '@chakra-ui/react'
import GenericTxCard from './GenericTxCard.tsx'

const DepositWithdrawCard = () => {
  return (
    <Box p={2} bg='#242124' borderRadius={8} boxShadow='0px 4px 10px #FF7F50;'>
      <Tabs isFitted position='relative' variant='unstyled' _focus={{ boxShadow: 'none' }}>
        <TabList color='#FF7F50' _focus={{ boxShadow: 'none' }}>
          <Tab _focus={{ boxShadow: 'none', _focus: 'none' }}>Enter</Tab>
          <Tab
            _focus={{
              boxShadow: 'none',
              _focus: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            Exit
          </Tab>
        </TabList>
        <TabIndicator mt='-1.5px' height='2px' bg='#FF7F50' borderRadius='1px' />
        <TabPanels>
          <TabPanel>
            <GenericTxCard txType='Enter' />
          </TabPanel>
          <TabPanel>
            <GenericTxCard txType='Exit' />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default DepositWithdrawCard
