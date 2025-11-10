# MetaMask Advanced Permissions (ERC-7715) Extension for Scaffold-ETH 2

MetaMask's Advanced Permissions (ERC-7715) lets you request fine-grained permissions from a MetaMask user 
to execute transactions on their behalf. For example, a user can grant your dapp permission to 
spend 10 USDC per day to buy ETH over the course of a month. Once the permission is granted, 
your dapp can use the allocated 10 USDC each day to purchase ETH directly from the MetaMask 
user's account.

This extension demonstrates the end-to-end flow for requesting a permisison, and executing transaction on the user's behalf under the given scope of the permission. 

[Learn how to execute transaction on MetaMask user's behalf](https://docs.metamask.io/smart-accounts-kit/guides/erc7715/execute-on-metamask-users-behalf/).

## Installation

```bash
npx create-eth@latest -e metamask/erc-7715-extension
```
