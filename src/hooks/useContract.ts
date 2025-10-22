import { useMemo } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import { CBTC_ICO_ABI, ERC20_ABI, CONTRACT_ADDRESSES } from '../lib/constants';

export function useICOContract() {
  const { signer, provider } = useWallet();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.CBTC_ICO || CONTRACT_ADDRESSES.CBTC_ICO === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;

    return new Contract(CONTRACT_ADDRESSES.CBTC_ICO, CBTC_ICO_ABI, signerOrProvider);
  }, [signer, provider]);
}

export function useUSDTContract() {
  const { signer, provider } = useWallet();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.USDT) return null;

    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;

    return new Contract(CONTRACT_ADDRESSES.USDT, ERC20_ABI, signerOrProvider);
  }, [signer, provider]);
}

export function useCBTCContract() {
  const { signer, provider } = useWallet();

  return useMemo(() => {
    if (!CONTRACT_ADDRESSES.CBTC_TOKEN || CONTRACT_ADDRESSES.CBTC_TOKEN === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;

    return new Contract(CONTRACT_ADDRESSES.CBTC_TOKEN, ERC20_ABI, signerOrProvider);
  }, [signer, provider]);
}
