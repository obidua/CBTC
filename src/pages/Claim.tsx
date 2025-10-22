import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Clock, Gift, Calendar, Coins, TrendingUp, Award, Zap, Bitcoin } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useICOContract } from '../hooks/useContract';
import { useContractData } from '../hooks/useContractData';
import { formatEther } from 'ethers';
import { supabaseService } from '../services/supabaseService';

export function Claim() {
  const { address, isCorrectNetwork } = useWallet();
  const icoContract = useICOContract();

  const [claimingTranche, setClaimingTranche] = useState<number | null>(null);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Static demo data
  const staticData = {
    tranches: [
      { percentBps: 3000, start: BigInt(Math.floor(Date.now() / 1000) - 86400 * 30), end: BigInt(Math.floor(Date.now() / 1000) + 86400 * 30), enabled: true },
      { percentBps: 2000, start: BigInt(Math.floor(Date.now() / 1000) + 86400 * 30), end: BigInt(Math.floor(Date.now() / 1000) + 86400 * 60), enabled: true },
      { percentBps: 2000, start: BigInt(Math.floor(Date.now() / 1000) + 86400 * 60), end: BigInt(Math.floor(Date.now() / 1000) + 86400 * 90), enabled: true },
      { percentBps: 1500, start: BigInt(Math.floor(Date.now() / 1000) + 86400 * 90), end: BigInt(Math.floor(Date.now() / 1000) + 86400 * 120), enabled: true },
      { percentBps: 1500, start: BigInt(Math.floor(Date.now() / 1000) + 86400 * 120), end: BigInt(Math.floor(Date.now() / 1000) + 86400 * 150), enabled: true },
    ],
    userPurchased: BigInt('50000000000000000000000'),
    userClaims: new Map([[0, true]]),
  };

  const data = staticData;

  const handleClaim = async (trancheId: number) => {
    if (!address) {
      setError('Please connect your wallet to claim tokens');
      return;
    }

    setClaimingTranche(trancheId);
    setError('');
    setSuccess('');
    setTxHash('');

    // Demo mode - show informational message
    setError('Smart contracts not yet deployed. This is demo mode. Claims will be available once contracts are live.');
    setClaimingTranche(null);
  };

  const getTrancheStatus = (tranche: any, idx: number) => {
    const now = Math.floor(Date.now() / 1000);
    const start = Number(tranche.start);
    const end = Number(tranche.end);

    if (!tranche.enabled) return { status: 'disabled', label: 'Disabled', color: 'slate' };
    if (data?.userClaims.get(idx)) return { status: 'claimed', label: 'Claimed', color: 'green' };
    if (now < start) return { status: 'upcoming', label: 'Upcoming', color: 'blue' };
    if (now > end) return { status: 'expired', label: 'Expired', color: 'red' };
    return { status: 'active', label: 'Active Now', color: 'cyan' };
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCountdown = (timestamp: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const target = Number(timestamp);
    const diff = target - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };


  // Static demo data for display when wallet not connected
  const staticDemoData = {
    totalPurchased: '50,000',
    totalClaimed: '15,000',
    availableNow: '10,000',
    claimedCount: 2,
    totalTranches: 5,
    tranches: [
      {
        id: 1,
        percentage: 30,
        amount: '15,000',
        status: 'claimed',
        statusLabel: 'Claimed',
        startDate: 'Jan 15, 2025, 10:00 AM',
        endDate: 'Feb 15, 2025, 10:00 AM',
        color: 'green'
      },
      {
        id: 2,
        percentage: 20,
        amount: '10,000',
        status: 'active',
        statusLabel: 'Active Now',
        startDate: 'Feb 15, 2025, 10:00 AM',
        endDate: 'Mar 15, 2025, 10:00 AM',
        countdown: '15d 6h',
        color: 'cyan'
      },
      {
        id: 3,
        percentage: 20,
        amount: '10,000',
        status: 'upcoming',
        statusLabel: 'Upcoming',
        startDate: 'Mar 15, 2025, 10:00 AM',
        endDate: 'Apr 15, 2025, 10:00 AM',
        countdown: '45d 12h',
        color: 'blue'
      },
      {
        id: 4,
        percentage: 15,
        amount: '7,500',
        status: 'upcoming',
        statusLabel: 'Upcoming',
        startDate: 'Apr 15, 2025, 10:00 AM',
        endDate: 'May 15, 2025, 10:00 AM',
        countdown: '75d 18h',
        color: 'blue'
      },
      {
        id: 5,
        percentage: 15,
        amount: '7,500',
        status: 'upcoming',
        statusLabel: 'Upcoming',
        startDate: 'May 15, 2025, 10:00 AM',
        endDate: 'Jun 15, 2025, 10:00 AM',
        countdown: '105d 8h',
        color: 'blue'
      }
    ]
  };

  if (!address) {
    return (
      <div className="min-h-screen py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient-ocean mb-2">Claim Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-400 flex items-center space-x-1">
              <span>Manage and claim your</span>
              <Bitcoin className="w-4 h-4" />
              <span>CBTC token allocations</span>
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-400 font-medium mb-1">Demo Mode - Connect Wallet to Access Your Claims</p>
                <p className="text-orange-300/80 text-sm">The data below is for demonstration purposes. Connect your wallet to view your actual claim information.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Coins className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-cyan-400 mb-1">{staticDemoData.totalPurchased}</div>
              <div className="text-slate-400 text-sm">Total Purchased</div>
            </div>

            <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">{staticDemoData.totalClaimed}</div>
              <div className="text-slate-400 text-sm">Already Claimed</div>
            </div>

            <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-1">{staticDemoData.availableNow}</div>
              <div className="text-slate-400 text-sm">Available Now</div>
            </div>

            <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {staticDemoData.claimedCount} / {staticDemoData.totalTranches}
              </div>
              <div className="text-slate-400 text-sm">Tranches Claimed</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Claim Tranches</h2>
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-400 text-sm font-medium">1 Active</span>
              </span>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>Local timezone</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            {staticDemoData.tranches.map((tranche) => {
              const colorClasses = {
                cyan: {
                  border: 'border-cyan-500',
                  bg: 'bg-cyan-500/10',
                  text: 'text-cyan-400',
                  badge: 'bg-cyan-500/20 border-cyan-500/50',
                  button: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-neon-cyan',
                  glow: 'shadow-neon-cyan',
                },
                green: {
                  border: 'border-green-500',
                  bg: 'bg-green-500/10',
                  text: 'text-green-400',
                  badge: 'bg-green-500/20 border-green-500/50',
                  button: 'from-green-500 to-emerald-600',
                  glow: '',
                },
                blue: {
                  border: 'border-blue-500',
                  bg: 'bg-blue-500/10',
                  text: 'text-blue-400',
                  badge: 'bg-blue-500/20 border-blue-500/50',
                  button: 'from-blue-500 to-blue-600',
                  glow: '',
                },
              };

              const colors = colorClasses[tranche.color as keyof typeof colorClasses];

              return (
                <div
                  key={tranche.id}
                  className={`bg-ocean-card rounded-xl p-4 sm:p-6 lg:p-8 border ${
                    tranche.status === 'active' ? `${colors.border} ${colors.glow}` : 'border-cyan-500/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-white">Tranche {tranche.id}</h3>
                        <span
                          className={`px-3 py-1 border ${colors.badge} ${colors.text} rounded-full text-xs font-bold uppercase`}
                        >
                          {tranche.statusLabel}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-400">{tranche.percentage}% of your total holdings</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{tranche.amount}</div>
                      <div className="text-sm sm:text-base text-slate-400">CBTC</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-slate-400 text-xs mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Start Time</span>
                      </div>
                      <div className="text-white font-medium">{tranche.startDate}</div>
                    </div>
                    <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-slate-400 text-xs mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>End Time</span>
                      </div>
                      <div className="text-white font-medium">{tranche.endDate}</div>
                    </div>
                  </div>

                  {tranche.countdown && (
                    <div
                      className={`flex items-center space-x-2 ${colors.text} text-sm mb-6 bg-slate-900/50 border ${colors.border} rounded-lg p-3`}
                    >
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">
                        {tranche.status === 'upcoming'
                          ? `Opens in ${tranche.countdown}`
                          : `Closes in ${tranche.countdown}`}
                      </span>
                    </div>
                  )}

                  {tranche.status === 'active' && (
                    <button
                      disabled
                      className={`w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r ${colors.button} text-white rounded-xl transition-all font-semibold text-lg opacity-50 cursor-not-allowed`}
                    >
                      <Gift className="w-6 h-6" />
                      <span>Connect Wallet to Claim</span>
                    </button>
                  )}

                  {tranche.status === 'claimed' && (
                    <div className="flex items-center justify-center space-x-3 bg-green-500/10 border border-green-500/50 rounded-xl py-4 text-green-400">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold text-lg">Successfully Claimed</span>
                    </div>
                  )}

                  {tranche.status === 'upcoming' && (
                    <button
                      disabled
                      className="w-full px-8 py-4 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-xl font-semibold text-lg cursor-not-allowed"
                    >
                      Not Yet Available
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 shadow-neon-cyan">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Important Information</h3>
            </div>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Each tranche can only be claimed once during its active window</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Make sure to claim before the tranche window expires to avoid losing access</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Claimed tokens will be transferred directly to your connected wallet</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Gas fees apply for each claim transaction on BNB Smart Chain</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Wrong Network</h2>
          <p className="text-slate-400">Please switch to BNB Smart Chain</p>
        </div>
      </div>
    );
  }

  const totalPurchased = data.userPurchased;
  const hasPurchases = totalPurchased > 0n;

  const claimedCount = Array.from(data.userClaims.values()).filter(Boolean).length;
  const totalTranches = data.tranches.length;
  const activeTranches = data.tranches.filter((t, idx) => {
    const status = getTrancheStatus(t, idx);
    return status.status === 'active';
  }).length;

  let totalClaimedAmount = 0n;
  let totalAvailableAmount = 0n;

  data.tranches.forEach((tranche, idx) => {
    const amount = (totalPurchased * BigInt(tranche.percentBps)) / 10000n;
    if (data.userClaims.get(idx)) {
      totalClaimedAmount += amount;
    } else {
      const status = getTrancheStatus(tranche, idx);
      if (status.status === 'active') {
        totalAvailableAmount += amount;
      }
    }
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-ocean mb-2">Claim Dashboard</h1>
          <p className="text-slate-400 flex items-center space-x-1">
            <span>Manage and claim your</span>
            <Bitcoin className="w-4 h-4" />
            <span>CBTC token allocations</span>
          </p>
        </div>

        {!hasPurchases ? (
          <div className="bg-ocean-card card-ocean-glow rounded-2xl p-16 text-center">
            <Gift className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No Tokens to Claim</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              <span className="flex items-center space-x-1">
                <span>You need to purchase</span>
                <Bitcoin className="w-4 h-4" />
                <span>CBTC tokens first to be eligible for claiming</span>
              </span>
            </p>
            <a
              href="/presale"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl transition-all font-semibold shadow-neon-cyan"
            >
              <Zap className="w-5 h-5" />
              <span>Go to Presale</span>
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {formatEther(totalPurchased).split('.')[0]}
                </div>
                <div className="text-slate-400 text-sm">Total Purchased</div>
              </div>

              <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {formatEther(totalClaimedAmount).split('.')[0]}
                </div>
                <div className="text-slate-400 text-sm">Already Claimed</div>
              </div>

              <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {formatEther(totalAvailableAmount).split('.')[0]}
                </div>
                <div className="text-slate-400 text-sm">Available Now</div>
              </div>

              <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {claimedCount} / {totalTranches}
                </div>
                <div className="text-slate-400 text-sm">Tranches Claimed</div>
              </div>
            </div>

            {error && (
              <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start space-x-3 bg-green-500/10 border border-green-500/50 rounded-xl p-4 mb-6">
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
                      View Transaction on BscScan
                    </a>
                  )}
                </div>
              </div>
            )}

            {data.tranches.length === 0 ? (
              <div className="bg-ocean-card card-ocean-glow rounded-2xl p-16 text-center">
                <Calendar className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">No Claim Windows Yet</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Claim tranches will be announced soon. Check back later for updates.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Claim Tranches</h2>
                  <div className="flex items-center space-x-2">
                    {activeTranches > 0 && (
                      <span className="flex items-center space-x-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-cyan-400 text-sm font-medium">
                          {activeTranches} Active
                        </span>
                      </span>
                    )}
                    <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Local timezone</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-8">
                  {data.tranches.map((tranche, idx) => {
                    const status = getTrancheStatus(tranche, idx);
                    const claimableAmount = (totalPurchased * BigInt(tranche.percentBps)) / 10000n;
                    const countdown = getCountdown(
                      status.status === 'upcoming' ? tranche.start : tranche.end
                    );

                    const colorClasses = {
                      cyan: {
                        border: 'border-cyan-500',
                        bg: 'bg-cyan-500/10',
                        text: 'text-cyan-400',
                        badge: 'bg-cyan-500/20 border-cyan-500/50',
                        button: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-neon-cyan',
                        glow: 'shadow-neon-cyan',
                      },
                      green: {
                        border: 'border-green-500',
                        bg: 'bg-green-500/10',
                        text: 'text-green-400',
                        badge: 'bg-green-500/20 border-green-500/50',
                        button: 'from-green-500 to-emerald-600',
                        glow: '',
                      },
                      blue: {
                        border: 'border-blue-500',
                        bg: 'bg-blue-500/10',
                        text: 'text-blue-400',
                        badge: 'bg-blue-500/20 border-blue-500/50',
                        button: 'from-blue-500 to-blue-600',
                        glow: '',
                      },
                      red: {
                        border: 'border-red-500',
                        bg: 'bg-red-500/10',
                        text: 'text-red-400',
                        badge: 'bg-red-500/20 border-red-500/50',
                        button: 'from-red-500 to-red-600',
                        glow: '',
                      },
                      slate: {
                        border: 'border-slate-600',
                        bg: 'bg-slate-700/10',
                        text: 'text-slate-500',
                        badge: 'bg-slate-700/20 border-slate-600/50',
                        button: 'from-slate-600 to-slate-700',
                        glow: '',
                      },
                    };

                    const colors = colorClasses[status.color as keyof typeof colorClasses];

                    return (
                      <div
                        key={idx}
                        className={`bg-ocean-card rounded-xl p-8 border ${
                          status.status === 'active' ? `${colors.border} ${colors.glow}` : 'border-cyan-500/10'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-2xl font-bold text-white">Tranche {idx + 1}</h3>
                              <span
                                className={`px-3 py-1 border ${colors.badge} ${colors.text} rounded-full text-xs font-bold uppercase`}
                              >
                                {status.label}
                              </span>
                            </div>
                            <p className="text-slate-400">
                              {tranche.percentBps / 100}% of your total holdings
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-cyan-400">
                              {formatEther(claimableAmount).split('.')[0]}
                            </div>
                            <div className="text-slate-400">CBTC</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-4">
                            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-2">
                              <Calendar className="w-4 h-4" />
                              <span>Start Time</span>
                            </div>
                            <div className="text-white font-medium">{formatDate(tranche.start)}</div>
                          </div>
                          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-4">
                            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-2">
                              <Calendar className="w-4 h-4" />
                              <span>End Time</span>
                            </div>
                            <div className="text-white font-medium">{formatDate(tranche.end)}</div>
                          </div>
                        </div>

                        {countdown && (
                          <div
                            className={`flex items-center space-x-2 ${colors.text} text-sm mb-6 bg-slate-900/50 border ${colors.border} rounded-lg p-3`}
                          >
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">
                              {status.status === 'upcoming'
                                ? `Opens in ${countdown}`
                                : `Closes in ${countdown}`}
                            </span>
                          </div>
                        )}

                        {status.status === 'active' && (
                          <button
                            onClick={() => handleClaim(idx)}
                            disabled={claimingTranche === idx}
                            className={`w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r ${colors.button} text-white rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {claimingTranche === idx ? (
                              <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Processing Claim...</span>
                              </>
                            ) : (
                              <>
                                <Gift className="w-6 h-6" />
                                <span>Claim {formatEther(claimableAmount).split('.')[0]} CBTC</span>
                              </>
                            )}
                          </button>
                        )}

                        {status.status === 'claimed' && (
                          <div className="flex items-center justify-center space-x-3 bg-green-500/10 border border-green-500/50 rounded-xl py-4 text-green-400">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="font-semibold text-lg">Successfully Claimed</span>
                          </div>
                        )}

                        {status.status === 'upcoming' && (
                          <button
                            disabled
                            className="w-full px-8 py-4 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-xl font-semibold text-lg cursor-not-allowed"
                          >
                            Not Yet Available
                          </button>
                        )}

                        {status.status === 'expired' && (
                          <button
                            disabled
                            className="w-full px-8 py-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl font-semibold text-lg cursor-not-allowed"
                          >
                            Claim Window Expired
                          </button>
                        )}

                        {status.status === 'disabled' && (
                          <button
                            disabled
                            className="w-full px-8 py-4 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-xl font-semibold text-lg cursor-not-allowed"
                          >
                            Tranche Disabled
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 shadow-neon-cyan">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Important Information</h3>
                  </div>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>Each tranche can only be claimed once during its active window</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>Make sure to claim before the tranche window expires to avoid losing access</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>Claimed tokens will be transferred directly to your connected wallet</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>Gas fees apply for each claim transaction on BNB Smart Chain</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
