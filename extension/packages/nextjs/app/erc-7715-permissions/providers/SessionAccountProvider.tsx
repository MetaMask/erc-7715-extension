"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Implementation, MetaMaskSmartAccount, toMetaMaskSmartAccount } from "@metamask/delegation-toolkit";
import { Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { usePublicClient } from "wagmi";

export const SessionAccountContext = createContext({
  sessionAccount: null as MetaMaskSmartAccount | null,
});

export const SessionAccountProvider = ({ children }: { children: React.ReactNode }) => {
  const publicClient = usePublicClient();
  const [sessionAccount, setSessionAccount] = useState<MetaMaskSmartAccount | null>(null);

  const createSessionAccount = useCallback(async () => {
    if (!publicClient) return;
    const account = privateKeyToAccount(generatePrivateKey());

    const smartAccount = await toMetaMaskSmartAccount({
      client: publicClient,
      implementation: Implementation.Hybrid,
      deployParams: [account.address as Hex, [], [], []],
      deploySalt: "0x",
      signer: { account },
    });

    setSessionAccount(smartAccount);
  }, [publicClient]);

  useEffect(() => {
    createSessionAccount();
  }, []);

  return <SessionAccountContext.Provider value={{ sessionAccount }}>{children}</SessionAccountContext.Provider>;
};

export const useSessionAccount = () => {
  return useContext(SessionAccountContext);
};
