'use client';

import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuth } from '@/contexts/AuthContext';
import { useNFTVerification } from '@/hooks/useNFTVerification';

export default function NFTVerification() {
  const { account, signer } = useWeb3();
  const { login, isLoading: authLoading } = useAuth();
  const { hasAccess, isChecking, error, checkNFTOwnership } = useNFTVerification();
  const [isSigning, setIsSigning] = useState(false);

  const handleVerifyAndLogin = async () => {
    if (!signer || !account) return;

    try {
      setIsSigning(true);
      
      // First check NFT ownership
      const hasNFT = await checkNFTOwnership();
      
      if (hasNFT) {
        // Create a message to sign
        const message = `I want to access the premium dashboard. Address: ${account}. Timestamp: ${Date.now()}`;
        
        // Sign the message
        const signature = await signer.signMessage(message);
        
        // Login with the signature
        await login(account, signature);
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsSigning(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="text-green-400 text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-4">Wallet Connected</h2>
        <p className="text-gray-300">
          Address: <span className="font-mono text-blue-400">{formatAddress(account || '')}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* NFT Verification Status */}
        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">NFT Ownership Status</h3>
          
          {isChecking ? (
            <div className="flex items-center text-blue-400">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
              Checking NFT ownership...
            </div>
          ) : hasAccess ? (
            <div className="flex items-center text-green-400">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              You own the Premium Access NFT!
            </div>
          ) : (
            <div className="flex items-center text-red-400">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              You don&apos;t own the required NFT
            </div>
          )}
        </div>

        {/* Action Button */}
        {hasAccess && (
          <div className="text-center">
            <button
              onClick={handleVerifyAndLogin}
              disabled={isSigning || authLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSigning || authLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing Message...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Access Premium Dashboard
                </div>
              )}
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Info for users without NFT */}
        {!hasAccess && !isChecking && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-200 font-semibold mb-2">How to get access:</h4>
            <ul className="text-yellow-100 text-sm space-y-1">
              <li>• Contact the administrator to mint a Premium Access NFT</li>
              <li>• The NFT will be sent to your connected wallet address</li>
              <li>• Once you own the NFT, you can access the premium dashboard</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 