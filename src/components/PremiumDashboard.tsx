'use client';

import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuth } from '@/contexts/AuthContext';

export default function PremiumDashboard() {
  const { account, disconnectWallet } = useWeb3();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'settings'>('overview');

  const handleLogout = () => {
    logout();
    disconnectWallet();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Premium Dashboard</h2>
          <p className="text-gray-300">
            Welcome back, <span className="text-blue-400 font-mono">{formatAddress(account || '')}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-8">
        {([
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'analytics', label: 'Analytics', icon: '📈' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">NFT Status</h3>
              <p className="text-2xl font-bold text-green-400">Active</p>
              <p className="text-sm text-gray-300 mt-1">Premium Access Granted</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Access Level</h3>
              <p className="text-2xl font-bold text-green-400">Premium</p>
              <p className="text-sm text-gray-300 mt-1">Full Feature Access</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
              <div className="text-3xl mb-2">🔐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
              <p className="text-2xl font-bold text-green-400">Verified</p>
              <p className="text-sm text-gray-300 mt-1">Wallet Authenticated</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Usage Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-300 mb-2">Login Sessions</h4>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full">
                    <div className="bg-white h-2 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">75% of monthly limit</p>
                </div>
                <div>
                  <h4 className="text-gray-300 mb-2">Feature Usage</h4>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full">
                    <div className="bg-white h-2 rounded-full w-9/10"></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">90% of features used</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'Dashboard accessed', time: '2 minutes ago', icon: '🔓' },
                  { action: 'NFT verified', time: '1 hour ago', icon: '✅' },
                  { action: 'Wallet connected', time: '2 hours ago', icon: '🔗' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-white">{activity.action}</p>
                      <p className="text-sm text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="wallet-address" className="block text-gray-300 mb-2">Wallet Address</label>
                  <input
                    id="wallet-address"
                    type="text"
                    value={account || ''}
                    readOnly
                    aria-label="Wallet address"
                    className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="nft-contract" className="block text-gray-300 mb-2">NFT Contract</label>
                  <input
                    id="nft-contract"
                    type="text"
                    value={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'Not configured'}
                    readOnly
                    aria-label="NFT contract address"
                    className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Auto-refresh data</span>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    Enabled
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Notifications</span>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
                    Disabled
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Features Banner */}
      <div className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-yellow-200 mb-2">🎉 Premium Features Unlocked!</h3>
        <p className="text-yellow-100">
          You now have access to exclusive features, advanced analytics, and priority support.
          Thank you for being a premium member!
        </p>
      </div>
    </div>
  );
} 