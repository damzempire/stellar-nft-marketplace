# Stellar NFT Marketplace

A complete NFT marketplace built on Stellar using Soroban smart contracts.

## Structure

- `contracts/` - Soroban Rust smart contracts
- `frontend/` - Next.js TypeScript web application
- `indexer/` - Node.js event indexing service

## Quick Start

```bash
# Install dependencies
pnpm install:all

# Start development servers
pnpm dev              # Frontend dev server
pnpm dev:indexer      # Indexer service

# Build contracts
pnpm --filter contracts build
```

## Features

- NFT minting and trading on Stellar
- IPFS metadata storage
- Real-time event indexing
- Modern web interface

## Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Rust and Soroban CLI for contract development
