import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { SorobanClient } from 'soroban-client'
import { Database } from './db'
import { EventListener } from './eventListener'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
const db = new Database()

// Initialize Soroban client
const sorobanClient = new SorobanClient('https://soroban-testnet.stellar.org')

// Initialize event listener
const eventListener = new EventListener(sorobanClient, db)

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.get('/nfts', async (req, res) => {
  try {
    const { page = 1, limit = 20, owner, creator } = req.query
    
    // TODO: Implement NFT listing with pagination and filters
    const nfts = await db.getNFTs({
      page: Number(page),
      limit: Number(limit),
      owner: owner as string,
      creator: creator as string
    })
    
    res.json(nfts)
  } catch (error) {
    console.error('Error fetching NFTs:', error)
    res.status(500).json({ error: 'Failed to fetch NFTs' })
  }
})

app.get('/nfts/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params
    
    // TODO: Get specific NFT by token ID
    const nft = await db.getNFTById(Number(tokenId))
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' })
    }
    
    res.json(nft)
  } catch (error) {
    console.error('Error fetching NFT:', error)
    res.status(500).json({ error: 'Failed to fetch NFT' })
  }
})

app.get('/listings', async (req, res) => {
  try {
    const { page = 1, limit = 20, active = true } = req.query
    
    // TODO: Implement marketplace listings with pagination
    const listings = await db.getListings({
      page: Number(page),
      limit: Number(limit),
      active: active === 'true'
    })
    
    res.json(listings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    res.status(500).json({ error: 'Failed to fetch listings' })
  }
})

app.get('/events', async (req, res) => {
  try {
    const { page = 1, limit = 50, type, contract } = req.query
    
    // TODO: Implement event listing with filters
    const events = await db.getEvents({
      page: Number(page),
      limit: Number(limit),
      type: type as string,
      contract: contract as string
    })
    
    res.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

// Start event listener
async function startEventListener() {
  try {
    console.log('Starting event listener...')
    await eventListener.start()
    console.log('Event listener started successfully')
  } catch (error) {
    console.error('Failed to start event listener:', error)
  }
}

// Start server
async function startServer() {
  try {
    // Initialize database
    await db.initialize()
    console.log('Database initialized')
    
    // Start event listener
    await startEventListener()
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Indexer server running on port ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
      console.log(`API endpoints:`)
      console.log(`  GET /nfts - List NFTs`)
      console.log(`  GET /nfts/:tokenId - Get NFT by ID`)
      console.log(`  GET /listings - Get marketplace listings`)
      console.log(`  GET /events - Get contract events`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await eventListener.stop()
  await db.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...')
  await eventListener.stop()
  await db.close()
  process.exit(0)
})

startServer()
