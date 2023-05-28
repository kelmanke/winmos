import useSWR from 'swr'
export const baseURL = import.meta.env.VITE_EVMOS_REST_ENDPOINT
const fetcher = (url: string) => {
  return fetch(url).then((r) => r.json())
}
export const getNextLotteryDraw = () => {
  const { data, error, isLoading } = useSWR(baseURL + 'evmos/epochs/v1/epochs', fetcher)
  return {
    nextLotteryDrawDate: data && new Date(Date.parse(data?.epochs[0].current_epoch_start_time) + 86399000),
    error,
    isLoading
  }
}
