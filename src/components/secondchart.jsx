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

async function fetchBaseFee(blockNumber) {
  const block = await alchemy.core.getBlock(blockNumber);
  return block.baseFeePerGas; // This returns the BASEFEE
}

export default function BaseFeeChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const latestBlock = await alchemy.core.getBlockNumber();
      const fromBlock = latestBlock - BLOCKS_TO_FETCH;

      let newChartData = [];

      for (let i = 0; i <= BLOCKS_TO_FETCH; i++) {
        const blockNumber = fromBlock + i;
        const baseFee = await fetchBaseFee(blockNumber);

        newChartData.push({
          blockNumber,
          baseFee: parseFloat(baseFee) / 1e9, // Convert from wei to Gwei
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
