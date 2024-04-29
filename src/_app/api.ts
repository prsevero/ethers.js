import { ethers } from 'ethers'

export async function createProvider(): Promise<ethers.JsonRpcProvider> {
  return new ethers.JsonRpcProvider(process.env.NODE_URL)
}

export async function connect(): Promise<[ethers.JsonRpcProvider, number]> {
  const provider: ethers.JsonRpcProvider = await createProvider()
  const number: number = await provider.getBlockNumber()
  return [provider, number]
}

export async function getDefaultWallets(
  provider: ethers.JsonRpcProvider
): Promise<[ethers.HDNodeWallet, ethers.HDNodeWallet] | [null]> {
  const mnemonic = process.env.MNEMONIC
  if (!mnemonic) return [null]

  const wallet1: ethers.HDNodeWallet = await getWallet(mnemonic, provider)
  const wallet2: ethers.HDNodeWallet = wallet1.derivePath(`m/44'/60'/0'/0/1`)
  return [wallet1, wallet2]
}

export async function createWallet(): Promise<ethers.HDNodeWallet> {
  const wallet: ethers.HDNodeWallet = ethers.HDNodeWallet.createRandom()
  console.log(wallet)
  return wallet
}

export async function getWallet(mnemonic: string, provider?: ethers.JsonRpcProvider): Promise<ethers.HDNodeWallet> {
  const wallet: ethers.HDNodeWallet = ethers.Wallet.fromPhrase(mnemonic, provider)
  return wallet
}

export async function getBalance(provider: ethers.JsonRpcProvider, address: string): Promise<bigint> {
  const balance: bigint = await provider.getBalance(address)
  return balance
}
