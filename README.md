# Stellar NFT Marketplace

A decentralized NFT marketplace built on the Stellar blockchain using Soroban smart contracts. Mint, buy, and sell NFTs with XLM. No Ethereum, no Solidity - pure Stellar ecosystem.

## Structure

This is a monorepo containing:

- **`/contracts/`** - Soroban Rust smart contracts
- **`/frontend/`** - Next.js web application
- **`/indexer/`** - Node.js event indexing service

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Rust and Soroban CLI
- SQLite (for indexer)

### Installation

```bash
# Clone the repository
git clone https://github.com/damzempire/stellar-nft-marketplace.git
cd stellar-nft-marketplace

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration
```

### Development

```bash
# Start all services in development mode
pnpm dev

# Or start individual services:
pnpm --filter contracts dev    # Build contracts
pnpm --filter frontend dev     # Start frontend
pnpm --filter indexer dev      # Start indexer
```

### Building

```bash
# Build all packages
pnpm build

# Build individual packages:
pnpm --filter contracts build  # Build contracts
pnpm --filter frontend build   # Build frontend
pnpm --filter indexer build    # Build indexer
```

## Tech Stack

### Smart Contracts
- **Rust** - Contract language
- **Soroban SDK** - Stellar smart contract framework
- **Stellar Testnet** - Development network

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@stellar/stellar-sdk** - Stellar client library
- **soroban-client** - Contract interaction

### Indexer
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Express** - API server
- **SQLite** - Database
- **@stellar/stellar-sdk** - Stellar client library

## Features

- ✅ NFT minting on Stellar
- ✅ Marketplace listings
- ✅ Buy/sell functionality
- ✅ IPFS metadata support
- ✅ Event indexing
- ✅ REST API
- ✅ Responsive web interface
- ✅ Wallet connectivity

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Stellar Network
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
CONTRACT_ADDRESS=your_contract_address

# Frontend
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address

# Indexer
PORT=3001
DATABASE_URL=./nft_marketplace.db
```

## Deployment

### Smart Contracts

```bash
cd contracts

# Build contracts
soroban build

# Deploy to testnet
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/stellar_nft_marketplace_contracts.wasm --source your_account --network testnet

# Initialize contract
soroban contract invoke --id CONTRACT_ID --source your_account --network testnet -- initialize --admin your_public_key
```

### Frontend

```bash
cd frontend

# Build for production
pnpm build

# Deploy to Vercel/Netlify
```

### Indexer

```bash
cd indexer

# Build
pnpm build

# Run in production
pnpm start
```

## API Endpoints

The indexer provides the following REST API endpoints:

- `GET /health` - Health check
- `GET /nfts` - Get all NFTs
- `GET /nfts/:tokenId` - Get specific NFT
- `GET /nfts/owner/:address` - Get NFTs by owner
- `GET /listings` - Get active listings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Stellar Testnet Faucet](https://friendbot.stellar.org/)
- [IPFS Documentation](https://docs.ipfs.io/)
