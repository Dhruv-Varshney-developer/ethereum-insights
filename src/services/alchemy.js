import { Network, Alchemy } from "alchemy-sdk";
import 'dotenv/config'


const apiKey = process.env.ALCHEMY_API_KEY;

const settings = {
  apiKey: apiKey,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

alchemy.core.getBlockNumber("finalized").then(console.log);