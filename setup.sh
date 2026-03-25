#!/bin/bash

echo "🚀 Setting up Stellar NFT Marketplace..."

# Install Rust and Soroban CLI if not present
if ! command -v cargo &> /dev/null; then
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source ~/.cargo/env
fi

# Install Soroban CLI
if ! command -v soroban &> /dev/null; then
    echo "Installing Soroban CLI..."
    cargo install soroban-cli
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install -g pnpm
pnpm install

# Build contracts
echo "Building contracts..."
cd contracts && cargo build --target wasm32-unknown-unknown && cd ..

# Build frontend
echo "Building frontend..."
cd frontend && npm run build && cd ..

# Build indexer
echo "Building indexer..."
cd indexer && npm run build && cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy contracts: cd contracts && soroban contract deploy"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Start indexer: cd indexer && npm run dev"
echo ""
echo "Don't forget to update .env files with contract addresses!"
