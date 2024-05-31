export interface TransactionType {
  id?: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  createdAt: string;
  tokenAddress: string;
  transactionHash: string;
  walletAddress: string;
  blockNumber: number;
  service: any;
}
