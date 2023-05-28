import { BigNumber } from 'ethers'
import { Address } from 'wagmi'

export const parseBigNumber = (bigNumber: BigNumber) => {
  return parseInt(bigNumber?._hex, 16)
}

export const formatAddress = (address: Address) => {
  return `${address.slice(0, 4)}...${address.slice(address.length - 4)}`
}

export function convertTimeStampToDate(timestampObj: any) {
  // Extract the hexadecimal value from the timestamp object
  const hexValue = timestampObj._hex

  // Remove the "0x" prefix from the hexadecimal value
  const cleanedHexValue = hexValue.replace('0x', '')

  // Convert the cleaned hexadecimal value to decimal
  const decimalValue = parseInt(cleanedHexValue, 16)

  // Convert the decimal value to a Unix timestamp (assuming it represents seconds)
  const unixTimestamp = decimalValue

  // Create a JavaScript Date object from the Unix timestamp
  const date = new Date(unixTimestamp * 1000)

  // Return the date object
  return date
}

export const wrapTxConfirmation = () => {}
