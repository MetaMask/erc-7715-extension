"use client";

import { useCallback, useState } from "react";
import {
  RequestExecutionPermissionsReturnType,
  erc7710BundlerActions,
  erc7715ProviderActions,
} from "@metamask/smart-accounts-kit/actions";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { Hex, parseEther } from "viem";
import { createPublicClient, http } from "viem";
import { createBundlerClient } from "viem/account-abstraction";
import { sepolia } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { useSessionAccount } from "~~/app/erc-7715-permissions/providers/SessionAccountProvider";

export const usePermissions = () => {
  const [grantedPermissions, setGrantedPermissions] = useState<RequestExecutionPermissionsReturnType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address } = useAccount();
  const { sessionAccount } = useSessionAccount();
  const { data: walletClient } = useWalletClient();

  const requestPermission = useCallback(async () => {
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    if (!sessionAccount) {
      setError("Session account not ready");
      return;
    }

    if (!walletClient) {
      setError("Wallet client not ready");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const client = walletClient!.extend(erc7715ProviderActions());

      const currentTime = Math.floor(Date.now() / 1000);
      // 1 day in seconds.
      const periodDuration = 86400;
      // 30 days in seconds.
      const expiry = currentTime + 30 * 86400;

      const permission = await client.requestExecutionPermissions([
        {
          chainId: sepolia.id,
          expiry,
          signer: {
            type: "account",
            data: {
              address: sessionAccount.address as `0x${string}`,
            },
          },
          isAdjustmentAllowed: true,
          permission: {
            type: "native-token-periodic",
            data: {
              periodAmount: parseEther("0.001"),
              periodDuration,
              justification: "Request permisison to spend 0.001 ETH per day",
              startTime: currentTime,
            },
          },
        },
      ]);

      setGrantedPermissions(permission);
    } catch (err: any) {
      setError(err.message || "Failed to request permission");
      console.error("Permission request error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [address, sessionAccount, walletClient]);

  const redeemPermission = useCallback(async () => {
    if (!grantedPermissions) {
      setError("Permission not found");
      return;
    }

    if (!sessionAccount) {
      setError("Session account not available");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const pimlicoKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
      if (!pimlicoKey) {
        throw new Error("Pimlico API key not configured");
      }

      const bundlerClient = createBundlerClient({
        transport: http(`https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${pimlicoKey}`),
        paymaster: true,
      }).extend(erc7710BundlerActions());

      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
      });

      const pimlicoClient = createPimlicoClient({
        transport: http(`https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${pimlicoKey}`),
      });

      const { fast: fee } = await pimlicoClient.getUserOperationGasPrice();

      const hash = await bundlerClient.sendUserOperationWithDelegation({
        publicClient,
        account: sessionAccount,
        calls: [
          {
            to: sessionAccount.address as Hex,
            value: parseEther("0.0000001"),
            permissionsContext: grantedPermissions[0].context,
            delegationManager: grantedPermissions[0].signer.data.address,
          },
        ],
        ...fee,
      });

      const { receipt } = await bundlerClient.waitForUserOperationReceipt({
        hash,
      });

      setTxHash(receipt.transactionHash);
    } catch (err: any) {
      setError(err.message || "Failed to redeem permission");
      console.error("Permission redeem error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [grantedPermissions, sessionAccount]);

  return {
    grantedPermissions,
    isLoading,
    error,
    txHash,
    requestPermission,
    redeemPermission,
  };
};
