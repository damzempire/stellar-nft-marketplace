import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { WalletConnect } from '@/components/WalletConnect'
import { NFTCard } from '@/components/NFTCard'

interface NFT {
  id: number
  name: string
  price?: string
  image: string
  creator: string
}

const Profile: NextPage = () => {
  const [activeTab, setActiveTab] = useState('created')
  
  // Mock data - replace with actual contract calls
  const createdNFTs: NFT[] = [
    {
      id: 1,
      name: "Stellar Art #1",
      price: "100 XLM",
      image: "/placeholder.jpg",
      creator: "user.stellar"
    }
  ]

  const ownedNFTs: NFT[] = [
    {
      id: 2,
      name: "Cosmic NFT #2",
      image: "/placeholder.jpg",
      creator: "artist.stellar"
    }
  ]

  const listedNFTs: NFT[] = [
    {
      id: 1,
      name: "Stellar Art #1",
      price: "100 XLM",
      image: "/placeholder.jpg",
      creator: "user.stellar"
    }
  ]

  return (
    <>
      <Head>
        <title>Profile - Stellar NFT Marketplace</title>
        <meta name="description" content="Your NFT profile" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-stellar-blue to-stellar-purple">
        <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-white">Profile</h1>
              <WalletConnect />
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Header */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-stellar-pink rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">U</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">user.stellar</h2>
                <p className="text-gray-300">NFT Creator & Collector</p>
                <div className="flex space-x-6 mt-4">
                  <div>
                    <span className="text-2xl font-bold text-white">12</span>
                    <p className="text-gray-300 text-sm">Created</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">8</span>
                    <p className="text-gray-300 text-sm">Owned</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">3</span>
                    <p className="text-gray-300 text-sm">Listed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 mb-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('created')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'created'
                    ? 'bg-stellar-pink text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Created
              </button>
              <button
                onClick={() => setActiveTab('owned')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'owned'
                    ? 'bg-stellar-pink text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Owned
              </button>
              <button
                onClick={() => setActiveTab('listed')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'listed'
                    ? 'bg-stellar-pink text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Listed
              </button>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'created' && createdNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                name={nft.name}
                price={nft.price}
                image={nft.image}
                creator={nft.creator}
              />
            ))}
            
            {activeTab === 'owned' && ownedNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                name={nft.name}
                price={nft.price}
                image={nft.image}
                creator={nft.creator}
              />
            ))}
            
            {activeTab === 'listed' && listedNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                name={nft.name}
                price={nft.price}
                image={nft.image}
                creator={nft.creator}
              />
            ))}
          </div>

          {((activeTab === 'created' && createdNFTs.length === 0) ||
            (activeTab === 'owned' && ownedNFTs.length === 0) ||
            (activeTab === 'listed' && listedNFTs.length === 0)) && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-300">No NFTs found</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default Profile
