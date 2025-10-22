import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2, TrendingUp, DollarSign, Coins, Clock, Target, Zap, Bitcoin } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useICOContract, useUSDTContract } from '../hooks/useContract';
import { formatEther, parseEther } from 'ethers';

export function Presale() {
  const { address, isCorrectNetwork } = useWallet();
  const icoContract = useICOContract();
  const usdtContract = useUSDTContract();

  // Static demo data
  const staticData = {
    rounds: [
      { price: parseEther('1.00'), cap: parseEther('1000000'), sold: parseEther('750000') },
      { price: parseEther('2.00'), cap: parseEther('500000'), sold: parseEther('50000') },
      { price: parseEther('3.00'), cap: parseEther('250000'), sold: parseEther('0') },
    ],
    currentRound: 0,
    saleOpen: true,
    userPurchased: parseEther('0'),
  };

  const data = staticData;
  const loading = false;

  const [tokenAmount, setTokenAmount] = useState('');
  const [usdtCost, setUsdtCost] = useState('0');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [usdtAllowance, setUsdtAllowance] = useState('0');
  const [isApproving, setIsApproving] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Static demo mode - set demo balances
    if (address) {
      setUsdtBalance('10000'); // Demo balance
      setUsdtAllowance('0');
    }
  }, [address]);

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
    if (!address) {
      setError('Please connect your wallet');
      return;
    }

    setIsApproving(true);
    setError('');
    setSuccess('');

    // Demo mode - simulate approval
    setTimeout(() => {
      setError('Smart contracts not yet deployed. This is demo mode. Purchases will be available once contracts are live.');
      setIsApproving(false);
    }, 1000);
  };

  const handleBuy = async () => {
    if (!tokenAmount || !address) {
      setError('Please connect your wallet and enter an amount');
      return;
    }

    setIsBuying(true);
    setError('');
    setSuccess('');
    setTxHash('');

    // Demo mode - show informational message
    setTimeout(() => {
      setError('Smart contracts not yet deployed. This is demo mode. Purchases will be available once contracts are live.');
      setIsBuying(false);
    }, 1000);
  };

  const needsApproval = Number(usdtAllowance) < Number(usdtCost);
  const hasInsufficientBalance = Number(usdtBalance) < Number(usdtCost);

  // Static demo data matching smart contract
  const staticPresaleData = {
    currentPrice: '1.00',
    totalSold: '850,000',
    totalProgress: 48.6,
    currentRound: 1,
    totalRounds: 3,
    saleOpen: true,
    rounds: [
      { price: '1.00', sold: '750000', cap: '1000000', percent: 75 },
      { price: '2.00', sold: '50000', cap: '500000', percent: 10 },
      { price: '3.00', sold: '0', cap: '250000', percent: 0 }
    ]
  };


  const currentRound = data.rounds[data.currentRound];
  const percentSold = currentRound ? Number((currentRound.sold * 100n) / currentRound.cap) : 0;
  const totalTokensForSale = data.rounds.reduce((sum, round) => sum + round.cap, 0n);
  const totalTokensSold = data.rounds.reduce((sum, round) => sum + round.sold, 0n);
  const totalPercentSold = totalTokensForSale > 0n ? Number((totalTokensSold * 100n) / totalTokensForSale) : 0;

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient-ocean">Presale Dashboard</h1>
            {data.saleOpen ? (
              <span className="flex items-center space-x-2 bg-green-500/20 border border-green-500/50 rounded-full px-3 sm:px-4 py-2 shadow-neon-green w-fit">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs sm:text-sm font-medium">PRESALE LIVE</span>
              </span>
            ) : (
              <span className="bg-red-500/20 border border-red-500/50 rounded-full px-3 sm:px-4 py-2 text-red-400 text-xs sm:text-sm font-medium w-fit">
                PRESALE CLOSED
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-slate-400 flex items-center space-x-1">
            <span>Secure your</span>
            <Bitcoin className="w-4 h-4" />
            <span>CBTC tokens at exclusive presale prices</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              ${currentRound ? formatEther(currentRound.price) : '0.00'}
            </div>
            <div className="text-slate-400 text-sm">Current Price</div>
          </div>

          <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatEther(totalTokensSold).split('.')[0]}
            </div>
            <div className="text-slate-400 text-sm flex items-center space-x-1">
              <span>Total</span>
              <Bitcoin className="w-3 h-3" />
              <span>CBTC Sold</span>
            </div>
          </div>

          <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {totalPercentSold.toFixed(1)}%
            </div>
            <div className="text-slate-400 text-sm">Total Progress</div>
          </div>

          <div className="bg-ocean-card card-ocean-glow rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-400 mb-1">
              Round {data.currentRound + 1}
            </div>
            <div className="text-slate-400 text-sm">of {data.rounds.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-ocean-card card-ocean-glow rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Current Round Progress</h2>
                <span className="text-cyan-400 font-mono text-lg">
                  Round {data.currentRound + 1}/{data.rounds.length}
                </span>
              </div>

              {currentRound && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-4">
                      <div className="text-slate-400 text-xs mb-1">TOKENS SOLD</div>
                      <div className="text-xl font-bold text-white">
                        {formatEther(currentRound.sold).split('.')[0]}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-4">
                      <div className="text-slate-400 text-xs mb-1">TOKENS AVAILABLE</div>
                      <div className="text-xl font-bold text-white">
                        {formatEther(currentRound.cap - currentRound.sold).split('.')[0]}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-slate-400">Round Progress</span>
                      <span className="text-cyan-400 font-bold">{percentSold.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 shadow-neon-cyan relative"
                        style={{ width: `${percentSold}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyan-500/20">
                    <div>
                      <div className="text-slate-400 text-sm mb-1">Total Cap</div>
                      <div className="text-white font-semibold">
                        {formatEther(currentRound.cap)} CBTC
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm mb-1">Sold</div>
                      <div className="text-white font-semibold">
                        {formatEther(currentRound.sold)} CBTC
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-ocean-card card-ocean-glow rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Bitcoin className="w-6 h-6" />
                <span>Buy CBTC Tokens</span>
              </h2>

              {!address ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-4">Connect your wallet to participate</p>
                  <p className="text-slate-500 text-sm">Click the "Connect Wallet" button in the navbar</p>
                </div>
              ) : !isCorrectNetwork ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-2">Wrong Network Detected</p>
                  <p className="text-slate-500 text-sm">Please switch to BNB Smart Chain</p>
                </div>
              ) : !data.saleOpen ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-2">Presale is Currently Closed</p>
                  <p className="text-slate-500 text-sm">Check back soon for updates</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-3">
                      <span className="flex items-center space-x-1">
                        <span>Amount of</span>
                        <Bitcoin className="w-3 h-3" />
                        <span>CBTC Tokens</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tokenAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="Enter amount (e.g., 1000)"
                        className="w-full bg-slate-900/50 border border-cyan-500/30 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-cyan-500 focus:shadow-neon-cyan transition-all"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                        CBTC
                      </div>
                    </div>
                  </div>

                  {tokenAmount && (
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-400 text-sm">You will pay</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-cyan-400">{Number(usdtCost).toFixed(2)}</div>
                          <div className="text-slate-400 text-sm">USDT</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm pt-4 border-t border-cyan-500/20">
                        <span className="text-slate-400">Price per token</span>
                        <span className="text-white font-medium">
                          ${currentRound ? formatEther(currentRound.price) : '0.00'}
                        </span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-start space-x-3 bg-green-500/10 border border-green-500/50 rounded-xl p-4">
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

                  {hasInsufficientBalance && tokenAmount && (
                    <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">
                        Insufficient USDT balance. You need {Number(usdtCost).toFixed(2)} USDT but only have{' '}
                        {Number(usdtBalance).toFixed(2)} USDT.
                      </p>
                    </div>
                  )}

                  {needsApproval && !hasInsufficientBalance && tokenAmount ? (
                    <button
                      onClick={handleApprove}
                      disabled={isApproving || !tokenAmount}
                      className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Approving USDT...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Approve USDT</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleBuy}
                      disabled={isBuying || !tokenAmount || hasInsufficientBalance || needsApproval}
                      className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-neon-cyan"
                    >
                      {isBuying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing Purchase...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span className="flex items-center space-x-2">
                            <Bitcoin className="w-5 h-5" />
                            <span>Buy CBTC Tokens</span>
                          </span>
                        </>
                      )}
                    </button>
                  )}

                  <p className="text-slate-500 text-xs text-center">
                    By purchasing, you agree to the terms and conditions of the CBTC presale
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-ocean-card card-ocean-glow rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Balances</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg">
                  <span className="text-slate-400 text-sm">USDT Balance</span>
                  <span className="text-cyan-400 font-bold text-lg">{Number(usdtBalance).toFixed(2)}</span>
                </div>
                {data.userPurchased > 0n && (
                  <div className="flex justify-between items-center p-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg">
                    <span className="text-slate-400 text-sm flex items-center space-x-1">
                      <Bitcoin className="w-3 h-3" />
                      <span>CBTC Purchased</span>
                    </span>
                    <span className="text-green-400 font-bold text-lg">{formatEther(data.userPurchased)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-ocean-card card-ocean-glow rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Presale Rounds</h3>
              <div className="space-y-3">
                {data.rounds.map((round, idx) => {
                  const isCurrent = idx === data.currentRound;
                  const isPast = idx < data.currentRound;
                  const percent = Number((round.sold * 100n) / round.cap);

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-neon-cyan'
                          : isPast
                          ? 'bg-slate-900/30 border border-green-500/30'
                          : 'bg-slate-900/50 border border-cyan-500/10'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">Round {idx + 1}</span>
                          {isCurrent && (
                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                              ACTIVE
                            </span>
                          )}
                          {isPast && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                              COMPLETED
                            </span>
                          )}
                        </div>
                        <span className={`font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`}>
                          ${formatEther(round.price)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{percent.toFixed(1)}% sold</span>
                        <span className="text-slate-400">
                          {formatEther(round.sold).split('.')[0]} / {formatEther(round.cap).split('.')[0]}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden mt-2">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCurrent
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                              : isPast
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                              : 'bg-slate-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6 shadow-neon-cyan">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Early Bird Advantage</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Lock in the lowest prices by purchasing early. Each round increases the token price by 25%, rewarding early supporters with maximum value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
