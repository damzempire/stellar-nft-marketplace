import { useState } from 'react';

interface WalletConnectProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export default function WalletConnect({ isConnected, setIsConnected }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // TODO: Implement actual Stellar wallet connection
      // For now, simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-stellar-blue rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">W</span>
          </div>
          <span className="text-sm text-gray-700">GABC...XYZ</span>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="px-4 py-2 bg-stellar-blue text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
