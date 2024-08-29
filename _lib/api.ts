'use server'

import { ethers } from 'ethers'
import { TRANSACTION_STATUS } from './definitions'
import type { TypeFullWallet, TypeTransaction, TypeWallet } from './definitions'

export async function createProvider(): Promise<ethers.JsonRpcProvider> {
  return new ethers.JsonRpcProvider(process.env.NODE_URL)
}

export async function connect(): Promise<boolean> {
  const provider: ethers.JsonRpcProvider = await createProvider()
  const number: number = await provider.getBlockNumber()
  return provider && number ? true : false
}

export async function getDefaultWallets(): Promise<[TypeFullWallet, TypeFullWallet] | [null]> {
  const mnemonic = process.env.MNEMONIC
  if (!mnemonic) return [null]

  const provider: ethers.JsonRpcProvider = await createProvider()
  const wallet1: ethers.HDNodeWallet = await getWallet(mnemonic, provider)
  const wallet2: ethers.HDNodeWallet = wallet1.derivePath('1')
  return [
    {address: wallet1.address, type: 'main'},
    {address: wallet2.address, type: 'secondary'},
  ]
}

export async function createWallet(): Promise<TypeFullWallet> {
  const wallet: ethers.HDNodeWallet = ethers.HDNodeWallet.createRandom()

  return {
    address: wallet.address,
    mnemonic: {
      phrase: wallet.mnemonic?.phrase,
    },
    publicKey: wallet.publicKey,
    signingKey: {
      privateKey: wallet.signingKey.privateKey,
    },
    type: 'user',
  }
}

export async function getWallet(
  mnemonic: string,
  provider?: ethers.JsonRpcProvider
): Promise<ethers.HDNodeWallet> {
  const wallet: ethers.HDNodeWallet = ethers.Wallet.fromPhrase(mnemonic, provider)
  return wallet
}

async function getWalletByType(
  wallet: TypeFullWallet,
  provider: ethers.JsonRpcProvider
): Promise<ethers.HDNodeWallet | null> {
  const mnemonic = wallet.type === 'user' ? wallet.mnemonic?.phrase : process.env.MNEMONIC
  if (!mnemonic) return null

  let w: ethers.HDNodeWallet = await getWallet(mnemonic, provider)
  if (wallet.type === 'secondary')
    w = w.derivePath('1')
  return w
}

export async function getBalance(address: string): Promise<bigint> {
  const provider: ethers.JsonRpcProvider = await createProvider()
  const balance: bigint = await provider.getBalance(address)
  return balance
}

export async function sendTransaction(
  from: TypeWallet,
  to: TypeWallet,
  value: number
): Promise<TypeTransaction | string | unknown> {
  const provider: ethers.JsonRpcProvider = await createProvider()
  const wallet = await getWalletByType(from.wallet, provider)

  if (!wallet) return "WALLET_NOT_FOUND"

  try {
    const tx = await wallet.sendTransaction({
      to: to.wallet.address,
      value: ethers.parseUnits(`${value}`, 'ether'),
    })

    return {hash: tx.hash}
  } catch (error) {
    if (ethers.isError(error, "INSUFFICIENT_FUNDS")) {
      return error.code
    }
    return error
  } finally {
  }
}

export async function waitTransaction(hash: string): Promise<TRANSACTION_STATUS | null> {
  const provider: ethers.JsonRpcProvider = await createProvider()
  const tx = await provider.getTransaction(hash)
  if (!tx) return TRANSACTION_STATUS.Error
  const receipt = await tx.wait()
  if (!receipt) return TRANSACTION_STATUS.Error
  return receipt.status
}
