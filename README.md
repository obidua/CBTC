# CBTC ICO Platform

A complete, production-ready ICO platform for the CBTC token built with React, TypeScript, Ethers.js, and Supabase.

## Features

### User Features
- **Landing Page**: Beautiful marketing page showcasing CBTC tokenomics
- **Wallet Connection**: Seamless integration with MetaMask and BNB Chain
- **Token Purchase**: Buy CBTC tokens across multiple presale rounds
- **User Dashboard**: Track your investments and portfolio
- **Token Claiming**: Claim tokens during designated tranche windows
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Admin Features
- **Admin Dashboard**: Owner-only access to manage the presale
- **Sale Controls**: Open/close the presale
- **Tranche Management**: Create and manage claim windows
- **Analytics**: Real-time stats on sales, users, and progress

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Ethers.js v6 (BNB Smart Chain)
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite

## Smart Contract Integration

This platform integrates with the CBTC ICO smart contracts:
- **CBTC ICO Contract**: Handles token sales and claiming
- **CBTC Token**: BEP-20 token
- **USDT**: Payment token (BNB Chain)

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_ICO_CONTRACT_ADDRESS=your_deployed_ico_contract_address
VITE_CBTC_TOKEN_ADDRESS=your_deployed_cbtc_token_address
VITE_USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
\`\`\`

### 3. Deploy Smart Contracts

Deploy the CBTC contracts to BNB Smart Chain:
1. Deploy `CBTCToken` contract
2. Deploy `CBTCICO` contract with required parameters
3. Update `.env` with contract addresses

### 4. Configure Supabase (Optional)

The platform can work without Supabase for basic functionality. For enhanced features:
1. Create a Supabase project
2. Run the migration in `src/lib/supabase.ts` comments
3. Configure RLS policies as needed

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

### 6. Build for Production

\`\`\`bash
npm run build
\`\`\`

## Usage Guide

### For Users

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask
2. **Buy Tokens**: Navigate to Presale page, enter amount, approve USDT, then buy
3. **View Portfolio**: Check Dashboard for your holdings
4. **Claim Tokens**: Visit Claim page during active tranche windows

### For Admins

1. **Access Admin Panel**: Navigate to `/admin` (owner wallet required)
2. **Manage Sale**: Open/close presale from Settings tab
3. **Create Tranches**: Add claim windows with percentage and dates
4. **Monitor Progress**: View real-time analytics on Overview tab

## Contract ABIs

The contract ABIs are defined in `src/lib/constants.ts`. Update these if you make changes to the smart contracts.

## Network Configuration

Default configuration is for BNB Smart Chain Mainnet:
- Chain ID: 56
- RPC URL: https://bsc-dataseed1.binance.org
- Explorer: https://bscscan.com

To use testnet, update `NETWORK_CONFIG` in `src/lib/constants.ts`.

## Security Considerations

- Never commit real private keys or sensitive data
- Always verify contract addresses before deployment
- Test thoroughly on testnet before mainnet
- Implement proper access controls for admin functions
- Use hardware wallets for production deployments

## Project Structure

\`\`\`
src/
├── components/       # Reusable UI components
│   └── Navbar.tsx
├── contexts/         # React contexts
│   └── WalletContext.tsx
├── hooks/           # Custom React hooks
│   ├── useContract.ts
│   └── useContractData.ts
├── lib/             # Utilities and constants
│   ├── constants.ts
│   └── supabase.ts
├── pages/           # Page components
│   ├── Home.tsx
│   ├── Presale.tsx
│   ├── Dashboard.tsx
│   ├── Claim.tsx
│   └── Admin.tsx
├── types/           # TypeScript types
│   └── contract.ts
├── App.tsx          # Main app component
└── main.tsx         # Entry point
\`\`\`

## Troubleshooting

### Wallet Connection Issues
- Ensure MetaMask is installed
- Check you're on BNB Smart Chain (Chain ID: 56)
- Try refreshing the page

### Transaction Failures
- Ensure sufficient BNB for gas
- Check USDT allowance is sufficient
- Verify contract addresses are correct

### Contract Not Loading
- Verify contract addresses in `.env`
- Check contract is deployed on correct network
- Ensure RPC endpoint is accessible

## License

MIT

## Support

For issues and questions, please open an issue on GitHub or contact the development team.
