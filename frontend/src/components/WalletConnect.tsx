import { useState } from 'react'

export const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const connectWallet = async () => {
    try {
      // TODO: Implement Stellar wallet connection
      // - Use @stellar/stellar-sdk to connect wallet
      // - Handle different wallet providers (Freighter, etc.)
      // - Set wallet address and connection state
      
      // Mock connection for now
      setWalletAddress('G...')
      setIsConnected(true)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnectWallet = () => {
    // TODO: Implement wallet disconnection
    setWalletAddress('')
    setIsConnected(false)
  }

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <div className="flex items-center space-x-3">
          <span className="text-white text-sm">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-stellar-pink hover:bg-stellar-pink/80 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
