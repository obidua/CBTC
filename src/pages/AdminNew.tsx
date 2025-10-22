import { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock,
  Wallet,
  Edit2,
  Trash2,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useICOContract } from '../hooks/useContract';
import { useContractData } from '../hooks/useContractData';
import { formatEther, parseEther } from 'ethers';
import { AdminSidebar } from '../components/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminNew() {
  const { address, isCorrectNetwork } = useWallet();
  const icoContract = useICOContract();
  const { data, refetch } = useContractData();

  const [isOwner, setIsOwner] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [newTranche, setNewTranche] = useState({
    percentBps: '',
    startDate: '',
    endDate: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isTogglingTranche, setIsTogglingTranche] = useState<number | null>(null);
  const [isTogglingSale, setIsTogglingSale] = useState(false);

  const handleToggleSale = async () => {
    if (!icoContract || !data) return;

    setIsTogglingSale(true);
    setError('');
    setSuccess('');

    try {
      const tx = await icoContract.setSaleOpen(!data?.saleOpen);
      await tx.wait();

      setSuccess(`Sale ${!data?.saleOpen ? 'opened' : 'closed'} successfully!`);
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
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const totalTokensForSale = data?.rounds.reduce((sum, round) => sum + round.cap, 0n) || 0n;
  const totalTokensSold = data?.rounds.reduce((sum, round) => sum + round.sold, 0n) || 0n;
  const totalRaised = data?.rounds.reduce((sum, round) => {
    return sum + (round.sold * round.price) / parseEther('1');
  }, 0n) || 0n;

  const mockUsers = [
    { id: 1, address: '0x1234...5678', invested: '15,000', tokens: '150,000', date: '2024-10-15' },
    { id: 2, address: '0xabcd...efgh', invested: '25,000', tokens: '250,000', date: '2024-10-14' },
    { id: 3, address: '0x9876...5432', invested: '10,000', tokens: '100,000', date: '2024-10-13' },
  ];

  const mockTransactions = [
    { id: 1, user: '0x1234...5678', amount: '5,000', tokens: '50,000', status: 'Completed', date: '2024-10-15 14:30' },
    { id: 2, user: '0xabcd...efgh', amount: '10,000', tokens: '100,000', status: 'Completed', date: '2024-10-15 12:15' },
    { id: 3, user: '0x9876...5432', amount: '3,000', tokens: '30,000', status: 'Pending', date: '2024-10-15 10:00' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="ml-0 lg:ml-64 p-4 sm:p-6 pt-24 lg:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {activeSection === 'dashboard' && 'Dashboard Overview'}
              {activeSection === 'ico-management' && 'ICO Management'}
              {activeSection === 'tranches' && 'Tranche Management'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'transactions' && 'Transactions'}
              {activeSection === 'analytics' && 'Analytics & Reports'}
              {activeSection === 'wallet' && 'Wallet Management'}
              {activeSection === 'settings' && 'Settings'}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              {activeSection === 'dashboard' && 'Monitor your ICO performance'}
              {activeSection === 'ico-management' && 'Manage rounds and pricing'}
              {activeSection === 'tranches' && 'Configure vesting schedules'}
              {activeSection === 'users' && 'View and manage investors'}
              {activeSection === 'transactions' && 'Monitor all transactions'}
              {activeSection === 'analytics' && 'Detailed insights and reports'}
              {activeSection === 'wallet' && 'Manage funds and withdrawals'}
              {activeSection === 'settings' && 'Configure ICO settings'}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Admin</span>
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

        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/30 transition-all cursor-pointer"
                >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <ArrowUp className="w-4 h-4" />
                    <span>12%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  ${formatEther(totalRaised).split('.')[0]}
                </div>
                <div className="text-slate-400 text-sm">Total Raised (USDT)</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <ArrowUp className="w-4 h-4" />
                    <span>8%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatEther(totalTokensSold).split('.')[0]}
                </div>
                <div className="text-slate-400 text-sm">Tokens Sold</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <ArrowUp className="w-4 h-4" />
                    <span>24</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">1,247</div>
                <div className="text-slate-400 text-sm">Total Investors</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Live</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">Round {(data?.currentRound ?? 0) + 1}</div>
                <div className="text-slate-400 text-sm">Current Round</div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Rounds Progress</h2>
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {data?.rounds.map((round, idx) => {
                    const percentSold = Number((round.sold * 100n) / round.cap);
                    const isCurrent = idx === data?.currentRound;

                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-white font-medium">Round {idx + 1}</span>
                            {isCurrent && (
                              <span className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs px-2 py-1 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-white font-medium">{percentSold.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all"
                            style={{ width: `${percentSold}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Sold: {formatEther(round.sold).split('.')[0]} CBTC</span>
                          <span>${formatEther(round.price)} per token</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-4">
                  {mockTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">${tx.amount}</div>
                          <div className="text-slate-400 text-sm">{tx.user}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          tx.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {tx.status}
                        </div>
                        <div className="text-slate-400 text-xs">{tx.tokens} CBTC</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">ICO Status</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    data?.saleOpen
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {data?.saleOpen ? 'Open' : 'Closed'}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  {data?.saleOpen ? 'Accepting purchases' : 'Sale is paused'}
                </p>
                <button
                  onClick={handleToggleSale}
                  disabled={isTogglingSale}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    data?.saleOpen
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                  }`}
                >
                  {isTogglingSale ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : data?.saleOpen ? (
                    'Close Sale'
                  ) : (
                    'Open Sale'
                  )}
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Total Tranches</h3>
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {data?.tranches.length || 0}
                </div>
                <p className="text-slate-400 text-sm">Vesting schedules</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Avg. Investment</h3>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">$12,450</div>
                <p className="text-slate-400 text-sm">Per investor</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'ico-management' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Sale Controls</h2>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <h3 className="text-white font-medium mb-1">Presale Status</h3>
                  <p className="text-slate-400 text-sm">
                    {data?.saleOpen ? 'Sale is currently open' : 'Sale is currently closed'}
                  </p>
                </div>
                <button
                  onClick={handleToggleSale}
                  disabled={isTogglingSale}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    data?.saleOpen
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                  }`}
                >
                  {isTogglingSale ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : data?.saleOpen ? (
                    'Close Sale'
                  ) : (
                    'Open Sale'
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Rounds Configuration</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Round</span>
                </button>
              </div>

              <div className="space-y-4">
                {data?.rounds.map((round, idx) => {
                  const percentSold = Number((round.sold * 100n) / round.cap);
                  const isCurrent = idx === data?.currentRound;

                  return (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-white font-semibold text-lg">Round {idx + 1}</h3>
                          {isCurrent && (
                            <span className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-cyan-400">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Price per Token</div>
                          <div className="text-white font-semibold">${formatEther(round.price)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Total Cap</div>
                          <div className="text-white font-semibold">{formatEther(round.cap).split('.')[0]} CBTC</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Sold</div>
                          <div className="text-white font-semibold">{formatEther(round.sold).split('.')[0]} CBTC</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white font-medium">{percentSold.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all"
                            style={{ width: `${percentSold}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'tranches' && (
          <div className="space-y-6">
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
                      onChange={(e) => setNewTranche({ ...newTranche, percentBps: e.target.value })}
                      placeholder="10"
                      min="1"
                      max="100"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newTranche.startDate}
                      onChange={(e) => setNewTranche({ ...newTranche, startDate: e.target.value })}
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
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
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all font-semibold disabled:opacity-50"
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

              {(data?.tranches.length || 0) === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No tranches created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.tranches.map((tranche, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-semibold">Tranche {idx + 1}</span>
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
                        <button
                          onClick={() => handleToggleTranche(idx, tranche.enabled)}
                          disabled={isTogglingTranche === idx}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            tranche.enabled
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                              : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                          }`}
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

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-slate-400 text-sm">Percentage</span>
                          <div className="text-white font-semibold">{tranche.percentBps / 100}%</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Start Date</span>
                          <div className="text-white font-semibold">
                            {new Date(Number(tranche.start) * 1000).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">End Date</span>
                          <div className="text-white font-semibold">
                            {new Date(Number(tranche.end) * 1000).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by address..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Address</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Invested</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Tokens</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-white font-mono">{user.address}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-semibold">${user.invested}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-cyan-400">{user.tokens} CBTC</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-slate-400">{user.date}</span>
                        </td>
                        <td className="py-4 px-4">
                          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Tokens</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-white font-mono text-sm">{tx.user}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-semibold">${tx.amount}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-cyan-400">{tx.tokens} CBTC</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'Completed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-slate-400 text-sm">{tx.date}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Conversion Rate</h3>
                  <PieChart className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">68.5%</div>
                <p className="text-slate-400 text-sm">Visitor to investor</p>
                <div className="mt-4 flex items-center space-x-2 text-sm">
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">5.2% from last week</span>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Avg Purchase Size</h3>
                  <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">$12,450</div>
                <p className="text-slate-400 text-sm">Per transaction</p>
                <div className="mt-4 flex items-center space-x-2 text-sm">
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">12% from last month</span>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Daily Revenue</h3>
                  <LineChart className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">$85,240</div>
                <p className="text-slate-400 text-sm">Last 24 hours</p>
                <div className="mt-4 flex items-center space-x-2 text-sm">
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">18% from yesterday</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Performance Overview</h2>
              <div className="h-64 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Charts will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'wallet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Contract Balance</h2>
                  <Wallet className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-slate-400 text-sm mb-1">USDT Balance</div>
                    <div className="text-3xl font-bold text-white">${formatEther(totalRaised)}</div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-slate-400 text-sm mb-1">CBTC Balance</div>
                    <div className="text-3xl font-bold text-white">
                      {formatEther(totalTokensForSale - totalTokensSold)} CBTC
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Withdraw Funds</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      Amount (USDT)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all font-semibold">
                    <Download className="w-5 h-5" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Contract Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Owner Address</span>
                  <span className="text-white font-mono text-sm">{address}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Total Rounds</span>
                  <span className="text-white font-semibold">{data?.rounds.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Total Tranches</span>
                  <span className="text-white font-semibold">{data?.tranches.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-400">Network</span>
                  <span className="text-white font-semibold">BNB Smart Chain</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium mb-1">Email Notifications</h3>
                    <p className="text-slate-400 text-sm">Receive updates via email</p>
                  </div>
                  <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors">
                    Enabled
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium mb-1">Transaction Alerts</h3>
                    <p className="text-slate-400 text-sm">Get notified of all transactions</p>
                  </div>
                  <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors">
                    Enabled
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
