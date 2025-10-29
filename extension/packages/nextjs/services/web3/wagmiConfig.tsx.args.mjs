export const preContent = `
import { metaMask } from "wagmi/connectors";
`;

export const configOverrides = {
    connectors: ["$$metaMask()$$"],
};