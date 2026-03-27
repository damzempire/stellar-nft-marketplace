import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import WalletConnect from '../components/WalletConnect';
import ListingForm from '../components/ListingForm';

export default function CreateNFT() {
  const [isConnected, setIsConnected] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreate = async (formData: any) => {
    setIsCreating(true);
    try {
      // TODO: Implement contract call to mint NFT
      console.log('Creating NFT:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to marketplace after successful creation
      router.push('/marketplace');
    } catch (error) {
      console.error('Error creating NFT:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Create NFT - Stellar NFT Marketplace</title>
        <meta name="description" content="Create and mint your NFT on Stellar" />
      </Head>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-stellar-blue">Create NFT</h1>
            <WalletConnect isConnected={isConnected} setIsConnected={setIsConnected} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mint Your NFT</h2>
          
          {!isConnected ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Connect your wallet to create an NFT</p>
            </div>
          ) : (
            <ListingForm 
              onSubmit={handleCreate} 
              isLoading={isCreating}
              submitText="Create NFT"
            />
          )}
        </div>
      </main>
    </div>
  );
}
