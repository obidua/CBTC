import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Sparkles,
  Lock,
  CheckCircle,
  Menu,
  X,
  Coins,
  Wallet,
  ChevronDown
} from 'lucide-react';

export function CryptoLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/95 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                CryptoPay
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#benefits" className="text-slate-300 hover:text-white transition-colors">Benefits</a>
              <a href="#security" className="text-slate-300 hover:text-white transition-colors">Security</a>
              <a href="#faq" className="text-slate-300 hover:text-white transition-colors">FAQ</a>
              <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition-all transform hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#benefits" className="block text-slate-300 hover:text-white transition-colors">Benefits</a>
              <a href="#security" className="block text-slate-300 hover:text-white transition-colors">Security</a>
              <a href="#faq" className="block text-slate-300 hover:text-white transition-colors">FAQ</a>
              <button className="w-full px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-slate-950 to-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">The Future of Digital Payments</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Send & Receive Crypto
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Like A Text Message
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Experience the simplest way to send, receive, and manage cryptocurrency across all chains.
              Powered by AI, secured by blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl font-semibold text-lg transition-all">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  $2.4B+
                </div>
                <div className="text-slate-400 text-sm mt-1">Transaction Volume</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  500K+
                </div>
                <div className="text-slate-400 text-sm mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  150+
                </div>
                <div className="text-slate-400 text-sm mt-1">Countries</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-slate-500" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              One Wallet.
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"> Every Chain.</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Access all your crypto in one place with seamless multi-chain support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Lightning Fast',
                description: 'Instant transactions across all supported blockchains',
                gradient: 'from-yellow-400 to-orange-500'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Bank-Grade Security',
                description: 'End-to-end encryption and multi-signature protection',
                gradient: 'from-cyan-400 to-blue-600'
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Global Access',
                description: 'Send crypto to anyone, anywhere in the world',
                gradient: 'from-green-400 to-emerald-600'
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI Powered',
                description: 'Smart payment assistant for seamless transactions',
                gradient: 'from-purple-400 to-pink-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Chain Support */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Support For All Major
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"> Blockchains</span>
            </h2>
            <p className="text-xl text-slate-400">
              Trade and transfer across multiple chains with ease
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Bitcoin', 'Ethereum', 'BNB Chain', 'Solana', 'Polygon', 'Avalanche', 'Ripple', 'Cardano', 'Polkadot', 'Cosmos', 'Optimism', 'Arbitrum'].map((chain, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center hover:border-cyan-500/50 transition-all hover:transform hover:scale-105 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{chain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Simplify Your
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Crypto Experience
                </span>
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                No more complicated addresses, confusing interfaces, or high fees.
                Just simple, secure payments.
              </p>

              <div className="space-y-4">
                {[
                  'Send crypto as easily as sending a text message',
                  'AI assistant guides you through every transaction',
                  'Lower fees than traditional crypto platforms',
                  'Built-in security with multi-signature support',
                  'Real-time notifications for all transactions'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button className="mt-8 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2">
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8">
                <div className="bg-slate-950 rounded-2xl p-6 mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full"></div>
                    <div>
                      <div className="font-semibold">Send Payment</div>
                      <div className="text-sm text-slate-400">To: John Doe</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">0.5 BTC</div>
                  <div className="text-slate-400">≈ $23,450 USD</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Network Fee</span>
                    <span className="text-white">$2.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Transaction Speed</span>
                    <span className="text-cyan-400">⚡ Instant</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Security</span>
                    <span className="text-green-400">✓ Verified</span>
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold">
                  Confirm Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Military-Grade Security</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Your Crypto Is
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"> Always Protected</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We use the latest security technology to keep your assets safe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'End-to-End Encryption',
                description: 'All messages and transactions are fully encrypted using military-grade protocols'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Multi-Signature Wallets',
                description: 'Require multiple approvals for large transactions to prevent unauthorized access'
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Biometric Authentication',
                description: 'Use fingerprint or face recognition for secure access to your wallet'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-3xl blur-2xl"></div>
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Join thousands of users already enjoying seamless crypto payments
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105">
                  Create Free Account
                </button>
                <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl font-semibold text-lg transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CryptoPay</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                The simplest way to send, receive, and manage cryptocurrency across all chains.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Features</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Security</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">API</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 CryptoPay. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
