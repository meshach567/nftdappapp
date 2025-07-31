import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/contexts/Web3Context';

// Contract ABI - you'll need to replace this with the actual ABI after compilation
const CONTRACT_ABI = [
  "function checkAccess(address user) public view returns (bool)",
  "function hasAccess(address) public view returns (bool)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)"
];

// Contract address - replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export const useNFTVerification = () => {
  const { account, provider, isConnected } = useWeb3();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider && CONTRACT_ADDRESS) {
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      setContract(contractInstance);
    }
  }, [provider]);

  const checkNFTOwnership = useCallback(async () => {
    if (!contract || !account || !isConnected) {
      setError('Wallet not connected or contract not available');
      return false;
    }

    try {
      setIsChecking(true);
      setError(null);

      // Check if the user has access using the contract's checkAccess function
      const hasAccessResult = await contract.checkAccess(account);
      setHasAccess(hasAccessResult);

      return hasAccessResult;
    } catch (err) {
      console.error('Error checking NFT ownership:', err);
      setError('Failed to verify NFT ownership');
      setHasAccess(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [contract, account, isConnected]);

  const checkBalance = async () => {
    if (!contract || !account || !isConnected) {
      return 0;
    }

    try {
      const balance = await contract.balanceOf(account);
      return balance.toNumber();
    } catch (err) {
      console.error('Error checking balance:', err);
      return 0;
    }
  };

  // Auto-check when account changes
  useEffect(() => {
    if (account && contract && isConnected) {
      checkNFTOwnership();
    } else {
      setHasAccess(false);
    }
  }, [account, contract, isConnected, checkNFTOwnership]);

  return {
    hasAccess,
    isChecking,
    error,
    checkNFTOwnership,
    checkBalance,
  };
}; 