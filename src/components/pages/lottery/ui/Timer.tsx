import { Box, Flex, Skeleton, Text } from '@chakra-ui/react'
import Countdown from 'react-countdown'
import { getNextLotteryDraw } from '../../../../api/evmos.ts'

const Timer = () => {
  const { nextLotteryDrawDate, isLoading } = getNextLotteryDraw()
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <Text>Drawing winners please stand by</Text>
    } else {
      // Render a countdown
      return (
        <Text fontSize='5xl'>
          {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Text>
      )
    }
  }

  return (
    <Flex color={'white'} w={'full'}>
      <Box my='auto' mx='auto'>
        <Skeleton isLoaded={!isLoading}>
          <Text fontSize='3xl'>The next lottery draw is in:</Text>
          <Countdown zeroPadTime={2} date={nextLotteryDrawDate} renderer={renderer} />
        </Skeleton>
      </Box>
    </Flex>
  )
}

export default Timer
