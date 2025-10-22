import { useState, useEffect } from 'react';
import { Shield, TrendingUp, Users, DollarSign, Settings, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useICOContract } from '../hooks/useContract';
import { useContractData } from '../hooks/useContractData';
import { formatEther, parseEther } from 'ethers';

export function Admin() {
  const { address, isCorrectNetwork } = useWallet();
  const icoContract = useICOContract();
  const { data, refetch } = useContractData();

  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tranches' | 'settings'>('overview');

  const [newTranche, setNewTranche] = useState({
    percentBps: '',
    startDate: '',
    endDate: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isTogglingTranche, setIsTogglingTranche] = useState<number | null>(null);
  const [isTogglingSale, setIsTogglingSale] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkOwnership();
  }, [icoContract, address]);

  const checkOwnership = async () => {
    if (!icoContract || !address) {
      setLoading(false);
      return;
    }

    try {
      const owner = await icoContract.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    } catch (err) {
      console.error('Error checking ownership:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSale = async () => {
    if (!icoContract || !data) return;

    setIsTogglingSale(true);
    setError('');
    setSuccess('');

    try {
      const tx = await icoContract.setSaleOpen(!data.saleOpen);
      await tx.wait();

      setSuccess(`Sale ${!data.saleOpen ? 'opened' : 'closed'} successfully!`);
      await refetch();
    } catch (err: any) {
      console.error('Toggle sale error:', err);
      setError(err.message || 'Failed to toggle sale status');
    } finally {
      setIsTogglingSale(false);
    }
  };

  const handleCreateTranche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!icoContract) return;

    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      const percentBps = Number(newTranche.percentBps) * 100;
      const start = Math.floor(new Date(newTranche.startDate).getTime() / 1000);
      const end = Math.floor(new Date(newTranche.endDate).getTime() / 1000);

      const tx = await icoContract.addTranche(percentBps, start, end, true);
      await tx.wait();

      setSuccess('Tranche created successfully!');
      setNewTranche({ percentBps: '', startDate: '', endDate: '' });
      await refetch();
    } catch (err: any) {
      console.error('Create tranche error:', err);
      setError(err.message || 'Failed to create tranche');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleTranche = async (trancheId: number, currentStatus: boolean) => {
    if (!icoContract) return;

    setIsTogglingTranche(trancheId);
    setError('');
    setSuccess('');

    try {
      const tx = await icoContract.setTrancheStatus(trancheId, !currentStatus);
      await tx.wait();

      setSuccess(`Tranche ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
      await refetch();
    } catch (err: any) {
      console.error('Toggle tranche error:', err);
      setError(err.message || 'Failed to toggle tranche');
    } finally {
      setIsTogglingTranche(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Not Connected</h2>
          <p className="text-slate-400">Please connect your wallet to access admin panel</p>
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

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You are not authorized to access the admin panel</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  const totalTokensForSale = data.rounds.reduce((sum, round) => sum + round.cap, 0n);
  const totalTokensSold = data.rounds.reduce((sum, round) => sum + round.sold, 0n);
  const totalRaised = data.rounds.reduce((sum, round) => {
    return sum + (round.sold * round.price) / parseEther('1');
  }, 0n);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-400">Manage your CBTC ICO</p>
          </div>
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 sm:px-4 py-2 w-fit">
            <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-green-400" />
            <span className="text-green-400 text-sm sm:text-base font-medium">Owner Access</span>
          </div>
        </div>

        {error && (
          <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start space-x-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        <div className="flex overflow-x-auto space-x-2 mb-6 sm:mb-8 border-b border-slate-700 -mx-4 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tranches')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'tranches'
                ? 'text-white border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tranches
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-white border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  ${formatEther(totalRaised).split('.')[0]}
                </div>
                <div className="text-slate-400 text-sm">Total Raised (USDT)</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatEther(totalTokensSold).split('.')[0]}
                </div>
                <div className="text-slate-400 text-sm">Tokens Sold</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {((totalTokensSold * 100n) / totalTokensForSale).toString()}%
                </div>
                <div className="text-slate-400 text-sm">Progress</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{data.currentRound + 1}</div>
                <div className="text-slate-400 text-sm">Current Round</div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Rounds Progress</h2>
              <div className="space-y-4">
                {data.rounds.map((round, idx) => {
                  const percentSold = Number((round.sold * 100n) / round.cap);
                  const isCurrent = idx === data.currentRound;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-medium">Round {idx + 1}</span>
                          {isCurrent && (
                            <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                          <span className="text-slate-400 text-sm">
                            ${formatEther(round.price)} per CBTC
                          </span>
                        </div>
                        <span className="text-white font-medium">{percentSold.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all"
                          style={{ width: `${percentSold}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Sold: {formatEther(round.sold).split('.')[0]} CBTC</span>
                        <span>Cap: {formatEther(round.cap).split('.')[0]} CBTC</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tranches' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create New Tranche</span>
              </h2>

              <form onSubmit={handleCreateTranche} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={newTranche.percentBps}
                      onChange={(e) =>
                        setNewTranche({ ...newTranche, percentBps: e.target.value })
                      }
                      placeholder="10"
                      min="1"
                      max="100"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newTranche.startDate}
                      onChange={(e) =>
                        setNewTranche({ ...newTranche, startDate: e.target.value })
                      }
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newTranche.endDate}
                      onChange={(e) => setNewTranche({ ...newTranche, endDate: e.target.value })}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all font-semibold disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Tranche</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Existing Tranches</h2>

              {data.tranches.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No tranches created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.tranches.map((tranche, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-white font-medium">Tranche {idx + 1}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              tranche.enabled
                                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                : 'bg-red-500/20 border border-red-500/30 text-red-400'
                            }`}
                          >
                            {tranche.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Percentage: </span>
                            <span className="text-white">{tranche.percentBps / 100}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Start: </span>
                            <span className="text-white">
                              {new Date(Number(tranche.start) * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">End: </span>
                            <span className="text-white">
                              {new Date(Number(tranche.end) * 1000).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleTranche(idx, tranche.enabled)}
                        disabled={isTogglingTranche === idx}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          tranche.enabled
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        } disabled:opacity-50`}
                      >
                        {isTogglingTranche === idx ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : tranche.enabled ? (
                          'Disable'
                        ) : (
                          'Enable'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Sale Controls</h2>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <h3 className="text-white font-medium mb-1">Presale Status</h3>
                  <p className="text-slate-400 text-sm">
                    {data.saleOpen
                      ? 'Sale is currently open for purchases'
                      : 'Sale is currently closed'}
                  </p>
                </div>
                <button
                  onClick={handleToggleSale}
                  disabled={isTogglingSale}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    data.saleOpen
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                  } disabled:opacity-50`}
                >
                  {isTogglingSale ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : data.saleOpen ? (
                    'Close Sale'
                  ) : (
                    'Open Sale'
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Contract Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Owner Address</span>
                  <span className="text-white font-mono text-sm">{address}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Total Rounds</span>
                  <span className="text-white">{data.rounds.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Total Tranches</span>
                  <span className="text-white">{data.tranches.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
