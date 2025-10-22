import { LayoutDashboard, ShoppingCart, Gift, History, TrendingUp, Settings } from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'buy', icon: ShoppingCart, label: 'Buy Tokens' },
    { id: 'purchases', icon: History, label: 'Purchase History' },
    { id: 'claims', icon: Gift, label: 'Claims' },
    { id: 'activity', icon: TrendingUp, label: 'Activity Log' },
  ];

  return (
    <>
      {/* Mobile horizontal menu */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-slate-900/50 backdrop-blur-xl border-b border-cyan-500/20 p-4 overflow-x-auto z-20">
        <div className="flex space-x-2 min-w-max">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
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
      <div className="hidden lg:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-slate-900/50 backdrop-blur-xl border-r border-cyan-500/20 p-6 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-white font-bold text-lg mb-1">Dashboard</h2>
        <p className="text-slate-400 text-sm">Manage your CBTC</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-cyan-500/20">
        <div className="space-y-2">
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-neon-cyan'
                : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
