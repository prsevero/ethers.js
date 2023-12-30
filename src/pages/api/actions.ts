import { ethers } from 'ethers'

export async function createProvider(): Promise<ethers.JsonRpcProvider> {
  return new ethers.JsonRpcProvider(process.env.NODE_URL ||
    process.env.NEXT_PUBLIC_NODE_URL)
}

export async function connect(): Promise<[ethers.JsonRpcProvider, number]> {
  const provider: ethers.JsonRpcProvider = await createProvider()
  const number: number = await provider.getBlockNumber()
  return [provider, number]
}

export async function getWallet(mnemonic: string, provider?: ethers.JsonRpcProvider): Promise<ethers.HDNodeWallet> {
  const wallet: ethers.HDNodeWallet = ethers.Wallet.fromPhrase(mnemonic, provider)
  return wallet
}

export async function getBalance(provider: ethers.JsonRpcProvider, address: string): Promise<string> {
  const balance: string = await provider.getBalance(address)
  return ethers.formatEther(balance)
}
