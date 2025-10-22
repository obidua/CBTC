export const CONTRACT_ADDRESSES = {
  CBTC_ICO: import.meta.env.VITE_ICO_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  CBTC_TOKEN: import.meta.env.VITE_CBTC_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  USDT: import.meta.env.VITE_USDT_ADDRESS || '0x55d398326f99059fF775485246999027B3197955',
};

export const NETWORK_CONFIG = {
  chainId: 56,
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed1.binance.org'],
  blockExplorerUrls: ['https://bscscan.com'],
};

export const CBTC_ICO_ABI = [
  'function usdt() view returns (address)',
  'function cbtc() view returns (address)',
  'function rounds(uint256) view returns (uint256 price, uint256 cap, uint256 sold)',
  'function currentRound() view returns (uint256)',
  'function saleOpen() view returns (bool)',
  'function purchased(address) view returns (uint256)',
  'function tranches(uint256) view returns (uint16 percentBps, uint64 start, uint64 end, bool enabled)',
  'function trancheClaimed(uint256, address) view returns (bool)',
  'function roundsCount() view returns (uint256)',
  'function tranchesCount() view returns (uint256)',
  'function claimableFor(address, uint256) view returns (uint256)',
  'function buyTokens(uint256 tokenAmount)',
  'function claim(uint256 trancheId)',
  'function owner() view returns (address)',
  'event Buy(address indexed buyer, uint256 tokens, uint256 usdtPaid, uint256 roundStartIdx, uint256 roundEndIdx)',
  'event Claimed(address indexed user, uint256 indexed trancheId, uint256 amount)',
  'event TrancheAdded(uint256 indexed trancheId, uint16 percentBps, uint64 start, uint64 end)',
];

export const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];
