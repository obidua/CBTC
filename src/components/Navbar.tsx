import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X, Bitcoin } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useState } from 'react';

export function Navbar() {
  const { address, isConnecting, connect, disconnect, isCorrectNetwork, switchNetwork } = useWallet();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-neon-cyan group-hover:scale-110 transition-transform">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient-ocean block">
                  CBTC
                </span>
                <span className="text-[10px] text-cyan-400/60 uppercase tracking-wider">
                  Built on BNB Chain
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/')
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                Home
              </Link>
              <Link
                to="/presale"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/presale')
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                Presale
              </Link>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard')
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                Portfolio
              </Link>
              <Link
                to="/claim"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/claim')
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                Claim
              </Link>
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                Admin
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isCorrectNetwork && address && (
              <button
                onClick={switchNetwork}
                className="px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-400 text-sm font-medium rounded-lg transition-colors hover:bg-red-600/30"
              >
                Wrong Network
              </button>
            )}

{address ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">ACTIVE</span>
                </div>
                <button
                  onClick={disconnect}
                  className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg transition-all font-mono text-sm"
                >
                  <span>{formatAddress(address)}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 shadow-neon-cyan"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-cyan-500/20">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/presale"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/presale')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              Presale
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              Portfolio
            </Link>
            <Link
              to="/claim"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/claim')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              Claim
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/admin')
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              Admin
            </Link>

            {!isCorrectNetwork && address && (
              <button
                onClick={switchNetwork}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Wrong Network
              </button>
            )}

{address ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">ACTIVE</span>
                </div>
                <button
                  onClick={disconnect}
                  className="w-full px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg transition-all font-mono text-sm"
                >
                  {formatAddress(address)}
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg transition-all font-medium disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
