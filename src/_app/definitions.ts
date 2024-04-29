import { ethers } from 'ethers'

export interface TypeTransactionsHistory {
  hash: string
  status: number | null
  value: number
}

export interface TypeWallet {
  balance?: bigint
  name?: string
  wallet: ethers.HDNodeWallet
}
