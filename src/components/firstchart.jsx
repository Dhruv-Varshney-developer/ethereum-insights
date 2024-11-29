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
import { Card, CardContent, Typography } from "@mui/material";

const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const BLOCKS_TO_FETCH = 10;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

async function fetchWithRetry(
  fn,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
}

async function fetchTokenTransfers(tokenAddress, fromBlock, toBlock) {
  return fetchWithRetry(() =>
    alchemy.core.getAssetTransfers({
      fromBlock: fromBlock,
      toBlock: toBlock,
      contractAddresses: [tokenAddress],
      category: ["erc20"],
    })
  );
}

export default function ERC20TransferVolumeChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestBlock = await alchemy.core.getBlockNumber();
        const fromBlock = latestBlock - BLOCKS_TO_FETCH;

        let newChartData = [];
        for (let i = 0; i <= BLOCKS_TO_FETCH; i++) {
          const blockNumber = fromBlock + i;
          const transfers = await fetchTokenTransfers(
            USDC_ADDRESS,
            blockNumber,
            blockNumber
          );
          const totalVolume = transfers.transfers.reduce(
            (sum, transfer) => sum + parseFloat(transfer.value),
            0
          );

          newChartData.push({
            blockNumber,
            volume: totalVolume,
          });

          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        setChartData(newChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 20000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card elevation={3} sx={{ mt: 4, mx: "auto", maxWidth: 800 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          ERC20 Transfer Volume (USDC)
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="blockNumber" />
            <YAxis />
            <Tooltip animationDuration={500} />
            <Legend />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#3f51b5"
              strokeWidth={2}
              activeDot={{ r: 10 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
