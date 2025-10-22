export interface Round {
  price: bigint;
  cap: bigint;
  sold: bigint;
}

export interface Tranche {
  percentBps: number;
  start: bigint;
  end: bigint;
  enabled: boolean;
}

export interface UserPurchaseInfo {
  purchased: bigint;
  purchases: Purchase[];
}

export interface Purchase {
  id: string;
  tokenAmount: string;
  usdtPaid: string;
  roundStart: number;
  roundEnd: number;
  txHash: string;
  createdAt: string;
}

export interface Claim {
  id: string;
  trancheId: number;
  amount: string;
  txHash: string;
  createdAt: string;
}

export interface ContractData {
  rounds: Round[];
  currentRound: number;
  saleOpen: boolean;
  tranches: Tranche[];
  userPurchased: bigint;
  userClaims: Map<number, boolean>;
}
