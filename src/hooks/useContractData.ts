import { useState, useEffect } from 'react';
import { useICOContract } from './useContract';
import { useWallet } from '../contexts/WalletContext';
import { ContractData, Round, Tranche } from '../types/contract';

export function useContractData() {
  const contract = useICOContract();
  const { address } = useWallet();
  const [data, setData] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!contract) {
      setError('Smart contract not configured. Please deploy contracts and update environment variables.');
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [roundsCount, tranchesCount, currentRound, saleOpen] = await Promise.all([
        contract.roundsCount(),
        contract.tranchesCount(),
        contract.currentRound(),
        contract.saleOpen(),
      ]);

      const roundsPromises = [];
      for (let i = 0; i < Number(roundsCount); i++) {
        roundsPromises.push(contract.rounds(i));
      }
      const roundsData = await Promise.all(roundsPromises);

      const rounds: Round[] = roundsData.map((r: any) => ({
        price: r.price,
        cap: r.cap,
        sold: r.sold,
      }));

      const tranchesPromises = [];
      for (let i = 0; i < Number(tranchesCount); i++) {
        tranchesPromises.push(contract.tranches(i));
      }
      const tranchesData = await Promise.all(tranchesPromises);

      const tranches: Tranche[] = tranchesData.map((t: any) => ({
        percentBps: Number(t.percentBps),
        start: t.start,
        end: t.end,
        enabled: t.enabled,
      }));

      let userPurchased = 0n;
      const userClaims = new Map<number, boolean>();

      if (address) {
        userPurchased = await contract.purchased(address);

        const claimsPromises = [];
        for (let i = 0; i < Number(tranchesCount); i++) {
          claimsPromises.push(contract.trancheClaimed(i, address));
        }
        const claimsData = await Promise.all(claimsPromises);
        claimsData.forEach((claimed, idx) => {
          userClaims.set(idx, claimed);
        });
      }

      setData({
        rounds,
        currentRound: Number(currentRound),
        saleOpen,
        tranches,
        userPurchased,
        userClaims,
      });
    } catch (err: any) {
      console.error('Error fetching contract data:', err);
      setError(err.message || 'Failed to fetch contract data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contract, address]);

  return { data, loading, error, refetch: fetchData };
}
