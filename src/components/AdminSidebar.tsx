import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileText,
  BarChart3,
  Settings,
  Wallet,
  TrendingUp,
  Clock,
  Shield,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & stats'
    },
    {
      id: 'ico-management',
      label: 'ICO Management',
      icon: ShoppingCart,
      description: 'Rounds & pricing'
    },
    {
      id: 'tranches',
      label: 'Tranches',
      icon: Clock,
      description: 'Vesting schedules'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      description: 'Investor management'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: FileText,
      description: 'Purchase history'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Reports & insights'
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      description: 'Funds management'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Configuration'
    },
  ];

  return (
    <>
      {/* Mobile horizontal menu */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 p-4 overflow-x-auto z-20">
        <div className="flex space-x-2 min-w-max">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0, width: collapsed ? 80 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-800/50 backdrop-blur-xl border-r border-slate-700 z-30"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-2"
                >
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-semibold">Admin Panel</span>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <motion.div
                    animate={{ rotate: isActive ? 360 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className={`flex-shrink-0 ${collapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                  </motion.div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className={`flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg ${
              collapsed ? 'justify-center' : ''
            }`}>
              <TrendingUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-white text-sm font-medium">ICO Active</div>
                    <div className="text-cyan-400 text-xs">All systems operational</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {collapsed && (
        <div className="fixed left-20 top-16 h-[calc(100vh-4rem)] w-0" />
      )}
      {!collapsed && (
        <div className="fixed left-64 top-16 h-[calc(100vh-4rem)] w-0" />
      )}
    </>
  );
}
