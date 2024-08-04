import React, { useState, useEffect } from 'react';
import { alchemy } from "../services/alchemy";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const BLOCKS_TO_FETCH = 10;

async function fetchTokenTransfers(tokenAddress, fromBlock, toBlock) {
  const transfers = await alchemy.core.getAssetTransfers({
    fromBlock: fromBlock,
    toBlock: toBlock,
    contractAddresses: [tokenAddress],
    category: ["erc20"],
  });
  return transfers.transfers;
}

export default function ERC20TransferVolumeChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const latestBlock = await alchemy.core.getBlockNumber();
      const fromBlock = latestBlock - BLOCKS_TO_FETCH;
      
      let newChartData = [];
      
      for (let i = 0; i <= BLOCKS_TO_FETCH; i++) {
        const blockNumber = fromBlock + i;
        const transfers = await fetchTokenTransfers(USDC_ADDRESS, blockNumber, blockNumber);
        const totalVolume = transfers.reduce((sum, transfer) => sum + parseFloat(transfer.value), 0);
        
        newChartData.push({
          blockNumber,
          volume: totalVolume,
        });
      }
      
      setChartData(newChartData);
    };

    fetchData();
    
    // Set up an interval to fetch new data every 15 seconds
    const intervalId = setInterval(fetchData, 15000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">ERC20 Transfer Volume (USDC)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="blockNumber" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}