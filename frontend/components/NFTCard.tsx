import { useState } from 'react';

interface NFT {
  id: string;
  name: string;
  image: string;
  price?: string;
  owner: string;
  metadata?: string;
}

interface NFTCardProps {
  nft: NFT;
  onBuy?: () => void;
  isConnected?: boolean;
  isOwner?: boolean;
}

export default function NFTCard({ nft, onBuy, isConnected = false, isOwner = false }: NFTCardProps) {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleBuy = async () => {
    if (!onBuy || !isConnected) return;
    
    setLoading(true);
    try {
      await onBuy();
    } catch (error) {
      console.error('Error buying NFT:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        {!imageError ? (
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        
        {nft.price && (
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg shadow-sm">
            <span className="text-sm font-semibold text-stellar-blue">{nft.price}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">{nft.name}</h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 truncate">
            {isOwner ? 'You' : `Owner: ${nft.owner.slice(0, 8)}...`}
          </span>
        </div>
        
        {nft.price && !isOwner && (
          <button
            onClick={handleBuy}
            disabled={!isConnected || loading}
            className="w-full px-4 py-2 bg-stellar-blue text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isConnected ? 'Buy Now' : 'Connect Wallet'}
          </button>
        )}
        
        {isOwner && (
          <div className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center text-sm">
            Your NFT
          </div>
        )}
        
        {!nft.price && !isOwner && (
          <div className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center text-sm">
            Not for Sale
          </div>
        )}
      </div>
    </div>
  );
}
