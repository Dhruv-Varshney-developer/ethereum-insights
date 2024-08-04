import React from "react";
import ERC20TransferVolumeChart from "./components/firstchart.jsx";
import BaseFeeChart from "./components/secondchart.jsx";
import GasUsageRatioChart from "./components/thirdchart.jsx";

function App() {
  return (
    <div className="App">
      <h1>ERC20 Token Transfer Volume Monitor</h1>
      <ERC20TransferVolumeChart />
      <BaseFeeChart />
      <GasUsageRatioChart />

    </div>
  );
}

export default App;
