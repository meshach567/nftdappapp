'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuth } from '@/contexts/AuthContext';
import { useNFTVerification } from '@/hooks/useNFTVerification';
import WalletConnect from '@/components/WalletConnect';
import NFTVerification from '@/components/NFTVerification';
import PremiumDashboard from '@/components/PremiumDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { isConnected, isLoading: web3Loading } = useWeb3();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasAccess } = useNFTVerification();
  const [currentStep, setCurrentStep] = useState<'connect' | 'verify' | 'dashboard'>('connect');

  // Determine current step based on state
  useEffect(() => {
    if (isConnected && !isAuthenticated) {
      setCurrentStep('verify');
    } else if (isConnected && isAuthenticated && hasAccess) {
      setCurrentStep('dashboard');
    }
  }, [isConnected, isAuthenticated, hasAccess]);

  if (web3Loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            NFT Access DApp
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect your wallet, verify NFT ownership, and unlock premium features
          </p>
        </header>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep === 'connect' ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'connect' ? 'border-blue-400 bg-blue-400 text-white' : 'border-gray-500'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Connect Wallet</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-600"></div>
            <div className={`flex items-center ${currentStep === 'verify' ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'verify' ? 'border-blue-400 bg-blue-400 text-white' : 'border-gray-500'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Verify NFT</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-600"></div>
            <div className={`flex items-center ${currentStep === 'dashboard' ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'dashboard' ? 'border-blue-400 bg-blue-400 text-white' : 'border-gray-500'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Premium Access</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {!isConnected ? (
            <WalletConnect />
          ) : !isAuthenticated ? (
            <NFTVerification />
          ) : hasAccess ? (
            <PremiumDashboard />
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <div className="text-red-400 text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
              <p className="text-gray-300 mb-6">
                You don&apos;t own the required NFT to access the premium dashboard.
              </p>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200">
                  To get access, you need to own the Premium Access NFT. 
                  Contact the administrator to mint one for your address.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400">
          <p>Built with Next.js, Ethers.js, and Solidity</p>
        </footer>
      </div>
    </div>
  );
}
  