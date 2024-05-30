import { ethers } from 'ethers'

export enum TRANSACTION_STATUS {
  Pending = -1,
  Error = 0,
  Success = 1,
}

export interface TypeTransaction {
  hash: string
  status: TRANSACTION_STATUS
  value: number | null
}

export interface TypeFullWallet {
  address: string
  mnemonic?: {
    phrase?: string
  }
  publicKey?: string
  signingKey?: {
    privateKey: string
  }
  type: 'main' | 'secondary' | 'user'
}

export interface TypeWallet {
  balance?: bigint
  name?: string
  wallet: TypeFullWallet
}
