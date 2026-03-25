import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { WalletConnect } from '@/components/WalletConnect'
import { NFTCard } from '@/components/NFTCard'

interface NFT {
  id: number
  name: string
  price: string
  image: string
  creator: string
  owner?: string
}

const Marketplace: NextPage = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - replace with actual contract calls
  const listings: NFT[] = [
    {
      id: 1,
      name: "Stellar Art #1",
      price: "100 XLM",
      image: "/placeholder.jpg",
      creator: "artist.stellar",
      owner: "collector.stellar"
    },
    {
      id: 2,
      name: "Cosmic NFT #2",
      price: "250 XLM",
      image: "/placeholder.jpg",
      creator: "creator.stellar"
    },
    {
      id: 3,
      name: "Galaxy Pass #3",
      price: "500 XLM",
      image: "/placeholder.jpg",
      creator: "galaxy.stellar",
      owner: "holder.stellar"
    }
  ]

  return (
    <>
      <Head>
        <title>Marketplace - Stellar NFT Marketplace</title>
        <meta name="description" content="Browse and trade NFTs on Stellar" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-stellar-blue to-stellar-purple">
        <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-white">Marketplace</h1>
              <WalletConnect />
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters and Search */}
          <div className="mb-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-pink"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-stellar-pink text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('listed')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'listed'
                      ? 'bg-stellar-pink text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Listed
                </button>
                <button
                  onClick={() => setFilter('owned')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'owned'
                      ? 'bg-stellar-pink text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Owned
                </button>
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                name={nft.name}
                price={nft.price}
                image={nft.image}
                creator={nft.creator}
                owner={nft.owner}
              />
            ))}
          </div>

          {listings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-300">No NFTs found</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default Marketplace
