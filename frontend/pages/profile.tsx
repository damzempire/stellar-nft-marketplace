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

export default function Profile() {
  const [isConnected, setIsConnected] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const { getOwnedNFTs } = useContract();

  useEffect(() => {
    if (isConnected) {
      loadOwnedNFTs();
    }
  }, [isConnected]);

  const loadOwnedNFTs = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual contract calls
      const mockOwnedNFTs: NFT[] = [
        {
          id: '4',
          name: 'My Stellar Collection #1',
          image: '/api/placeholder/300/300',
          owner: walletAddress,
          metadata: 'ipfs://QmMyExample1',
        },
        {
          id: '5',
          name: 'My Stellar Collection #2',
          image: '/api/placeholder/300/300',
          owner: walletAddress,
          metadata: 'ipfs://QmMyExample2',
        },
      ];
      setOwnedNFTs(mockOwnedNFTs);
    } catch (error) {
      console.error('Error loading owned NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Profile - Stellar NFT Marketplace</title>
        <meta name="description" content="View your NFT collection" />
      </Head>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-stellar-blue">My Profile</h1>
            <WalletConnect isConnected={isConnected} setIsConnected={setIsConnected} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600">Connect your Stellar wallet to view your NFT collection</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Information</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span> {walletAddress || 'GABC...XYZ'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Network:</span> Stellar Testnet
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">NFTs Owned:</span> {ownedNFTs.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My NFT Collection</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stellar-blue mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading your NFTs...</p>
                </div>
              ) : (
                <>
                  {ownedNFTs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {ownedNFTs.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} isOwner={true} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">You don't own any NFTs yet</p>
                      <a 
                        href="/marketplace" 
                        className="text-stellar-blue hover:underline font-medium"
                      >
                        Browse Marketplace
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
