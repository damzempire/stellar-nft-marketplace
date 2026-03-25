import type { NextPage } from 'next'
import Head from 'next/head'
import { WalletConnect } from '@/components/WalletConnect'
import { NFTCard } from '@/components/NFTCard'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Stellar NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace on Stellar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-stellar-blue to-stellar-purple">
        <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-white">Stellar NFT Marketplace</h1>
              <WalletConnect />
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Discover Stellar NFTs
            </h2>
            <p className="text-xl text-gray-300">
              Mint, trade, and collect NFTs on the Stellar network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder NFT cards */}
            <NFTCard
              id={1}
              name="Stellar Art #1"
              price="100 XLM"
              image="/placeholder.jpg"
              creator="artist.stellar"
            />
            <NFTCard
              id={2}
              name="Cosmic NFT #2"
              price="250 XLM"
              image="/placeholder.jpg"
              creator="creator.stellar"
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
