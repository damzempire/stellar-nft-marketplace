import sqlite3 from 'sqlite3'
import { promisify } from 'util'

export interface NFT {
  id: number
  name: string
  description?: string
  image: string
  creator: string
  owner?: string
  metadataUri?: string
  createdAt: string
  updatedAt: string
}

export interface Listing {
  id: number
  tokenId: number
  seller: string
  price: string
  nftContract: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: number
  type: 'mint' | 'transfer' | 'list' | 'buy' | 'cancel'
  tokenId?: number
  from?: string
  to?: string
  price?: string
  contract: string
  transactionHash: string
  timestamp: string
  data?: any
}

export interface GetNFTsOptions {
  page: number
  limit: number
  owner?: string
  creator?: string
}

export interface GetListingsOptions {
  page: number
  limit: number
  active: boolean
}

export interface GetEventsOptions {
  page: number
  limit: number
  type?: string
  contract?: string
}

export class Database {
  private db: sqlite3.Database | null = null

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database('./nft_marketplace.db', (err) => {
        if (err) {
          reject(err)
        } else {
          console.log('Connected to SQLite database')
          this.createTables().then(resolve).catch(reject)
        }
      })
    })
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const run = promisify(this.db.run.bind(this.db))

    // Create NFTs table
    await run(`
      CREATE TABLE IF NOT EXISTS nfts (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT NOT NULL,
        creator TEXT NOT NULL,
        owner TEXT,
        metadataUri TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create Listings table
    await run(`
      CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tokenId INTEGER NOT NULL,
        seller TEXT NOT NULL,
        price TEXT NOT NULL,
        nftContract TEXT NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tokenId) REFERENCES nfts (id)
      )
    `)

    // Create Events table
    await run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        tokenId INTEGER,
        from TEXT,
        to TEXT,
        price TEXT,
        contract TEXT NOT NULL,
        transactionHash TEXT NOT NULL UNIQUE,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        data TEXT,
        FOREIGN KEY (tokenId) REFERENCES nfts (id)
      )
    `)

    // Create indexes for better performance
    await run('CREATE INDEX IF NOT EXISTS idx_nfts_owner ON nfts (owner)')
    await run('CREATE INDEX IF NOT EXISTS idx_nfts_creator ON nfts (creator)')
    await run('CREATE INDEX IF NOT EXISTS idx_listings_tokenId ON listings (tokenId)')
    await run('CREATE INDEX IF NOT EXISTS idx_listings_active ON listings (isActive)')
    await run('CREATE INDEX IF NOT EXISTS idx_events_type ON events (type)')
    await run('CREATE INDEX IF NOT EXISTS idx_events_contract ON events (contract)')
    await run('CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events (timestamp)')

    console.log('Database tables created successfully')
  }

  async getNFTs(options: GetNFTsOptions): Promise<{ nfts: NFT[], total: number }> {
    if (!this.db) throw new Error('Database not initialized')

    const { page, limit, owner, creator } = options
    const offset = (page - 1) * limit

    let whereClause = ''
    const params: any[] = []

    if (owner) {
      whereClause += 'WHERE owner = ?'
      params.push(owner)
    }

    if (creator) {
      whereClause += whereClause ? ' AND creator = ?' : 'WHERE creator = ?'
      params.push(creator)
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM nfts ${whereClause}`
    const countResult = await this.get(countQuery, params)
    const total = countResult.total

    // Get NFTs with pagination
    const nftsQuery = `
      SELECT * FROM nfts 
      ${whereClause} 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `
    params.push(limit, offset)
    const nfts = await this.all(nftsQuery, params)

    return { nfts, total }
  }

  async getNFTById(tokenId: number): Promise<NFT | null> {
    if (!this.db) throw new Error('Database not initialized')

    const nft = await this.get('SELECT * FROM nfts WHERE id = ?', [tokenId])
    return nft || null
  }

  async getListings(options: GetListingsOptions): Promise<{ listings: Listing[], total: number }> {
    if (!this.db) throw new Error('Database not initialized')

    const { page, limit, active } = options
    const offset = (page - 1) * limit

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM listings WHERE isActive = ?'
    const countResult = await this.get(countQuery, [active])
    const total = countResult.total

    // Get listings with pagination
    const listingsQuery = `
      SELECT l.*, n.name, n.image, n.creator 
      FROM listings l
      JOIN nfts n ON l.tokenId = n.id
      WHERE l.isActive = ?
      ORDER BY l.createdAt DESC
      LIMIT ? OFFSET ?
    `
    const listings = await this.all(listingsQuery, [active, limit, offset])

    return { listings, total }
  }

  async getEvents(options: GetEventsOptions): Promise<{ events: Event[], total: number }> {
    if (!this.db) throw new Error('Database not initialized')

    const { page, limit, type, contract } = options
    const offset = (page - 1) * limit

    let whereClause = 'WHERE 1=1'
    const params: any[] = []

    if (type) {
      whereClause += ' AND type = ?'
      params.push(type)
    }

    if (contract) {
      whereClause += ' AND contract = ?'
      params.push(contract)
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM events ${whereClause}`
    const countResult = await this.get(countQuery, params)
    const total = countResult.total

    // Get events with pagination
    const eventsQuery = `
      SELECT * FROM events 
      ${whereClause} 
      ORDER BY timestamp DESC 
      LIMIT ? OFFSET ?
    `
    params.push(limit, offset)
    const events = await this.all(eventsQuery, params)

    return { events, total }
  }

  // Helper methods for database operations
  private async get(query: string, params: any[] = []): Promise<any> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      this.db!.get(query, params, (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }

  private async all(query: string, params: any[] = []): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      this.db!.all(query, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  async close(): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      this.db!.close((err) => {
        if (err) reject(err)
        else {
          console.log('Database connection closed')
          resolve()
        }
      })
    })
  }
}
