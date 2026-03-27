import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export interface NFT {
  id: string;
  name: string;
  owner: string;
  metadata_uri: string;
  created_at: Date;
  updated_at: Date;
}

export interface Listing {
  id: string;
  nft_id: string;
  seller: string;
  price: string;
  created_at: Date;
  updated_at: Date;
}

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./nft_marketplace.db');
  }

  async initialize(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));

    try {
      // Create NFTs table
      await run(`
        CREATE TABLE IF NOT EXISTS nfts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          owner TEXT NOT NULL,
          metadata_uri TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create listings table
      await run(`
        CREATE TABLE IF NOT EXISTS listings (
          id TEXT PRIMARY KEY,
          nft_id TEXT NOT NULL,
          seller TEXT NOT NULL,
          price TEXT NOT NULL,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (nft_id) REFERENCES nfts (id)
        )
      `);

      // Create transactions table
      await run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          nft_id TEXT,
          from_address TEXT,
          to_address TEXT,
          price TEXT,
          transaction_hash TEXT NOT NULL,
          block_number INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (nft_id) REFERENCES nfts (id)
        )
      `);

      // Create indexes
      await run('CREATE INDEX IF NOT EXISTS idx_nfts_owner ON nfts (owner)');
      await run('CREATE INDEX IF NOT EXISTS idx_listings_nft_id ON listings (nft_id)');
      await run('CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings (seller)');
      await run('CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status)');
      await run('CREATE INDEX IF NOT EXISTS idx_transactions_nft_id ON transactions (nft_id)');
      await run('CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions (type)');

      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async createNFT(nft: Omit<NFT, 'created_at' | 'updated_at'>): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    
    await run(
      'INSERT INTO nfts (id, name, owner, metadata_uri) VALUES (?, ?, ?, ?)',
      [nft.id, nft.name, nft.owner, nft.metadata_uri]
    );
  }

  async updateNFTOwner(tokenId: string, newOwner: string): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    
    await run(
      'UPDATE nfts SET owner = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newOwner, tokenId]
    );
  }

  async getNFT(tokenId: string): Promise<NFT | null> {
    const get = promisify(this.db.get.bind(this.db));
    
    const row = await get('SELECT * FROM nfts WHERE id = ?', [tokenId]);
    return row as NFT || null;
  }

  async getAllNFTs(): Promise<NFT[]> {
    const all = promisify(this.db.all.bind(this.db));
    
    const rows = await all('SELECT * FROM nfts ORDER BY created_at DESC');
    return rows as NFT[];
  }

  async getNFTsByOwner(owner: string): Promise<NFT[]> {
    const all = promisify(this.db.all.bind(this.db));
    
    const rows = await all('SELECT * FROM nfts WHERE owner = ? ORDER BY created_at DESC', [owner]);
    return rows as NFT[];
  }

  async createListing(listing: Omit<Listing, 'created_at' | 'updated_at'>): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    
    await run(
      'INSERT INTO listings (id, nft_id, seller, price) VALUES (?, ?, ?, ?)',
      [listing.id, listing.nft_id, listing.seller, listing.price]
    );
  }

  async updateListingStatus(listingId: string, status: string): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    
    await run(
      'UPDATE listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, listingId]
    );
  }

  async getActiveListings(): Promise<Listing[]> {
    const all = promisify(this.db.all.bind(this.db));
    
    const rows = await all(
      'SELECT l.*, n.name, n.metadata_uri FROM listings l JOIN nfts n ON l.nft_id = n.id WHERE l.status = "active" ORDER BY l.created_at DESC'
    );
    return rows as Listing[];
  }

  async recordTransaction(transaction: {
    id: string;
    type: string;
    nft_id?: string;
    from_address?: string;
    to_address?: string;
    price?: string;
    transaction_hash: string;
    block_number?: number;
  }): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    
    await run(
      'INSERT INTO transactions (id, type, nft_id, from_address, to_address, price, transaction_hash, block_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        transaction.id,
        transaction.type,
        transaction.nft_id,
        transaction.from_address,
        transaction.to_address,
        transaction.price,
        transaction.transaction_hash,
        transaction.block_number
      ]
    );
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
