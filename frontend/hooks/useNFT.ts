import { useState, useEffect } from 'react';

interface NFT {
  id: string;
  name: string;
  image: string;
  price?: string;
  owner: string;
  metadata?: string;
}

interface NFTMetadata {
  name: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export default function useNFT(tokenId?: string) {
  const [nft, setNft] = useState<NFT | null>(null);
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tokenId) {
      fetchNFT(tokenId);
    }
  }, [tokenId]);

  const fetchNFT = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual NFT fetching from contract
      console.log('Fetching NFT:', id);
      
      // Mock data
      const mockNFT: NFT = {
        id,
        name: `NFT #${id}`,
        image: '/api/placeholder/300/300',
        price: '100 XLM',
        owner: 'GABC...XYZ',
        metadata: 'ipfs://QmExample',
      };
      
      setNft(mockNFT);
      
      // Fetch metadata from IPFS if available
      if (mockNFT.metadata) {
        await fetchMetadata(mockNFT.metadata);
      }
    } catch (err) {
      setError('Failed to fetch NFT');
      console.error('Error fetching NFT:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async (uri: string) => {
    try {
      // TODO: Implement actual IPFS metadata fetching
      console.log('Fetching metadata from:', uri);
      
      // Mock metadata
      const mockMetadata: NFTMetadata = {
        name: `NFT #${tokenId}`,
        description: 'A beautiful NFT on Stellar',
        image: 'https://example.com/image.jpg',
        attributes: [
          { trait_type: 'Background', value: 'Blue' },
          { trait_type: 'Rarity', value: 'Common' },
        ],
      };
      
      setMetadata(mockMetadata);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  const validateMetadata = (uri: string): boolean => {
    return uri.startsWith('ipfs://') || uri.startsWith('https://ipfs.io/ipfs/');
  };

  return {
    nft,
    metadata,
    loading,
    error,
    fetchNFT,
    validateMetadata,
  };
}
