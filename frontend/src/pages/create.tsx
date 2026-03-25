import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { WalletConnect } from '@/components/WalletConnect'
import { ListingForm } from '@/components/ListingForm'

const Create: NextPage = () => {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <>
      <Head>
        <title>Create NFT - Stellar NFT Marketplace</title>
        <meta name="description" content="Create new NFT on Stellar" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-stellar-blue to-stellar-purple">
        <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-white">Create NFT</h1>
              <WalletConnect />
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-8">Mint New NFT</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  NFT Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-pink"
                  placeholder="Enter NFT name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-pink"
                  rows={4}
                  placeholder="Describe your NFT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                  <p className="text-gray-300">Drop image here or click to upload</p>
                  <p className="text-sm text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  IPFS Metadata URI
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-pink"
                  placeholder="ipfs://..."
                />
              </div>

              <button
                onClick={() => setIsCreating(true)}
                className="w-full bg-stellar-pink text-white font-bold py-3 px-6 rounded-lg hover:bg-stellar-pink/80 transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create NFT'}
              </button>
            </div>
          </div>

          <div className="mt-8">
            <ListingForm />
          </div>
        </div>
      </main>
    </>
  )
}

export default Create
