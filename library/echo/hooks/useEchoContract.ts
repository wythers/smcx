import { Echo } from '../contract/echo';
import { useAsyncInitialize } from './useAsync';
import { Address, OpenedContract, toNano, Sender, SenderArguments } from '@ton/core';
import { useState } from 'react';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { TonClient } from "@ton/ton";
import configObj from '../config.json'


export function useEchoContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();
  const [status, setStatus] = useState("standby");

  const echoContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Echo(
      Address.parse(configObj.echoAddress)
    );
    return client.open(contract) as OpenedContract<Echo>;
  }, [client]);

  return {
    status: status,
    sendEchoableTON: async (v: string) => {
      try {
        setStatus("processing");
        await echoContract?.sendEchoableTON(sender, toNano(v))
      } catch (e) {
        setStatus("standby");
        return;
      }
      setStatus("done");
    },
  };
}

function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: 'mainnet' }),
      })
  );
}

function useTonConnect(): { sender: Sender } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        const result = await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        });

        if (result.boc == "") {
          throw new Error("Echo: Transaction Number exeception.")
        }
      },
    }
  };
}