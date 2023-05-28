import { watchContractEvent } from "@wagmi/core";
import { lotteryContractMain } from "../config/contracts";

export const startEventListenerNLL = (
  eventName: string,
  callback: (address: any, amount: any, eventType: any) => void
) => {
  const unwatch = watchContractEvent(
    { ...lotteryContractMain, eventName },
    (address: any, amount: any) => {
      callback(address, amount, eventName);
    }
  );

  return {
    unwatch,
  };
};
