'use client';

import { useWeb3 } from '@/contexts/Web3Context';

export default function WalletConnect() {
  const { connectWallet, isLoading, error } = useWeb3();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
      <div className="text-blue-400 text-6xl mb-4">🔗</div>
      <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
      <p className="text-gray-300 mb-8">
        Connect your MetaMask wallet to get started with NFT verification
      </p>
      
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Connecting...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Connect MetaMask
          </div>
        )}
      </button>

      {error && (
        <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-400">
        <p>Don&apos;t have MetaMask? <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Install it here</a></p>
      </div>
    </div>
  );
} 