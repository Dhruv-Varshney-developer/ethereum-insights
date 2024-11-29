import { Network, Alchemy } from "alchemy-sdk";
import { APIKEY } from "./apikey.js";

const settings = {
  apiKey: APIKEY,
  network: Network.ETH_MAINNET,
};
export const alchemy = new Alchemy(settings);
