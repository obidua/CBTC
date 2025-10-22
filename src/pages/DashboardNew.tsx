import { useState, useEffect } from 'react';
import { AlertCircle, Package, DollarSign, TrendingUp, Activity, ExternalLink, ShoppingCart, Loader2, CheckCircle2, Bitcoin, Wallet, Settings, Copy, Link as LinkIcon, Users } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useContractData } from '../hooks/useContractData';
import { useICOContract, useUSDTContract } from '../hooks/useContract';
import { formatEther, parseEther } from 'ethers';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { supabaseService, PurchaseRecord, ClaimRecord, ActivityLog } from '../services/supabaseService';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../lib/constants';

export function DashboardNew() {
  const { address, isCorrectNetwork } = useWallet();
  const { data, refetch } = useContractData();
  const icoContract = useICOContract();
  const usdtContract = useUSDTContract();

  const [activeTab, setActiveTab] = useState('overview');
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalPurchased: 0,
    totalClaimed: 0,
    avgPrice: 0,
    purchaseCount: 0,
    claimCount: 0,
  });

  // Static demo data
  const staticDemoData = {
    totalInvested: 55000,
    totalPurchased: 50000,
    totalClaimed: 15000,
    avgPrice: 1.10,
    purchaseCount: 3,
    claimCount: 2,
    purchases: [
      {
        id: '1',
        wallet_address: address || '0x...',
        token_amount: '30000',
        usdt_paid: '30000',
        round_start: 0,
        round_end: 0,
        tx_hash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        block_number: 12345,
        created_at: '2025-01-15T10:30:00Z'
      },
      {
        id: '2',
        wallet_address: address || '0x...',
        token_amount: '15000',
        usdt_paid: '17500',
        round_start: 0,
        round_end: 1,
        tx_hash: '0x891e54Da8C9c3F2E6bE7C5C9F5D5E5C2B9A7F4D',
        block_number: 12346,
        created_at: '2025-02-10T14:20:00Z'
      },
      {
        id: '3',
        wallet_address: address || '0x...',
        token_amount: '5000',
        usdt_paid: '7500',
        round_start: 1,
        round_end: 1,
        tx_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        block_number: 12347,
        created_at: '2025-02-28T09:15:00Z'
      }
    ],
    activity: [
      { id: '1', wallet_address: address || '0x...', type: 'purchase', amount: '30000', tx_hash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', created_at: '2025-01-15T10:30:00Z' },
      { id: '2', wallet_address: address || '0x...', type: 'purchase', amount: '15000', tx_hash: '0x891e54Da8C9c3F2E6bE7C5C9F5D5E5C2B9A7F4D', created_at: '2025-02-10T14:20:00Z' },
      { id: '3', wallet_address: address || '0x...', type: 'claim', amount: '15000', tx_hash: '0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', created_at: '2025-03-01T11:00:00Z' },
      { id: '4', wallet_address: address || '0x...', type: 'purchase', amount: '5000', tx_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', created_at: '2025-02-28T09:15:00Z' }
    ]
  };

  // Use static data when no real data is available
  const displayStats = stats.purchaseCount > 0 ? stats : staticDemoData;
  const displayPurchases = purchases.length > 0 ? purchases : staticDemoData.purchases;
  const displayActivity = activityLog.length > 0 ? activityLog : staticDemoData.activity;

  // Quick buy state
  const [tokenAmount, setTokenAmount] = useState('');
  const [usdtCost, setUsdtCost] = useState('0');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [usdtAllowance, setUsdtAllowance] = useState('0');
  const [isApproving, setIsApproving] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    if (address) {
      loadUserData();
    }
  }, [address]);

  useEffect(() => {
    if (address && usdtContract && icoContract) {
      fetchBalances();
    }
  }, [address, usdtContract, icoContract]);

  const loadUserData = async () => {
    if (!address) return;

    const [purchaseData, claimData, activity, userStats] = await Promise.all([
      supabaseService.getPurchaseHistory(address),
      supabaseService.getClaimHistory(address),
      supabaseService.getActivityLog(address),
      supabaseService.getUserStats(address),
    ]);

    setPurchases(purchaseData);
    setClaims(claimData);
    setActivityLog(activity);
    setStats(userStats);
  };

  const fetchBalances = async () => {
    if (!usdtContract || !icoContract || !address) return;

    try {
      const [balance, allowance] = await Promise.all([
        usdtContract.balanceOf(address),
        usdtContract.allowance(address, await icoContract.getAddress()),
      ]);

      setUsdtBalance(formatEther(balance));
      setUsdtAllowance(formatEther(allowance));
    } catch (err) {
      console.error('Error fetching balances:', err);
    }
  };

  const calculateCost = (amount: string) => {
    if (!amount || !data || isNaN(Number(amount))) {
      setUsdtCost('0');
      return;
    }

    try {
      const amountBigInt = parseEther(amount);
      let remaining = amountBigInt;
      let cost = 0n;

      for (let i = data.currentRound; i < data.rounds.length && remaining > 0n; i++) {
        const round = data.rounds[i];
        const available = round.cap - round.sold;

        if (available === 0n) continue;

        const take = remaining <= available ? remaining : available;
        cost += (round.price * take) / parseEther('1');
        remaining -= take;

        if (remaining === 0n) break;
      }

      setUsdtCost(formatEther(cost));
    } catch (err) {
      console.error('Error calculating cost:', err);
      setUsdtCost('0');
    }
  };

  const handleAmountChange = (value: string) => {
    setTokenAmount(value);
    calculateCost(value);
    setError('');
    setSuccess('');
  };

  const handleApprove = async () => {
    if (!usdtContract || !icoContract) return;

    setIsApproving(true);
    setError('');
    setSuccess('');

    try {
      const amount = parseEther(usdtCost);
      const icoAddress = await icoContract.getAddress();
      const tx = await usdtContract.approve(icoAddress, amount);

      setSuccess('Approval submitted. Waiting for confirmation...');
      await tx.wait();

      setSuccess('USDT approved successfully!');
      await fetchBalances();
    } catch (err: any) {
      console.error('Approval error:', err);
      setError(err.message || 'Failed to approve USDT');
    } finally {
      setIsApproving(false);
    }
  };

  const handleBuy = async () => {
    if (!icoContract || !tokenAmount || !address) return;

    setIsBuying(true);
    setError('');
    setSuccess('');
    setTxHash('');

    try {
      const amount = parseEther(tokenAmount);
      const tx = await icoContract.buyTokens(amount);

      setTxHash(tx.hash);
      setSuccess('Purchase submitted. Waiting for confirmation...');

      const receipt = await tx.wait();

      await supabaseService.savePurchase({
        wallet_address: address,
        token_amount: tokenAmount,
        usdt_paid: usdtCost,
        round_start: data?.currentRound || 0,
        round_end: data?.currentRound || 0,
        tx_hash: tx.hash,
        block_number: receipt.blockNumber,
      });

      setSuccess('CBTC purchased successfully!');
      setTokenAmount('');
      setUsdtCost('0');
      await fetchBalances();
      await refetch();
      await loadUserData();
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Failed to purchase tokens');
    } finally {
      setIsBuying(false);
    }
  };

  const needsApproval = Number(usdtAllowance) < Number(usdtCost);
  const hasInsufficientBalance = Number(usdtBalance) < Number(usdtCost);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Not Connected</h2>
          <p className="text-slate-400">Please connect your wallet to view your dashboard</p>
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pt-24 lg:pt-8 lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Bitcoin className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Overview</h1>
              </div>
              <p className="text-sm sm:text-base text-slate-400 ml-13 flex items-center space-x-1">
                <span>Your</span>
                <Bitcoin className="w-4 h-4" />
                <span>CBTC investment summary</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {displayStats.totalPurchased.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm flex items-center space-x-1">
                  <span>Total</span>
                  <Bitcoin className="w-3 h-3" />
                  <span>CBTC Purchased</span>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 hover:border-blue-500/30 transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  ${displayStats.totalInvested.toLocaleString()}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">Total Invested (USDT)</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 hover:border-green-500/30 transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Bitcoin className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  ${displayStats.avgPrice.toFixed(2)}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm flex items-center space-x-1">
                  <span>Average Price per</span>
                  <Bitcoin className="w-3 h-3" />
                  <span>CBTC</span>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 hover:border-cyan-500/30 transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{displayStats.purchaseCount}</div>
                <div className="text-slate-400 text-xs sm:text-sm">Total Transactions</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                {displayActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayActivity.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="bg-slate-900/50 rounded-lg p-4 flex items-start space-x-3"
                      >
                        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{'description' in log ? log.description : `${'type' in log ? log.type : ''} ${'amount' in log ? log.amount : ''} CBTC`}</p>
                          <p className="text-slate-400 text-sm">
                            {new Date(log.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Portfolio Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Purchased</span>
                        <span className="text-white font-medium flex items-center space-x-1">
                          <span>{displayStats.totalPurchased.toLocaleString()}</span>
                          <Bitcoin className="w-3 h-3" />
                          <span>CBTC</span>
                        </span>
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
                        <span className="text-white font-medium flex items-center space-x-1">
                          <span>{displayStats.totalClaimed.toFixed(2)}</span>
                          <Bitcoin className="w-3 h-3" />
                          <span>CBTC</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                          style={{
                            width:
                              displayStats.totalPurchased > 0
                                ? `${(displayStats.totalClaimed / displayStats.totalPurchased) * 100}%`
                                : '0%',
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('buy')}
                      className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all font-medium"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <Bitcoin className="w-4 h-4" />
                        <span>Buy CBTC</span>
                      </span>
                    </button>
                    <a
                      href="/claim"
                      className="block text-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      Claim Tokens
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buy Tab */}
        {activeTab === 'buy' && (
          <div>
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Bitcoin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white flex items-center space-x-2">
                    <span>Buy</span>
                    <Bitcoin className="w-6 h-6" />
                    <span>CBTC Tokens</span>
                  </h1>
                  <p className="text-slate-400 flex items-center space-x-1">
                    <span>Purchase</span>
                    <Bitcoin className="w-4 h-4" />
                    <span>CBTC directly from your dashboard</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* ICO Stats */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm">Round</span>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded">Active</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">Round {data ? (data.currentRound + 1) : '1'}</div>
                <div className="text-slate-400 text-sm">Current ICO Round</div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm">Price</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  ${data ? formatEther(data.rounds[data.currentRound]?.price || 0n) : '1.00'}
                </div>
                <div className="text-slate-400 text-sm">per CBTC</div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm">Sold</span>
                  <Activity className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {data ? `${((data.rounds[data.currentRound]?.sold || 0n) * 100n / (data.rounds[data.currentRound]?.cap || 1n))}%` : '45%'}
                </div>
                <div className="text-slate-400 text-sm">of this round</div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 sm:p-8 shadow-xl shadow-amber-500/5">
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <span className="text-slate-400 text-sm">Current Price</span>
                    </div>
                    <span className="text-3xl font-bold text-white">
                      ${data ? formatEther(data.rounds[data.currentRound]?.price || 0n) : '1.00'}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wallet className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-400 text-sm">Your USDT Balance</span>
                    </div>
                    <span className="text-3xl font-bold text-white">{Number(usdtBalance || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-3">
                      <span className="flex items-center space-x-2">
                        <Bitcoin className="w-4 h-4 text-amber-400" />
                        <span>Amount of CBTC to purchase</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tokenAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 pr-20 text-white text-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">CBTC</span>
                    </div>
                  </div>

                  {tokenAmount && (
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Cost in USDT</span>
                        <span className="text-3xl font-bold text-white">
                          ${Number(usdtCost).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-start space-x-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-green-400 text-sm">{success}</p>
                        {txHash && (
                          <a
                            href={`https://bscscan.com/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 text-xs underline mt-1 inline-block"
                          >
                            View on BscScan
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {hasInsufficientBalance && tokenAmount && (
                    <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">
                        Insufficient USDT balance. You need {Number(usdtCost).toFixed(2)} USDT but only
                        have {Number(usdtBalance).toFixed(2)} USDT.
                      </p>
                    </div>
                  )}

                  {needsApproval && !hasInsufficientBalance && tokenAmount ? (
                    <button
                      onClick={handleApprove}
                      disabled={isApproving || !tokenAmount}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Approving...</span>
                        </>
                      ) : (
                        <span>Approve USDT</span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleBuy}
                      disabled={
                        isBuying || !tokenAmount || hasInsufficientBalance || needsApproval
                      }
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBuying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Purchasing...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <span>Buy CBTC</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Information Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Bitcoin className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">How to Buy</h3>
                  </div>
                  <ol className="space-y-3 text-slate-300 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Enter the amount of CBTC tokens you want to purchase</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Approve USDT spending (first-time only)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span>Confirm the purchase transaction in your wallet</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span>Wait for blockchain confirmation (usually 1-2 minutes)</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Quick Stats</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Min Purchase</span>
                      <span className="text-white font-medium">10 CBTC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Max Purchase</span>
                      <span className="text-white font-medium">100,000 CBTC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Payment Method</span>
                      <span className="text-white font-medium">USDT (BEP-20)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Network</span>
                      <span className="text-white font-medium">BNB Smart Chain</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase History Tab */}
        {activeTab === 'purchases' && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Purchase History</h1>
              <p className="text-slate-400">All your CBTC token purchases</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              {purchases.length === 0 ? (
                <div className="text-center py-24">
                  <Package className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-2">No Purchases Yet</h2>
                  <p className="text-slate-400 mb-8">Your purchase history will appear here</p>
                  <button
                    onClick={() => setActiveTab('buy')}
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all font-semibold"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Buy CBTC</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayPurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="bg-slate-900/50 rounded-lg p-6 hover:bg-slate-900/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-white font-semibold text-xl mb-1">
                            {Number(purchase.token_amount).toFixed(2)} CBTC
                          </div>
                          <div className="text-slate-400 text-sm">
                            {new Date(purchase.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium text-lg">
                            {Number(purchase.usdt_paid).toFixed(2)} USDT
                          </div>
                          <div className="text-slate-400 text-sm">
                            Round {purchase.round_start + 1}
                            {purchase.round_end !== purchase.round_start &&
                              ` - ${purchase.round_end + 1}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            'status' in purchase && purchase.status === 'completed'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {'status' in purchase ? purchase.status : 'completed'}
                        </span>
                        <a
                          href={`https://bscscan.com/tx/${purchase.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1 text-sm"
                        >
                          <span className="font-mono">{purchase.tx_hash.slice(0, 10)}...</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Claim History</h1>
              <p className="text-slate-400">All your token claims</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              {claims.length === 0 ? (
                <div className="text-center py-24">
                  <Package className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-2">No Claims Yet</h2>
                  <p className="text-slate-400 mb-8">Your claim history will appear here</p>
                  <a
                    href="/claim"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all font-semibold"
                  >
                    <span>Go to Claim Page</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="bg-slate-900/50 rounded-lg p-6 hover:bg-slate-900/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-white font-semibold text-xl mb-1">
                            {Number(claim.amount).toFixed(2)} CBTC
                          </div>
                          <div className="text-slate-400 text-sm">
                            {new Date(claim.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">Tranche {claim.tranche_id + 1}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                          {claim.status}
                        </span>
                        <a
                          href={`https://bscscan.com/tx/${claim.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1 text-sm"
                        >
                          <span className="font-mono">{claim.tx_hash.slice(0, 10)}...</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Activity Log</h1>
              <p className="text-slate-400">All your account activity</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              {activityLog.length === 0 ? (
                <div className="text-center py-24">
                  <Activity className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-2">No Activity Yet</h2>
                  <p className="text-slate-400">Your activity will appear here as you use the platform</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayActivity.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-900/50 rounded-lg p-4 flex items-start space-x-3 hover:bg-slate-900/70 transition-colors"
                    >
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-white font-medium">{'description' in log ? log.description : `${'type' in log ? log.type : ''} ${'amount' in log ? log.amount : ''}`}</p>
                          <span className="text-slate-400 text-xs whitespace-nowrap ml-4">
                            {new Date(log.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm capitalize">{'action_type' in log ? log.action_type : ('type' in log ? log.type : '')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Settings</h1>
              </div>
              <p className="text-sm sm:text-base text-slate-400 ml-13">
                View contract details and your referral information
              </p>
            </div>

            <div className="space-y-6">
              {/* Contract Information */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Bitcoin className="w-5 h-5 text-cyan-400" />
                  <span>Contract Information</span>
                </h2>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">ICO Contract Address</span>
                      <button
                        onClick={() => copyToClipboard(CONTRACT_ADDRESSES.CBTC_ICO, 'ico')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {copiedField === 'ico' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-white font-mono text-sm break-all">{CONTRACT_ADDRESSES.CBTC_ICO}</p>
                    <a
                      href={`https://bscscan.com/address/${CONTRACT_ADDRESSES.CBTC_ICO}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-xs mt-2 inline-flex items-center space-x-1"
                    >
                      <span>View on BscScan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">CBTC Token Address</span>
                      <button
                        onClick={() => copyToClipboard(CONTRACT_ADDRESSES.CBTC_TOKEN, 'token')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {copiedField === 'token' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-white font-mono text-sm break-all">{CONTRACT_ADDRESSES.CBTC_TOKEN}</p>
                    <a
                      href={`https://bscscan.com/token/${CONTRACT_ADDRESSES.CBTC_TOKEN}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-xs mt-2 inline-flex items-center space-x-1"
                    >
                      <span>View on BscScan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">USDT Token Address</span>
                      <button
                        onClick={() => copyToClipboard(CONTRACT_ADDRESSES.USDT, 'usdt')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {copiedField === 'usdt' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-white font-mono text-sm break-all">{CONTRACT_ADDRESSES.USDT}</p>
                    <a
                      href={`https://bscscan.com/token/${CONTRACT_ADDRESSES.USDT}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-xs mt-2 inline-flex items-center space-x-1"
                    >
                      <span>View on BscScan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Network Information */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Network Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <span className="text-slate-400 text-sm block mb-1">Network</span>
                    <p className="text-white font-medium">{NETWORK_CONFIG.chainName}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <span className="text-slate-400 text-sm block mb-1">Chain ID</span>
                    <p className="text-white font-medium">{NETWORK_CONFIG.chainId}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <span className="text-slate-400 text-sm block mb-1">Native Currency</span>
                    <p className="text-white font-medium">{NETWORK_CONFIG.nativeCurrency.symbol}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <span className="text-slate-400 text-sm block mb-1">Block Explorer</span>
                    <a
                      href={NETWORK_CONFIG.blockExplorerUrls[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1"
                    >
                      <span>BscScan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                  <span>Your Account</span>
                </h2>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Wallet Address</span>
                      <button
                        onClick={() => copyToClipboard(address || '', 'wallet')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {copiedField === 'wallet' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-white font-mono text-sm break-all">{address}</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <LinkIcon className="w-5 h-5 text-amber-400" />
                      <span className="text-white font-semibold">Your Referral Link</span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-mono text-sm break-all flex-1">
                          {`${window.location.origin}/presale?ref=${address}`}
                        </p>
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/presale?ref=${address}`, 'referral')}
                          className="text-amber-400 hover:text-amber-300 transition-colors ml-2 flex-shrink-0"
                        >
                          {copiedField === 'referral' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Share this link to refer others and earn rewards when they purchase CBTC tokens
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-semibold">Sponsor Address</span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                      <p className="text-slate-400 text-sm mb-2">
                        If you were referred, your sponsor address will appear here
                      </p>
                      <p className="text-white font-mono text-sm">
                        Not referred
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white">Important Information</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Always verify contract addresses before making any transactions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Add the CBTC token to your wallet using the token address above</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Keep your referral link safe and share it with potential investors</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Never share your private keys or seed phrase with anyone</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
