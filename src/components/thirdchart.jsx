import React, { useState, useEffect } from 'react';
import { alchemy } from "../services/alchemy";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BLOCKS_TO_FETCH = 10;

async function fetchGasData(blockNumber) {
  const block = await alchemy.core.getBlock(blockNumber);
  return {
    gasUsed: block.gasUsed,
    gasLimit: block.gasLimit,
  };
}

function calculateGasRatio(gasUsed, gasLimit) {
  return (gasUsed / gasLimit) * 100; // Returns percentage
}

export default function GasUsageRatioChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const latestBlock = await alchemy.core.getBlockNumber();
      const fromBlock = latestBlock - BLOCKS_TO_FETCH;
      
      let newChartData = [];
      
      for (let i = 0; i <= BLOCKS_TO_FETCH; i++) {
        const blockNumber = fromBlock + i;
        const { gasUsed, gasLimit } = await fetchGasData(blockNumber);
        const gasRatio = calculateGasRatio(gasUsed, gasLimit);
        
        newChartData.push({
          blockNumber,
          gasRatio: parseFloat(gasRatio.toFixed(2)),
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
      <h2 className="text-xl font-bold mb-4">Gas Usage Ratio (gasUsed / gasLimit)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="blockNumber" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="gasRatio" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}