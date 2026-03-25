import { useState, useEffect } from 'react'
import { useContract } from './useContract'

interface NFT {
  id: number
  name: string
  description?: string
  image: string
  creator: string
  owner?: string
  price?: string
  metadataUri?: string
}

export const useNFT = (contractAddress: string) => {
  const { invokeContract, getContractData, isLoading, error } = useContract(contractAddress)
  const [nfts, setNfts] = useState<NFT[]>([])
  const [currentNFT, setCurrentNFT] = useState<NFT | null>(null)

  const mintNFT = async (
    to: string,
    tokenId: number,
    metadataUri: string,
    name: string,
    description: string
  ) => {
    try {
      // TODO: Implement NFT minting
      // - Call mint function on NFT contract
      // - Store metadata IPFS hash
      // - Update local state
      
      const result = await invokeContract('mint', [to, tokenId, metadataUri])
      
      if (result?.success) {
        const newNFT: NFT = {
          id: tokenId,
          name,
          description,
          image: '/placeholder.jpg', // Will be updated from IPFS
          creator: to,
          metadataUri,
        }
        setNfts(prev => [...prev, newNFT])
        return newNFT
      }
      
      return null
    } catch (err) {
      console.error('Failed to mint NFT:', err)
      return null
    }
  }

  const transferNFT = async (from: string, to: string, tokenId: number) => {
    try {
      // TODO: Implement NFT transfer
      // - Call transfer function on NFT contract
      // - Update local state
      
      const result = await invokeContract('transfer', [from, to, tokenId])
      
      if (result?.success) {
        setNfts(prev => 
          prev.map(nft => 
            nft.id === tokenId ? { ...nft, owner: to } : nft
          )
        )
        return true
      }
      
      return false
    } catch (err) {
      console.error('Failed to transfer NFT:', err)
      return false
    }
  }

  const getNFTOwner = async (tokenId: number): Promise<string | null> => {
    try {
      // TODO: Get NFT owner from contract
      const owner = await getContractData(`owner_${tokenId}`)
      return owner
    } catch (err) {
      console.error('Failed to get NFT owner:', err)
      return null
    }
  }

  const getTokenURI = async (tokenId: number): Promise<string | null> => {
    try {
      // TODO: Get token URI from contract
      const uri = await getContractData(`uri_${tokenId}`)
      return uri
    } catch (err) {
      console.error('Failed to get token URI:', err)
      return null
    }
  }

  const getTokensOfOwner = async (owner: string): Promise<number[]> => {
    try {
      // TODO: Get all tokens owned by address
      const tokens = await getContractData(`tokens_${owner}`)
      return tokens || []
    } catch (err) {
      console.error('Failed to get tokens of owner:', err)
      return []
    }
  }

  const loadNFT = async (tokenId: number) => {
    try {
      // TODO: Load complete NFT data
      // - Get owner, metadata URI
      // - Fetch metadata from IPFS
      // - Update currentNFT state
      
      const owner = await getNFTOwner(tokenId)
      const metadataUri = await getTokenURI(tokenId)
      
      if (owner && metadataUri) {
        // TODO: Fetch actual metadata from IPFS
        const nft: NFT = {
          id: tokenId,
          name: `NFT #${tokenId}`,
          image: '/placeholder.jpg',
          creator: 'unknown',
          owner,
          metadataUri,
        }
        
        setCurrentNFT(nft)
        return nft
      }
      
      return null
    } catch (err) {
      console.error('Failed to load NFT:', err)
      return null
    }
  }

  const listNFT = async (
    tokenId: number,
    price: string,
    seller: string,
    marketplaceContract: string
  ) => {
    try {
      // TODO: List NFT on marketplace
      // - Approve marketplace contract
      // - Call list_nft function
      // - Update local state
      
      const result = await invokeContract('list_nft', [
        seller,
        tokenId,
        price,
        marketplaceContract
      ])
      
      if (result?.success) {
        setNfts(prev => 
          prev.map(nft => 
            nft.id === tokenId ? { ...nft, price } : nft
          )
        )
        return true
      }
      
      return false
    } catch (err) {
      console.error('Failed to list NFT:', err)
      return false
    }
  }

  return {
    nfts,
    currentNFT,
    isLoading,
    error,
    mintNFT,
    transferNFT,
    getNFTOwner,
    getTokenURI,
    getTokensOfOwner,
    loadNFT,
    listNFT,
  }
}
