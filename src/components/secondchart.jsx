import React, { useState, useEffect } from "react";
import { alchemy } from "../services/alchemy";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BLOCKS_TO_FETCH = 10;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

async function fetchWithRetry(fn, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
}

async function fetchBaseFee(blockNumber) {
  return fetchWithRetry(() => alchemy.core.getBlock(blockNumber));
}

export default function BaseFeeChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestBlock = await alchemy.core.getBlockNumber();
        const fromBlock = latestBlock - BLOCKS_TO_FETCH;

        let newChartData = [];

        for (let i = 0; i <= BLOCKS_TO_FETCH; i++) {
          const blockNumber = fromBlock + i;
          const block = await fetchBaseFee(blockNumber);
          const baseFee = block.baseFeePerGas;

          newChartData.push({
            blockNumber,
            baseFee: parseFloat(baseFee) / 1e9, // Convert from wei to Gwei
          });

          // Add a delay between requests
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        setChartData(newChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to set an error state here if you want to show a user-friendly message
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 20000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Base Fee per Block</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="blockNumber" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="baseFee"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}