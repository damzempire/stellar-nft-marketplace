import { useState } from 'react'

interface NFTCardProps {
  id: number
  name: string
  price?: string
  image: string
  creator: string
  owner?: string
}

export const NFTCard = ({ id, name, price, image, creator, owner }: NFTCardProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleBuy = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement NFT purchase logic
      // - Connect to marketplace contract
      // - Execute buy transaction
      // - Handle payment and transfer
      console.log(`Buying NFT ${id} for ${price}`)
    } catch (error) {
      console.error('Failed to buy NFT:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransfer = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement NFT transfer logic
      // - Connect to NFT contract
      // - Execute transfer transaction
      console.log(`Transferring NFT ${id}`)
    } catch (error) {
      console.error('Failed to transfer NFT:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-stellar-pink/50 transition-all duration-300">
      {/* NFT Image */}
      <div className="aspect-square relative overflow-hidden bg-gray-800">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg'
          }}
        />
        {price && (
          <div className="absolute top-2 right-2 bg-stellar-pink text-white px-2 py-1 rounded-lg text-sm font-bold">
            {price}
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 truncate">{name}</h3>
        
        <div className="space-y-1 text-sm text-gray-300 mb-4">
          <p>Creator: {creator}</p>
          {owner && <p>Owner: {owner}</p>}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {price ? (
            <button
              onClick={handleBuy}
              disabled={isLoading}
              className="w-full bg-stellar-pink hover:bg-stellar-pink/80 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? 'Processing...' : 'Buy Now'}
            </button>
          ) : owner ? (
            <button
              onClick={handleTransfer}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? 'Processing...' : 'Transfer'}
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-600 text-gray-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Not for sale
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
