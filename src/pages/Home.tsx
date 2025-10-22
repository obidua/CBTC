import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, Users, ArrowRight, CheckCircle2, Bitcoin } from 'lucide-react';
import { formatEther } from 'ethers';

export function Home() {
  const data = null; // Static mode - no blockchain connection needed

  // Static demo data matching smart contract
  const staticData = {
    totalSold: '850,000',
    percentSold: 48.6,
    roundsLeft: 2,
    rounds: [
      { price: '1.00', allocation: '1000K', sold: 75 },
      { price: '2.00', allocation: '500K', sold: 10 },
      { price: '3.00', allocation: '250K', sold: 0 }
    ],
    currentRound: 0
  };

  const totalTokensForSale = data?.rounds.reduce((sum, round) => sum + round.cap, 0n) || 0n;
  const totalTokensSold = data?.rounds.reduce((sum, round) => sum + round.sold, 0n) || 0n;
  const percentSold = totalTokensForSale > 0n ? Number((totalTokensSold * 100n) / totalTokensForSale) : 0;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyOHYySDI0di0yaDEyem0wLTZ2Mkgy-NHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8 shadow-neon-cyan">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium">Live Presale Now</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight px-4">
              The Future of
              <br />
              <span className="text-gradient-ocean">
                Decentralized Finance
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
              A revolutionary BEP-20 token built on BNB Smart Chain. Secure your position in the future of decentralized finance with our structured presale featuring time-boxed claim tranches and transparent pricing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 px-4">
              <Link
                to="/presale"
                className="group flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl transition-all font-semibold text-base sm:text-lg shadow-neon-cyan w-full sm:w-auto"
              >
                <span className="flex items-center space-x-2">
                  <Bitcoin className="w-5 h-5" />
                  <span>Buy CBTC Now</span>
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/dashboard"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl transition-all font-semibold text-base sm:text-lg border border-cyan-500/30 w-full sm:w-auto text-center"
              >
                View Dashboard
              </Link>
            </div>

            <div className="pt-12 px-4">
              <div className="bg-ocean-card card-ocean-glow rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">
                      {data ? formatEther(totalTokensSold).split('.')[0] : staticData.totalSold}
                    </div>
                    <div className="text-slate-400 text-sm mt-1 flex items-center justify-center space-x-1">
                      <Bitcoin className="w-3 h-3" />
                      <span>CBTC Sold</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">
                      {data ? percentSold.toFixed(1) : staticData.percentSold}%
                    </div>
                    <div className="text-slate-400 text-sm mt-1">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">
                      {data ? data.rounds.length - data.currentRound : staticData.roundsLeft}
                    </div>
                    <div className="text-slate-400 text-sm mt-1">Rounds Left</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 text-cyan-400 text-sm font-medium">
                <span className="flex items-center space-x-2">
                  <span>ABOUT</span>
                  <Bitcoin className="w-4 h-4" />
                  <span>CBTC</span>
                </span>
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center space-x-3">
              <span>Why Choose</span>
              <Bitcoin className="w-8 h-8" />
              <span>CBTC?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              <span className="flex items-center space-x-2">
                <Bitcoin className="w-5 h-5" />
                <span>CBTC is a next-generation BEP-20 token on BNB Smart Chain, designed with advanced tokenomics and a structured distribution model that ensures fairness and long-term value for all participants.</span>
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-ocean-card rounded-xl p-6 bg-ocean-card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-neon-cyan">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Audited</h3>
              <p className="text-slate-400">
                Smart contracts audited by leading security firms. Your investment is protected.
              </p>
            </div>

            <div className="bg-ocean-card rounded-xl p-6 bg-ocean-card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-neon-cyan">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Transparent Tokenomics</h3>
              <p className="text-slate-400">
                Clear roadmap and fair distribution. No hidden allocations or surprises.
              </p>
            </div>

            <div className="bg-ocean-card rounded-xl p-6 bg-ocean-card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-neon-cyan">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast & Efficient</h3>
              <p className="text-slate-400">
                Built on BNB Smart Chain for lightning-fast transactions and low fees.
              </p>
            </div>

            <div className="bg-ocean-card rounded-xl p-6 bg-ocean-card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-neon-cyan">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community Driven</h3>
              <p className="text-slate-400">
                Join a growing community of investors and blockchain enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Presale Rounds</h2>
            <p className="text-slate-400 text-lg">Three rounds with increasing value</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data?.rounds || staticData.rounds).map((round, idx) => {
              const percentSold = data && 'cap' in round
                ? (round.cap > 0n ? Number((round.sold * 100n) / round.cap) : 0)
                : typeof round.sold === 'number' ? round.sold : 0;
              const isCurrent = data ? idx === data.currentRound : idx === staticData.currentRound;

              return (
                <div
                  key={idx}
                  className={`relative bg-ocean-card rounded-xl p-8 ${
                    isCurrent ? 'border-cyan-500 shadow-neon-cyan' : ''
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-neon-cyan">
                      ACTIVE NOW
                    </div>
                  )}

                  <div className="text-center space-y-4">
                    <div className="text-slate-400 text-sm font-medium">Round {idx + 1}</div>
                    <div className="text-4xl font-bold text-cyan-400">
                      ${data && 'price' in round && typeof round.price === 'bigint' ? formatEther(round.price) : String(round.price)}
                    </div>
                    <div className="text-slate-400 flex items-center space-x-1">
                      <span>per</span>
                      <Bitcoin className="w-3 h-3" />
                      <span>CBTC</span>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Allocation</span>
                        <span className="text-white font-medium">
                          {data && 'cap' in round ? (Number(formatEther(round.cap)) / 1000).toFixed(0) : ('allocation' in round ? round.allocation : '0')} CBTC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Sold</span>
                        <span className="text-white font-medium">{typeof percentSold === 'number' ? percentSold.toFixed(1) : percentSold}%</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                          style={{ width: `${percentSold}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Simple steps to join the presale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Link your MetaMask or compatible wallet' },
              { step: '2', title: 'Choose Amount', desc: 'Select how many 🪙 CBTC tokens to purchase' },
              { step: '3', title: 'Approve & Buy', desc: 'Approve USDT and complete the transaction' },
              { step: '4', title: 'Claim Tokens', desc: 'Claim your tokens during designated windows' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-neon-cyan">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 text-cyan-400 text-sm font-medium">
                TOKENOMICS
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center space-x-3">
              <Bitcoin className="w-10 h-10" />
              <span>CBTC Token Distribution</span>
            </h2>
            <p className="text-slate-400 text-lg flex items-center space-x-2">
              <span>Total Supply: 1,750,000</span>
              <Bitcoin className="w-5 h-5" />
              <span>CBTC</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-ocean-card card-ocean-glow rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Presale Allocation</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 font-medium">Round 1 - $1.00</span>
                    <span className="text-cyan-400 font-bold">1,000,000 CBTC</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{width: '57.1%'}}></div>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Best value - Early bird pricing</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 font-medium">Round 2 - $2.00</span>
                    <span className="text-cyan-400 font-bold">500,000 CBTC</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: '28.6%'}}></div>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">100% price increase from Round 1</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 font-medium">Round 3 - $3.00</span>
                    <span className="text-cyan-400 font-bold">250,000 CBTC</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{width: '14.3%'}}></div>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Final opportunity - 200% ROI for Round 1 buyers</p>
                </div>

                <div className="pt-4 border-t border-cyan-500/20">
                  <div className="flex justify-between text-lg">
                    <span className="text-white font-semibold">Total Presale</span>
                    <span className="text-cyan-400 font-bold">1,750,000 CBTC</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ocean-card card-ocean-glow rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Smart Contract Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Time-Boxed Claim Tranches</h4>
                    <p className="text-slate-400 text-sm">Tokens are released through scheduled tranches, ensuring controlled distribution and preventing market dumps</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Percentage-Based Claims</h4>
                    <p className="text-slate-400 text-sm">Each tranche unlocks a specific percentage of your holdings during defined time windows</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Reentrancy Protected</h4>
                    <p className="text-slate-400 text-sm">Built with OpenZeppelin-style security standards to prevent common exploits</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">BEP-20 Compatible</h4>
                    <p className="text-slate-400 text-sm">Fully compatible with all BNB Smart Chain wallets and DEX platforms</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Multi-Round Progressive Pricing</h4>
                    <p className="text-slate-400 text-sm">Automatic round advancement rewards early participants with lower prices</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">USDT Payment System</h4>
                    <p className="text-slate-400 text-sm">Purchase with USDT stablecoin for price stability and convenience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 shadow-neon-cyan">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">3 Rounds</div>
                <div className="text-slate-300">Progressive Pricing</div>
                <p className="text-slate-400 text-sm mt-2">$1 → $2 → $3 per token</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">1.75M</div>
                <div className="text-slate-300">Total Supply</div>
                <p className="text-slate-400 text-sm mt-2">Fixed cap ensures scarcity</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">200%</div>
                <div className="text-slate-300">Maximum ROI</div>
                <p className="text-slate-400 text-sm mt-2">For Round 1 early investors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-12 text-center shadow-neon-cyan">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-slate-300 text-lg mb-8">
              Join thousands of investors who are already part of the CBTC ecosystem
            </p>
            <Link
              to="/presale"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl transition-all font-semibold text-lg shadow-neon-cyan"
            >
              <span>Participate in Presale</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
