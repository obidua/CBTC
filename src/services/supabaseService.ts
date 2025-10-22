import { supabase } from '../lib/supabase';

export interface PurchaseRecord {
  id: string;
  wallet_address: string;
  token_amount: string;
  usdt_paid: string;
  round_start: number;
  round_end: number;
  tx_hash: string;
  block_number?: number;
  status: string;
  created_at: string;
}

export interface ClaimRecord {
  id: string;
  wallet_address: string;
  tranche_id: number;
  amount: string;
  tx_hash: string;
  block_number?: number;
  status: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  wallet_address: string;
  action_type: string;
  description: string;
  metadata?: any;
  created_at: string;
}

export const supabaseService = {
  async ensureUser(walletAddress: string) {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (!existingUser) {
        await supabase.from('users').insert({
          wallet_address: walletAddress.toLowerCase(),
        });
      } else {
        await supabase
          .from('users')
          .update({ last_seen: new Date().toISOString() })
          .eq('wallet_address', walletAddress.toLowerCase());
      }
    } catch (error) {
      console.error('Error ensuring user:', error);
    }
  },

  async savePurchase(purchase: Omit<PurchaseRecord, 'id' | 'created_at' | 'status'>) {
    try {
      await this.ensureUser(purchase.wallet_address);

      const { data, error } = await supabase
        .from('purchases')
        .insert({
          wallet_address: purchase.wallet_address.toLowerCase(),
          token_amount: purchase.token_amount,
          usdt_paid: purchase.usdt_paid,
          round_start: purchase.round_start,
          round_end: purchase.round_end,
          tx_hash: purchase.tx_hash,
          block_number: purchase.block_number,
          status: 'completed',
        })
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(purchase.wallet_address, 'purchase', `Purchased ${purchase.token_amount} CBTC`, {
        amount: purchase.token_amount,
        usdtPaid: purchase.usdt_paid,
        txHash: purchase.tx_hash,
      });

      return data;
    } catch (error) {
      console.error('Error saving purchase:', error);
      return null;
    }
  },

  async saveClaim(claim: Omit<ClaimRecord, 'id' | 'created_at' | 'status'>) {
    try {
      await this.ensureUser(claim.wallet_address);

      const { data, error } = await supabase
        .from('claims')
        .insert({
          wallet_address: claim.wallet_address.toLowerCase(),
          tranche_id: claim.tranche_id,
          amount: claim.amount,
          tx_hash: claim.tx_hash,
          block_number: claim.block_number,
          status: 'completed',
        })
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(claim.wallet_address, 'claim', `Claimed ${claim.amount} CBTC from Tranche ${claim.tranche_id + 1}`, {
        amount: claim.amount,
        trancheId: claim.tranche_id,
        txHash: claim.tx_hash,
      });

      return data;
    } catch (error) {
      console.error('Error saving claim:', error);
      return null;
    }
  },

  async getPurchaseHistory(walletAddress: string): Promise<PurchaseRecord[]> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      return [];
    }
  },

  async getClaimHistory(walletAddress: string): Promise<ClaimRecord[]> {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching claim history:', error);
      return [];
    }
  },

  async getActivityLog(walletAddress: string): Promise<ActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching activity log:', error);
      return [];
    }
  },

  async logActivity(walletAddress: string, actionType: string, description: string, metadata?: any) {
    try {
      await supabase.from('activity_log').insert({
        wallet_address: walletAddress.toLowerCase(),
        action_type: actionType,
        description,
        metadata,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  },

  async getUserStats(walletAddress: string) {
    try {
      const [purchases, claims] = await Promise.all([
        this.getPurchaseHistory(walletAddress),
        this.getClaimHistory(walletAddress),
      ]);

      const totalInvested = purchases.reduce((sum, p) => sum + parseFloat(p.usdt_paid), 0);
      const totalPurchased = purchases.reduce((sum, p) => sum + parseFloat(p.token_amount), 0);
      const totalClaimed = claims.reduce((sum, c) => sum + parseFloat(c.amount), 0);
      const avgPrice = totalPurchased > 0 ? totalInvested / totalPurchased : 0;

      return {
        totalInvested,
        totalPurchased,
        totalClaimed,
        avgPrice,
        purchaseCount: purchases.length,
        claimCount: claims.length,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalInvested: 0,
        totalPurchased: 0,
        totalClaimed: 0,
        avgPrice: 0,
        purchaseCount: 0,
        claimCount: 0,
      };
    }
  },
};
