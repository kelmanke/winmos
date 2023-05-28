import { Tab, TabList, Tabs, TabPanels, TabPanel, TabIndicator, Box } from '@chakra-ui/react'
import GenericTxCard from './GenericTxCard.tsx'

const DepositWithdrawCard = () => {
  return (
    <Box p={2} bg='#242124' borderRadius={8} boxShadow='0px 4px 10px #FF7F50;'>
      <Tabs isFitted position='relative' variant='unstyled'>
        <TabList color='#FF7F50'>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
        </TabList>
        <TabIndicator mt='-1.5px' height='2px' bg='#FF7F50' borderRadius='1px' />
        <TabPanels>
          <TabPanel>
            <GenericTxCard txType='Deposit' />
          </TabPanel>
          <TabPanel>
            <GenericTxCard txType='Withdraw' />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default DepositWithdrawCard
