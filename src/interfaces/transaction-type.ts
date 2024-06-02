export interface TransactionType {
  id?: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  tokenAddress: string;
  transactionHash: string;
  walletAddress: string;
  blockNumber: number;
  service: any;
  confirmed: boolean;
  active: boolean;
  meta: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
