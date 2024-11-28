# Real-Time Ethereum Blockchain Analytics Dashboard

## Project Overview

Ethereum Insights is a sophisticated React-based application that provides in-depth, real-time visualization of key Ethereum network metrics. By leveraging the Alchemy Web3 API, the dashboard offers granular insights into blockchain dynamics through three critical metrics.

## Technical Architecture

### Data Source
- **Provider**: Alchemy Web3 API
- **Network**: Ethereum Mainnet
- **Token**: USDC (ERC20 Token)
- **Endpoint**: Ethereum JSON-RPC via Alchemy Core

## Key Performance Metrics

### 1. ERC20 Token Transfer Volume Chart
- **Data Point**: Total USDC transfer volume per block
- **Calculation Method**: 
  ```
  Total Volume = Σ(individual transfer values)
  ```
- **Retrieval Mechanism**: 
  - `alchemy.core.getAssetTransfers()`
  - Filters for ERC20 category
  - Specific contract address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (USDC)

### 2. Base Fee per Block Chart
- **Data Point**: Base fee in Gwei
- **Conversion Formula**: 
  ```
  Base Fee (Gwei) = BaseFeePerGas / 10^9
  ```
- **EIP 1559 Significance**: 
  - Implements dynamic block sizing
  - Provides more predictable transaction pricing
  - Introduces burn mechanism for ETH

### 3. Gas Usage Ratio Chart
- **Data Point**: Percentage of block gas capacity utilized
- **Calculation Formula**:
  ```
  Gas Usage Ratio = (gasUsed / gasLimit) * 100%
  ```
- **Blockchain Efficiency Indicator**:
  - Shows block congestion levels
  - Helps predict transaction confirmation times

## Technical Implementation Details

### Fetch Strategy
- **Blocks Fetched**: Latest 10 blocks
- **Update Interval**: 20 seconds
- **Retry Mechanism**: 
  - Maximum 3 retries
  - Exponential backoff delay
  - Prevents API rate limiting

### Error Handling
- Custom `fetchWithRetry()` function
- Graceful error logging
- Prevents application crash during data retrieval

### Performance Optimizations
- Asynchronous data fetching
- Responsive container for cross-device compatibility
- Animated line charts for smooth user experience

## Dependencies

### Frontend
- React
- Recharts (Visualization)
- Material-UI (Component Styling)

### Blockchain Interaction
- Alchemy Web3 SDK
- Ethereum JSON-RPC

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- Alchemy API Key
- Ethereum Mainnet Access

### Installation Steps
1. Clone the repository
2. Install dependencies: 
   ```bash
   yarn install
   ```
3. Configure Alchemy API credentials
4. Run development server: 
   ```bash
   yarn start
   ```

## Blockchain Concepts Demonstrated
- Web3 data retrieval
- Real-time blockchain monitoring
- ERC20 token transfer tracking
- Ethereum network fee mechanics