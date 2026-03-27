import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './db';
import { EventListener } from './EventListener';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database();
const eventListener = new EventListener(db);

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/nfts', async (req, res) => {
  try {
    const nfts = await db.getAllNFTs();
    res.json(nfts);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/nfts/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const nft = await db.getNFT(tokenId);
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    res.json(nft);
  } catch (error) {
    console.error('Error fetching NFT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/nfts/owner/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const nfts = await db.getNFTsByOwner(address);
    res.json(nfts);
  } catch (error) {
    console.error('Error fetching NFTs by owner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/listings', async (req, res) => {
  try {
    const listings = await db.getActiveListings();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function startServer() {
  try {
    // Initialize database
    await db.initialize();
    console.log('Database initialized');

    // Start event listener
    await eventListener.start();
    console.log('Event listener started');

    // Start HTTP server
    app.listen(port, () => {
      console.log(`Indexer server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await eventListener.stop();
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await eventListener.stop();
  await db.close();
  process.exit(0);
});

startServer().catch(console.error);
