"use client";

import { Button } from "~~/app/erc-7715-permissions/_components/Button";
import { PermissionBlock } from "~~/app/erc-7715-permissions/_components/PermissionBlock";
import { usePermissions } from "~~/app/erc-7715-permissions/hooks/usePermissions";

export const Steps = (): React.JSX.Element => {
  const { grantedPermissions, isLoading, error, txHash, requestPermission, redeemPermission } = usePermissions();

  return (
    <div className="flex flex-col gap-6 lg:gap-8 py-6 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-base-content">ERC-7715 Permissions</h1>
        <p className="mt-2 text-base text-base-content">Execute transactions on behalf of MetaMask users</p>
      </div>

      <div className="w-full flex flex-col min-h-screen gap-4">
        {grantedPermissions && (
          <div className="w-full max-w-2xl">
            <div className="border-2 border-base-300 rounded-lg p-8 bg-base-100">
              <h3 className="text-xl font-semibold text-base-content mb-2">Approved Permission</h3>

              <div className="space-y-4">
                <PermissionBlock permission={grantedPermissions} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full max-w-2xl">
            <div className="border-2 border-error rounded-lg p-8 bg-base-100">
              <div className="text-error">
                <p className="font-semibold mb-2">Error:</p>
                <p className="text-sm break-words whitespace-pre-wrap max-h-32 overflow-auto">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl flex flex-col gap-6 justify-center">
          {!grantedPermissions && (
            <div className="w-full max-w-2xl flex flex-col gap-6 justify-center items-center text-center">
              <p className="text-base-content">
                Please make sure your account is upgraded to a smart account before requesting permissions.
                <a
                  href="hhttps://support.metamask.io/configure/accounts/switch-to-or-revert-from-a-smart-account/#how-to-switch-to-a-metamask-smart-account"
                  target="_blank"
                  className="text-primary hover:text-accent"
                >
                  <> </>Learn more about how to upgrade your account.
                </a>
              </p>
              <Button disabled={isLoading} onClick={requestPermission}>
                {isLoading ? "Processing..." : "Request Permissions"}
              </Button>
            </div>
          )}

          {txHash && (
            <Button
              disabled={false}
              onClick={() => {
                window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank");
              }}
            >
              View on Etherscan
            </Button>
          )}

          {grantedPermissions && (
            <Button disabled={isLoading} onClick={redeemPermission}>
              {isLoading ? "Processing..." : "Transfer 0.0000001 ETH on behalf of the user"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
