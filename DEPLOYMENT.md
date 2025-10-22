# CBTC ICO Platform - Deployment Guide

This guide walks you through deploying the complete CBTC ICO platform from smart contracts to frontend.

## Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- BNB for deployment gas fees
- Supabase account (optional)
- Basic knowledge of Solidity and React

## Part 1: Smart Contract Deployment

### Step 1: Prepare Smart Contracts

The smart contracts are in the Solidity code provided. You have two contracts:
1. `CBTCToken` - The BEP-20 token
2. `CBTCICO` - The ICO/presale contract

### Step 2: Deploy to BNB Smart Chain

**Option A: Using Remix IDE**

1. Go to https://remix.ethereum.org
2. Create a new file and paste the smart contract code
3. Compile with Solidity 0.8.20
4. In the Deploy tab:
   - Set environment to "Injected Provider - MetaMask"
   - Connect to BNB Smart Chain (Chain ID: 56)
   - Deploy `CBTCToken` first with your wallet address as owner
   - Deploy `CBTCICO` with parameters:
     - `_owner`: Your wallet address
     - `_usdt`: `0x55d398326f99059fF775485246999027B3197955` (BNB Chain USDT)
     - `_cbtc`: Address of deployed CBTCToken

**Option B: Using Hardhat**

Create a Hardhat project and deploy script. See Hardhat documentation.

### Step 3: Verify Contracts

Verify your contracts on BscScan:
1. Go to https://bscscan.com
2. Find your contract
3. Click "Verify and Publish"
4. Enter contract details and code

### Step 4: Configure Token

After deployment:
1. Set token cap if desired: `setCap(totalSupply)`
2. Mint initial supply for presale: `mint(icoContractAddress, amount)`
3. Approve ICO contract to spend tokens if needed

### Step 5: Fund ICO Contract

Transfer CBTC tokens to the ICO contract so users can claim:
```
depositTokens(totalPresaleAmount)
```

## Part 2: Frontend Deployment

### Step 1: Clone and Install

```bash
git clone <your-repo>
cd cbtc-ico-platform
npm install
```

### Step 2: Configure Environment

Edit `.env` file:

```env
# Supabase (optional - can work without it)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Smart Contract Addresses (REQUIRED)
VITE_ICO_CONTRACT_ADDRESS=0xYourDeployedICOContractAddress
VITE_CBTC_TOKEN_ADDRESS=0xYourDeployedCBTCTokenAddress
VITE_USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
```

### Step 3: Test Locally

```bash
npm run dev
```

Visit http://localhost:5173 and test:
1. Wallet connection
2. Contract data loading
3. Purchase flow (on testnet first!)

### Step 4: Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

### Step 5: Deploy Frontend

**Option A: Vercel**

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Option B: Netlify**

1. Push code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

**Option C: Traditional Hosting**

1. Upload `dist/` folder contents to your web server
2. Configure server to serve `index.html` for all routes (SPA mode)
3. Set up SSL certificate

## Part 3: Post-Deployment Setup

### Configure Admin Access

The admin panel at `/admin` is only accessible by the contract owner. Make sure:
1. Your wallet is connected
2. You're on the correct network
3. Your address matches the contract owner

### Create Claim Tranches

From the admin panel:
1. Navigate to Tranches tab
2. Create tranches with:
   - Percentage (e.g., 10 for 10%)
   - Start date/time
   - End date/time
3. Enable tranches when ready

### Open Presale

From admin Settings tab:
1. Verify contracts are funded
2. Click "Open Sale"
3. Monitor analytics

## Part 4: Testing Checklist

Before going live with real funds:

### Smart Contract Testing
- [ ] Deploy to testnet first (BSC Testnet: 97)
- [ ] Test buying tokens
- [ ] Test claiming in different tranches
- [ ] Test admin functions
- [ ] Get contracts audited by professionals

### Frontend Testing
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test wallet connection/disconnection
- [ ] Test wrong network handling
- [ ] Test insufficient balance scenarios
- [ ] Test approval flow
- [ ] Test claim windows
- [ ] Test admin panel access control

### Security Testing
- [ ] Verify contract addresses are correct
- [ ] Test with small amounts first
- [ ] Ensure private keys are never exposed
- [ ] Verify RLS policies in Supabase
- [ ] Test for common vulnerabilities

## Part 5: Maintenance

### Monitoring

Monitor these regularly:
- Transaction success rate
- Gas usage
- User reports
- Contract events
- Server uptime

### Support

Prepare to handle:
- Failed transactions
- Wallet connection issues
- Network congestion
- Smart contract questions

### Updates

For frontend updates:
1. Test changes locally
2. Build new version
3. Deploy to staging first
4. Then deploy to production

For contract updates:
- Smart contracts are immutable
- Deploy new version if needed
- Update frontend contract addresses

## Troubleshooting

### "Transaction Failed"
- Check gas price
- Verify sufficient BNB balance
- Check contract is not paused
- Verify allowances

### "Contract Not Loading"
- Verify contract addresses in .env
- Check network connection
- Verify contracts are deployed

### "Wrong Network"
- Click "Switch Network" button
- Add BNB Smart Chain to MetaMask manually if needed

### Admin Panel Not Accessible
- Verify you're the contract owner
- Check wallet is connected
- Verify correct network

## Security Best Practices

1. **Never commit private keys** - Use environment variables
2. **Use hardware wallets** for production deployments
3. **Get contracts audited** before mainnet launch
4. **Test thoroughly** on testnet first
5. **Monitor constantly** after launch
6. **Have emergency plan** ready
7. **Keep dependencies updated**
8. **Use HTTPS** for frontend
9. **Implement rate limiting** if needed
10. **Backup everything** regularly

## Resources

- BscScan: https://bscscan.com
- MetaMask: https://metamask.io
- Remix IDE: https://remix.ethereum.org
- BNB Chain Docs: https://docs.bnbchain.org
- Supabase Docs: https://supabase.com/docs

## Support

For technical issues:
- Check documentation
- Review smart contract code
- Test on testnet first
- Consult blockchain developers if needed

## Legal Disclaimer

This is a technical implementation. Ensure you:
- Comply with local regulations
- Have proper legal documentation
- Understand securities laws in your jurisdiction
- Consult with legal professionals before launching
