import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import NFTCard from '../components/NFTCard';

interface NFT {
  id: string;
  name: string;
  image: string;
  price?: string;
  owner: string;
}

export default function Home({ featuredNFTs }: { featuredNFTs: NFT[] }) {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Stellar NFT Marketplace</title>
        <meta name="description" content="Decentralized NFT marketplace on Stellar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-stellar-blue">Stellar NFT Marketplace</h1>
            <WalletConnect isConnected={isConnected} setIsConnected={setIsConnected} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured NFTs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </section>

        <section className="text-center py-12 bg-stellar-blue text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Start Trading NFTs on Stellar</h2>
          <p className="text-xl mb-8">Low fees, fast transactions, sustainable blockchain</p>
          <button className="bg-white text-stellar-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Explore Marketplace
          </button>
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const featuredNFTs: NFT[] = [
    {
      id: '1',
      name: 'Stellar Art #1',
      image: '/api/placeholder/300/300',
      price: '100 XLM',
      owner: 'GABC...',
    },
    {
      id: '2', 
      name: 'Cosmic NFT #42',
      image: '/api/placeholder/300/300',
      price: '250 XLM',
      owner: 'GDEF...',
    },
  ];

  return {
    props: { featuredNFTs },
  };
};
