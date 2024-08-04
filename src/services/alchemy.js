import { Network, Alchemy } from "alchemy-sdk";
import { apikey } from "./apikey.js";

const settings = {
  apiKey: apikey,
  network: Network.ETH_MAINNET,
};
export const alchemy = new Alchemy(settings);

alchemy.core.getBlockNumber("finalized").then(console.log);
