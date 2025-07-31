'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkIfWalletIsConnected: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkIfWalletIsConnected = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          
          setAccount(accounts[0]);
          setProvider(provider);
          setSigner(signer);
          setIsConnected(true);
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
      setError('Failed to check wallet connection');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
        
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          
          setAccount(accounts[0]);
          setProvider(provider);
          setSigner(signer);
          setIsConnected(true);
        }
      } else {
        setError('MetaMask is not installed');
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err
      ) {
        // Handle MetaMask specific errors
        type MetaMaskError = { code: number; message?: string };
        const errorCode = (err as MetaMaskError).code;
        if (errorCode === 4001) {
          setError('User rejected the connection');
        } else if (errorCode === -32002) {
          setError('Please check MetaMask - connection request pending');
        } else {
          setError(`Connection failed: ${errorCode}`);
        }
      } else {
        setError('Failed to connect wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setError(null);
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkIfWalletIsConnected();

      // Listen for account changes
      if (window.ethereum) {
        const handleAccountsChanged = (...args: unknown[]) => {
          const accounts = args[0] as string[];
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            disconnectWallet();
          }
        };

        const handleChainChanged = () => {
          window.location.reload();
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          }
        };
      }
    }
  }, []);

  const value: Web3ContextType = {
    account,
    provider,
    signer,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    checkIfWalletIsConnected,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
} 