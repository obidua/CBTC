import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, DollarSign, Package, Activity, ExternalLink } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useContractData } from '../hooks/useContractData';
import { formatEther } from 'ethers';

interface PurchaseHistory {
  id: string;
  tokenAmount: string;
  usdtPaid: string;
  roundStart: number;
  roundEnd: number;
  txHash: string;
  createdAt: string;
}

export function Dashboard() {
  const { address, isCorrectNetwork } = useWallet();
  const { data } = useContractData();
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);

  useEffect(() => {
    if (data?.userPurchased && data.userPurchased > 0n) {
      const mockPurchases: PurchaseHistory[] = [
        {
          id: '1',
          tokenAmount: formatEther(data.userPurchased),
          usdtPaid: '0',
          roundStart: 0,
          roundEnd: 0,
          txHash: '0x...',
          createdAt: new Date().toISOString(),
        },
      ];
      setPurchases(mockPurchases);
    }
  }, [data]);

  // Static demo data matching smart contract
  const staticDemoData = {
    totalPurchased: '50,000',
    totalInvested: '55,000',
    avgPrice: '1.10',
    transactions: 3,
    purchases: [
      {
        id: '1',
        tokenAmount: '30000',
        usdtPaid: '30000',
        roundStart: 0,
        roundEnd: 0,
        txHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        createdAt: '2025-01-15T10:30:00Z'
      },
      {
        id: '2',
        tokenAmount: '15000',
        usdtPaid: '17500',
        roundStart: 0,
        roundEnd: 1,
        txHash: '0x891e54Da8C9c3F2E6bE7C5C9F5D5E5C2B9A7F4D',
        createdAt: '2025-02-10T14:20:00Z'
      },
      {
        id: '3',
        tokenAmount: '5000',
        usdtPaid: '7500',
        roundStart: 1,
        roundEnd: 1,
        txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        createdAt: '2025-02-28T09:15:00Z'
      }
    ]
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
            <p className="text-slate-400">Track your CBTC investments and portfolio</p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-400 font-medium mb-1">Demo Mode - Connect Wallet to Access Your Dashboard</p>
                <p className="text-orange-300/80 text-sm">The data below is for demonstration purposes. Connect your wallet to view your actual portfolio.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{staticDemoData.totalPurchased}</div>
              <div className="text-slate-400 text-sm">Total CBTC Purchased</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">${staticDemoData.totalInvested}</div>
              <div className="text-slate-400 text-sm">Total Invested (USDT)</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">${staticDemoData.avgPrice}</div>
              <div className="text-slate-400 text-sm">Average Price per CBTC</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{staticDemoData.transactions}</div>
              <div className="text-slate-400 text-sm">Total Transactions</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Purchase History</h2>
                <div className="space-y-4">
                  {staticDemoData.purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-white font-semibold text-lg">
                            {Number(purchase.tokenAmount).toLocaleString()} CBTC
                          </div>
                          <div className="text-slate-400 text-sm">
                            {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{purchase.usdtPaid} USDT</div>
                          <div className="text-slate-400 text-sm">Round {purchase.roundStart + 1}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <a
                          href={`https://bscscan.com/tx/${purchase.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1"
                        >
                          <span className="font-mono">{purchase.txHash.slice(0, 10)}...</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Portfolio Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Purchased</span>
                      <span className="text-white font-medium">{staticDemoData.totalPurchased} CBTC</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Claimed</span>
                      <span className="text-white font-medium">15,000 CBTC</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                        style={{ width: '30%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Claimable</span>
                      <span className="text-white font-medium">35,000 CBTC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Claim?</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Check the claim page to see available tranches and claim your CBTC tokens.
                </p>
                <a
                  href="/claim"
                  className="block text-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all font-medium"
                >
                  Go to Claim Page
                </a>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full text-center px-4 py-2 bg-slate-700/50 text-slate-400 rounded-lg cursor-not-allowed"
                  >
                    Connect Wallet to Trade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Wrong Network</h2>
          <p className="text-slate-400">Please switch to BNB Smart Chain</p>
        </div>
      </div>
    );
  }

  const totalPurchased = data?.userPurchased || 0n;
  const hasPurchases = totalPurchased > 0n;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-slate-400">Track your CBTC investments and portfolio</p>
        </div>

        {!hasPurchases ? (
          <div className="text-center py-24">
            <Package className="w-20 h-20 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No Purchases Yet</h2>
            <p className="text-slate-400 mb-8">Start your investment journey by purchasing CBTC tokens</p>
            <a
              href="/presale"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all font-semibold"
            >
              <span>Go to Presale</span>
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatEther(totalPurchased).split('.')[0]}
                </div>
                <div className="text-slate-400 text-sm">Total CBTC Purchased</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">${staticDemoData.totalInvested}</div>
                <div className="text-slate-400 text-sm">Total Invested (USDT)</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">${staticDemoData.avgPrice}</div>
                <div className="text-slate-400 text-sm">Average Price per CBTC</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{purchases.length}</div>
                <div className="text-slate-400 text-sm">Total Transactions</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Purchase History</h2>

                  {purchases.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No purchase history available</p>
                      <p className="text-slate-500 text-sm mt-2">
                        Purchase records will appear here once synced
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <div
                          key={purchase.id}
                          className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="text-white font-semibold text-lg">
                                {Number(purchase.tokenAmount).toFixed(2)} CBTC
                              </div>
                              <div className="text-slate-400 text-sm">
                                {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">
                                {Number(purchase.usdtPaid).toFixed(2)} USDT
                              </div>
                              <div className="text-slate-400 text-sm">
                                Round {purchase.roundStart + 1}
                                {purchase.roundEnd !== purchase.roundStart &&
                                  ` - ${purchase.roundEnd + 1}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <a
                              href={`https://bscscan.com/tx/${purchase.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1"
                            >
                              <span className="font-mono">{purchase.txHash.slice(0, 10)}...</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Portfolio Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Purchased</span>
                        <span className="text-white font-medium">
                          {formatEther(totalPurchased).split('.')[0]} CBTC
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>

                    {data?.tranches && data.tranches.length > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Claimed</span>
                          <span className="text-white font-medium">0 CBTC</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                            style={{ width: '0%' }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Claimable</span>
                        <span className="text-white font-medium">
                          {formatEther(totalPurchased).split('.')[0]} CBTC
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Claim?</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Check the claim page to see available tranches and claim your CBTC tokens.
                  </p>
                  <a
                    href="/claim"
                    className="block text-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all font-medium"
                  >
                    Go to Claim Page
                  </a>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <a
                      href="/presale"
                      className="block text-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      Buy More CBTC
                    </a>
                    <a
                      href={`https://bscscan.com/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      <span>View on BscScan</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
