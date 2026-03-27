import { Server, Api } from 'soroban-client';
import { Database } from './db';

export interface NFTEvent {
  type: 'mint' | 'transfer' | 'list' | 'buy' | 'cancel';
  tokenId: string;
  from?: string;
  to?: string;
  price?: string;
  transactionHash: string;
  blockNumber: number;
}

export class EventListener {
  private server: Server;
  private contractId: string;
  private db: Database;
  private isRunning: boolean = false;
  private lastLedger: number = 0;

  constructor(db: Database) {
    this.server = new Server(process.env.STELLAR_RPC_URL || 'https://horizon-testnet.stellar.org');
    this.contractId = process.env.CONTRACT_ADDRESS || '';
    this.db = db;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Event listener is already running');
      return;
    }

    console.log('Starting event listener...');
    this.isRunning = true;

    // Get the latest ledger
    const latestLedger = await this.server.getLatestLedger();
    this.lastLedger = latestLedger.sequence;

    // Start polling for events
    this.pollEvents();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('Event listener stopped');
  }

  private async pollEvents(): Promise<void> {
    while (this.isRunning) {
      try {
        await this.checkForNewEvents();
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      } catch (error) {
        console.error('Error polling events:', error);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait longer on error
      }
    }
  }

  private async checkForNewEvents(): Promise<void> {
    try {
      const latestLedger = await this.server.getLatestLedger();
      
      if (latestLedger.sequence <= this.lastLedger) {
        return;
      }

      // Get events for the new ledgers
      const events = await this.server.getEvents({
        startLedger: this.lastLedger + 1,
        endLedger: latestLedger.sequence,
        filters: [
          {
            type: 'contract',
            contractIds: [this.contractId],
          },
        ],
      });

      // Process each event
      for (const event of events.events) {
        await this.processEvent(event);
      }

      this.lastLedger = latestLedger.sequence;
    } catch (error) {
      console.error('Error checking for new events:', error);
    }
  }

  private async processEvent(event: any): Promise<void> {
    try {
      console.log('Processing event:', event);

      // Parse event based on type
      const eventType = this.getEventType(event);
      const eventData = this.parseEventData(event);

      switch (eventType) {
        case 'mint':
          await this.handleMintEvent(eventData);
          break;
        case 'transfer':
          await this.handleTransferEvent(eventData);
          break;
        case 'list':
          await this.handleListEvent(eventData);
          break;
        case 'buy':
          await this.handleBuyEvent(eventData);
          break;
        case 'cancel':
          await this.handleCancelEvent(eventData);
          break;
        default:
          console.log('Unknown event type:', eventType);
      }

      // Record transaction
      await this.db.recordTransaction({
        id: `${event.transactionHash}_${event.id}`,
        type: eventType,
        nft_id: eventData.tokenId,
        from_address: eventData.from,
        to_address: eventData.to,
        price: eventData.price,
        transaction_hash: event.transactionHash,
        block_number: event.ledger,
      });

    } catch (error) {
      console.error('Error processing event:', error);
    }
  }

  private getEventType(event: any): string {
    // TODO: Parse event type from Stellar event
    // This is a stub implementation
    if (event.topic?.includes('mint')) return 'mint';
    if (event.topic?.includes('transfer')) return 'transfer';
    if (event.topic?.includes('list')) return 'list';
    if (event.topic?.includes('buy')) return 'buy';
    if (event.topic?.includes('cancel')) return 'cancel';
    return 'unknown';
  }

  private parseEventData(event: any): any {
    // TODO: Parse event data from Stellar event
    // This is a stub implementation
    return {
      tokenId: event.value?.tokenId || '1',
      from: event.value?.from,
      to: event.value?.to,
      price: event.value?.price,
    };
  }

  private async handleMintEvent(data: any): Promise<void> {
    console.log('Handling mint event:', data);
    
    await this.db.createNFT({
      id: data.tokenId,
      name: `NFT #${data.tokenId}`,
      owner: data.to,
      metadata_uri: '',
    });
  }

  private async handleTransferEvent(data: any): Promise<void> {
    console.log('Handling transfer event:', data);
    
    await this.db.updateNFTOwner(data.tokenId, data.to);
  }

  private async handleListEvent(data: any): Promise<void> {
    console.log('Handling list event:', data);
    
    await this.db.createListing({
      id: `listing_${data.tokenId}`,
      nft_id: data.tokenId,
      seller: data.from,
      price: data.price,
    });
  }

  private async handleBuyEvent(data: any): Promise<void> {
    console.log('Handling buy event:', data);
    
    // Update NFT owner
    await this.db.updateNFTOwner(data.tokenId, data.to);
    
    // Update listing status
    await this.db.updateListingStatus(`listing_${data.tokenId}`, 'sold');
  }

  private async handleCancelEvent(data: any): Promise<void> {
    console.log('Handling cancel event:', data);
    
    await this.db.updateListingStatus(`listing_${data.tokenId}`, 'cancelled');
  }
}
