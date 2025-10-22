# CBTC ICO Platform - Quick Start Guide

Get up and running in 5 minutes!

## What You Have

A complete ICO platform with:
- Beautiful landing page
- Token purchase system
- User dashboard
- Claim management
- Admin panel

## Quick Setup (Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file is already set up with Supabase. You just need to add your contract addresses:

```env
# Update these with your deployed contract addresses
VITE_ICO_CONTRACT_ADDRESS=0xYourICOContractAddress
VITE_CBTC_TOKEN_ADDRESS=0xYourCBTCTokenAddress
VITE_USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## For Testing (Without Real Contracts)

The platform will run even without deployed contracts! You'll see:
- Landing page working
- UI fully functional
- Contract addresses showing as placeholders
- Connect wallet works

When you connect a wallet, it will try to load contract data. If contracts aren't deployed yet, you'll see empty states.

## Next Steps

### Option A: Test with Mock Data
Just explore the UI without contracts deployed. Everything is built and ready.

### Option B: Deploy Contracts
1. Follow `DEPLOYMENT.md` to deploy smart contracts
2. Update `.env` with real addresses
3. Restart dev server
4. Test full functionality

## Key Pages

- **/** - Landing page with presale info
- **/presale** - Buy tokens here
- **/dashboard** - View your portfolio
- **/claim** - Claim tokens during tranches
- **/admin** - Admin panel (owner only)

## What Works Without Contracts

✅ All UI and navigation
✅ Responsive design
✅ Wallet connection
✅ Network detection
✅ Page routing
✅ Visual components

## What Needs Contracts

❌ Actual token purchases
❌ Real balance data
❌ Claiming tokens
❌ Admin functions
❌ Transaction submissions

## Default Configuration

- **Network**: BNB Smart Chain (Chain ID: 56)
- **Payment Token**: USDT (BEP-20)
- **Rounds**: 3 presale rounds pre-configured
- **Theme**: Dark mode with amber/orange accents

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Wallet Setup

1. Install MetaMask browser extension
2. Add BNB Smart Chain network (or use the auto-add feature)
3. Get some BNB for gas fees
4. Get some USDT for testing purchases

## Testing the Platform

### Without Deployed Contracts
1. Browse all pages
2. Test responsive design
3. Connect/disconnect wallet
4. Check network switching
5. Explore UI/UX

### With Deployed Contracts
1. Connect wallet
2. Buy small amount of tokens
3. Check dashboard
4. Wait for claim tranche
5. Claim tokens
6. Test admin panel (if owner)

## Customization

### Change Colors
Edit `tailwind.config.js` to change the color scheme.

### Change Text
Edit page files in `src/pages/` to update content.

### Add Features
All components are modular and easy to extend.

## Troubleshooting

**Port already in use?**
```bash
# Use different port
npm run dev -- --port 3000
```

**Wallet won't connect?**
- Make sure MetaMask is installed
- Check you're on BNB Smart Chain
- Try refreshing the page

**Build errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## File Structure (Quick Reference)

```
src/
├── pages/          # Main pages (Home, Presale, etc.)
├── components/     # Reusable UI components
├── contexts/       # React contexts (Wallet)
├── hooks/          # Custom hooks (useContract, etc.)
├── lib/            # Utils and constants
└── types/          # TypeScript types
```

## Environment Variables

```env
# Required for database features (optional)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Required for blockchain features (MUST SET)
VITE_ICO_CONTRACT_ADDRESS=...
VITE_CBTC_TOKEN_ADDRESS=...
VITE_USDT_ADDRESS=...
```

## Production Deployment

See `DEPLOYMENT.md` for full deployment guide.

Quick version:
1. Build: `npm run build`
2. Upload `dist/` folder to your host
3. Configure environment variables
4. Done!

## Getting Help

1. Check `README.md` for detailed info
2. Review `DEPLOYMENT.md` for deployment steps
3. See `FEATURES.md` for complete feature list
4. Review smart contract code for blockchain logic

## What's Next?

1. **Deploy Contracts**: Follow deployment guide
2. **Customize Design**: Update colors and text
3. **Test Everything**: Thoroughly test on testnet
4. **Go Live**: Deploy to production
5. **Market**: Promote your ICO!

## Important Notes

- Always test on testnet first (BSC Testnet: Chain ID 97)
- Never commit private keys or real .env values
- Get contracts audited before mainnet
- Monitor platform after launch

## Ready to Launch?

You now have everything you need:
- ✅ Complete frontend
- ✅ Smart contract integration
- ✅ Admin dashboard
- ✅ User features
- ✅ Documentation

Just deploy your contracts, update the addresses, and you're live!

Happy launching! 🚀
