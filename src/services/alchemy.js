import { Network, Alchemy } from "alchemy-sdk";
import { apikey } from "./apikey";
const apiKey = apikey;

const settings = {
  apiKey: apiKey,
  network: Network.ETH_MAINNET,
};
export const alchemy = new Alchemy(settings);

alchemy.core.getBlockNumber("finalized").then(console.log);
