import { useState, useEffect } from 'react';
import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import NFTCard from '../components/NFTCard';
import useContract from '../hooks/useContract';

interface NFT {
  id: string;
  name: string;
  image: string;
  price?: string;
  owner: string;
  metadata?: string;
}

export default function Marketplace() {
  const [isConnected, setIsConnected] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'listed' | 'owned'>('all');
  const { getNFTs, buyNFT } = useContract();

  useEffect(() => {
    loadNFTs();
  }, [filter]);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual contract calls
      const mockNFTs: NFT[] = [
        {
          id: '1',
          name: 'Stellar Art #1',
          image: '/api/placeholder/300/300',
          price: '100 XLM',
          owner: 'GABC...',
          metadata: 'ipfs://QmExample1',
        },
        {
          id: '2',
          name: 'Cosmic NFT #42',
          image: '/api/placeholder/300/300',
          price: '250 XLM',
          owner: 'GDEF...',
          metadata: 'ipfs://QmExample2',
        },
        {
          id: '3',
          name: 'Galaxy Explorer',
          image: '/api/placeholder/300/300',
          price: '75 XLM',
          owner: 'GHIJ...',
          metadata: 'ipfs://QmExample3',
        },
      ];
      setNfts(mockNFTs);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (nftId: string) => {
    if (!isConnected) return;
    
    try {
      await buyNFT(nftId);
      await loadNFTs();
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Marketplace - Stellar NFT Marketplace</title>
        <meta name="description" content="Browse and buy NFTs on Stellar" />
      </Head>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-stellar-blue">Marketplace</h1>
            <WalletConnect isConnected={isConnected} setIsConnected={setIsConnected} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Browse NFTs</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all' 
                  ? 'bg-stellar-blue text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('listed')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'listed' 
                  ? 'bg-stellar-blue text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setFilter('owned')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'owned' 
                  ? 'bg-stellar-blue text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              My NFTs
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stellar-blue mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading NFTs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard 
                key={nft.id} 
                nft={nft} 
                onBuy={() => handleBuy(nft.id)}
                isConnected={isConnected}
              />
            ))}
          </div>
        )}

        {!loading && nfts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No NFTs found</p>
          </div>
        )}
      </main>
    </div>
  );
}
