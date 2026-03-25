# Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- Rust and Cargo
- Soroban CLI
- pnpm >= 8.0.0

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install:all
   ```

2. **Build contracts:**
   ```bash
   cd contracts
   cargo build --target wasm32-unknown-unknown
   ```

3. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

4. **Build indexer:**
   ```bash
   cd indexer
   npm run build
   ```

## Contract Deployment

### 1. Deploy to Stellar Testnet

```bash
# Set network
soroban config network testnet

# Deploy NFT contract
soroban contract deploy target/wasm32-unknown-unknown/release/stellar_nft_marketplace_contracts.wasm

# Deploy Marketplace contract
soroban contract deploy target/wasm32-unknown-unknown/release/marketplace.wasm

# Deploy Metadata contract
soroban contract deploy target/wasm32-unknown-unknown/release/metadata.wasm
```

### 2. Update Configuration

Copy the deployed contract addresses to:

- `frontend/.env.local`
- `indexer/.env`

## Running the Application

### Frontend Development Server
```bash
cd frontend
npm run dev
```
Visit: http://localhost:3000

### Indexer Service
```bash
cd indexer
npm run dev
```
API available at: http://localhost:3001

### API Endpoints

- `GET /health` - Health check
- `GET /nfts` - List NFTs with pagination
- `GET /nfts/:tokenId` - Get specific NFT
- `GET /listings` - Get marketplace listings
- `GET /events` - Get contract events

## Contract Integration

### Frontend Configuration

Update `frontend/src/hooks/useContract.ts` with deployed contract addresses:

```typescript
const NFT_CONTRACT = 'YOUR_NFT_CONTRACT_ADDRESS'
const MARKETPLACE_CONTRACT = 'YOUR_MARKETPLACE_CONTRACT_ADDRESS'
const METADATA_CONTRACT = 'YOUR_METADATA_CONTRACT_ADDRESS'
```

### Indexer Configuration

Update `indexer/src/eventListener.ts` to listen to deployed contracts:

```typescript
const contracts = [
  NFT_CONTRACT_ADDRESS,
  MARKETPLACE_CONTRACT_ADDRESS,
  METADATA_CONTRACT_ADDRESS
]
```

## Testing

### Contract Tests
```bash
cd contracts
cargo test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Indexer Tests
```bash
cd indexer
npm test
```

## Production Deployment

### Frontend
Deploy to Vercel, Netlify, or similar platform.

### Indexer
Deploy to Railway, Heroku, or similar Node.js hosting.

### Environment Variables
Ensure all production environment variables are set:

- Contract addresses
- Stellar network configuration
- Database connection strings
- API endpoints

## Troubleshooting

### Common Issues

1. **Build fails**: Check Rust and Node.js versions
2. **Contract deployment fails**: Ensure sufficient testnet XLM balance
3. **Frontend errors**: Verify environment variables are set
4. **Indexer not working**: Check database permissions and Stellar RPC URL

### Getting Testnet XLM

Use the Stellar testnet faucet to get XLM for testing:
https://friendbot.stellar.org/

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │   Indexer      │    │   Contracts     │
│   (Next.js)    │◄──►│   (Node.js)    │◄──►│   (Soroban)    │
│   Port: 3000   │    │   Port: 3001   │    │   Stellar       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Next Steps

1. Implement complete contract logic
2. Add IPFS integration for metadata
3. Implement wallet connection (Freighter, etc.)
4. Add real-time updates via WebSocket
5. Implement trading functionality
6. Add NFT creation with image upload
7. Implement user profiles and collections
