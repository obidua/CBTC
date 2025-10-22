# CBTC ICO Platform Setup Guide

This guide will help you configure the CBTC ICO platform to connect with deployed smart contracts on BNB Smart Chain.

## Current Status

The application is currently showing zero values because the smart contracts are not deployed or configured. The environment variables are set to placeholder addresses.

## Prerequisites

Before setting up the platform, ensure you have:

1. **BNB for Gas Fees**: You need BNB in your wallet to deploy contracts and perform transactions
2. **USDT on BNB Chain**: For testing purchases (mainnet: real USDT, testnet: testnet USDT)
3. **MetaMask or Compatible Wallet**: With BNB Smart Chain network configured
4. **Smart Contract Code**: The CBTC token and ICO contracts ready to deploy
5. **Node.js and npm**: Already installed if you're running this project

## Step 1: Choose Your Network

### Option A: BNB Smart Chain Testnet (Recommended for Testing)
- **Chain ID**: 97
- **RPC URL**: https://data-seed-prebsc-1-s1.binance.org:8545/
- **Block Explorer**: https://testnet.bscscan.com
- **Faucet**: https://testnet.bnbchain.org/faucet-smart

### Option B: BNB Smart Chain Mainnet (Production)
- **Chain ID**: 56
- **RPC URL**: https://bsc-dataseed1.binance.org
- **Block Explorer**: https://bscscan.com
- **Note**: Requires real BNB and involves real costs

## Step 2: Deploy Smart Contracts

### A. CBTC Token Contract (BEP-20)

Deploy a standard BEP-20 token contract with these features:
- Total supply: As per your tokenomics
- Name: "CBTC" (or your preferred name)
- Symbol: "CBTC"
- Decimals: 18

**After deployment, save the contract address!**

### B. ICO Contract

Deploy the ICO contract with these required functions:
- `buyTokens(uint256 tokenAmount)` - Purchase tokens with USDT
- `claim(uint256 trancheId)` - Claim tokens during tranche windows
- `addTranche(uint16 percentBps, uint64 start, uint64 end, bool enabled)` - Add claim tranches (owner only)
- `setSaleOpen(bool open)` - Enable/disable presale (owner only)

The contract should have:
- Reference to USDT token address
- Reference to CBTC token address
- Round configuration (prices, caps, sold amounts)
- Tranche configuration for claiming

**After deployment, save the contract address!**

### C. Configure Rounds

After deploying the ICO contract, configure the presale rounds:

```solidity
// Example rounds configuration
Round 1: $1.00 per token, 1,000,000 CBTC cap
Round 2: $2.00 per token, 500,000 CBTC cap
Round 3: $3.00 per token, 250,000 CBTC cap
```

### D. Configure Tranches

Set up claim tranches for token distribution:

```solidity
// Example tranches
Tranche 1: 30% at TGE (Token Generation Event)
Tranche 2: 20% after 30 days
Tranche 3: 20% after 60 days
Tranche 4: 15% after 90 days
Tranche 5: 15% after 120 days
```

## Step 3: Update Environment Variables

Edit the `.env` file in the project root:

```env
# Replace with your deployed ICO contract address
VITE_ICO_CONTRACT_ADDRESS=0xYourICOContractAddress

# Replace with your deployed CBTC token address
VITE_CBTC_TOKEN_ADDRESS=0xYourTokenContractAddress

# USDT address on BNB Smart Chain
# Mainnet: 0x55d398326f99059fF775485246999027B3197955
# Testnet: Get testnet USDT contract address
VITE_USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955

# Supabase configuration (already configured)
VITE_SUPABASE_URL=https://wqatlxrpjknupjoctdhj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Configure Supabase Database

The database tables should already be created. Verify these tables exist:

1. **users** - Stores user wallet addresses and metadata
2. **purchases** - Records all token purchases
3. **claims** - Records all token claims
4. **activity_log** - General activity logging

If tables don't exist, create them using the Supabase dashboard or migrations.

## Step 5: Restart Development Server

After updating environment variables:

```bash
# Stop the current server (Ctrl+C)
# Restart
npm run dev
```

The application should now connect to your deployed contracts!

## Step 6: Initial Testing

### Test the Connection

1. Open the application in your browser
2. The orange "Smart Contracts Not Configured" banner should disappear
3. Connect your wallet (MetaMask)
4. Switch to BNB Smart Chain network if prompted

### Test Presale Flow

1. Go to the Presale page
2. Verify that real data is showing (not zeros):
   - Current price should match your Round 1 price
   - Total sold should be 0 initially
   - Round information should be accurate

3. Try purchasing tokens:
   - Enter an amount
   - Approve USDT (first transaction)
   - Buy tokens (second transaction)
   - Verify purchase appears in dashboard

### Test Admin Panel

1. Go to `/admin` with the contract owner wallet
2. You should see contract statistics
3. Try adding a tranche
4. Try toggling sale status

## Troubleshooting

### Issue: Still seeing zeros after configuration

**Solutions:**
- Verify contract addresses are correct (no typos)
- Check that contracts are deployed to the correct network
- Ensure you're connected to the correct network in MetaMask
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R)

### Issue: "Wrong Network" message

**Solution:**
- The app is configured for BNB Smart Chain (Chain ID: 56)
- If testing on testnet, update `NETWORK_CONFIG` in `src/lib/constants.ts`
- Click the "Switch Network" button in the error message

### Issue: Can't approve USDT

**Solutions:**
- Ensure you have USDT in your wallet
- Check that USDT contract address is correct for your network
- Verify you have enough BNB for gas fees
- Try increasing gas limit in MetaMask

### Issue: Transaction fails

**Solutions:**
- Check that sale is open (admin can toggle)
- Ensure the round has available tokens
- Verify USDT allowance is sufficient
- Check that you're not exceeding round caps

## Network Configuration

The app is currently configured for BNB Mainnet. To use testnet:

Edit `src/lib/constants.ts`:

```typescript
export const NETWORK_CONFIG = {
  chainId: 97, // Change to 97 for testnet
  chainName: 'BNB Smart Chain Testnet', // Update name
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'], // Testnet RPC
  blockExplorerUrls: ['https://testnet.bscscan.com'], // Testnet explorer
};
```

## Security Considerations

1. **Never commit private keys** to the repository
2. **Keep owner wallet secure** - It has admin privileges
3. **Test thoroughly on testnet** before mainnet deployment
4. **Audit smart contracts** before deploying to mainnet
5. **Use hardware wallet** for mainnet operations
6. **Enable RLS on Supabase** tables to protect user data

## Need Help?

- Check contract deployment on BscScan
- Review contract functions and state
- Test with small amounts first
- Verify all environment variables
- Check browser console for errors

## Smart Contract Deployment Tools

You can deploy contracts using:
- **Remix IDE**: https://remix.ethereum.org
- **Hardhat**: Professional development environment
- **Truffle**: Alternative deployment framework
- **BSC Studio**: IDE for BSC development

## Post-Deployment Checklist

- [ ] CBTC token deployed and verified
- [ ] ICO contract deployed and verified
- [ ] Rounds configured in ICO contract
- [ ] Tranches configured in ICO contract
- [ ] Environment variables updated
- [ ] Application restarted
- [ ] Connection verified (no orange banner)
- [ ] Test purchase completed
- [ ] Supabase logging working
- [ ] Admin panel accessible
- [ ] Contract ownership verified

Once all items are checked, your CBTC ICO platform is fully operational!
