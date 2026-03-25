import { useState } from 'react'

export const ListingForm = () => {
  const [tokenId, setTokenId] = useState('')
  const [price, setPrice] = useState('')
  const [isListing, setIsListing] = useState(false)

  const handleListNFT = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsListing(true)
    
    try {
      // TODO: Implement NFT listing logic
      // - Validate token ownership
      // - Connect to marketplace contract
      // - Execute listing transaction
      console.log(`Listing NFT ${tokenId} for ${price} XLM`)
      
      // Reset form
      setTokenId('')
      setPrice('')
    } catch (error) {
      console.error('Failed to list NFT:', error)
    } finally {
      setIsListing(false)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">List NFT for Sale</h2>
      
      <form onSubmit={handleListNFT} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Token ID
          </label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-pink"
            placeholder="Enter token ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Price (XLM)
          </label>
          <input
            type="number"
            step="0.0000001"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-pink"
            placeholder="Enter price in XLM"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isListing}
          className="w-full bg-stellar-pink hover:bg-stellar-pink/80 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {isListing ? 'Listing...' : 'List NFT'}
        </button>
      </form>
    </div>
  )
}
