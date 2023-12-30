import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import Header from '@/components/ui/header'
import { connect, getBalance, getWallet } from './api/actions'

const inter = Inter({ subsets: ['latin'] })

declare var process : {
  env: {
    MNEMONIC_1: string,
    NEXT_PUBLIC_MNEMONIC_1: string,
    MNEMONIC_2: string,
    NEXT_PUBLIC_MNEMONIC_2: string,
  }
}


export default function Home() {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider>(null)
  const [blockNumber, setBlockNumber] = useState<Number | null>(null)
  const [customWallet, setCustomWallet] = useState<ethers.HDNodeWallet>(null)
  const [walletFirst, setWalletFirst] = useState<ethers.HDNodeWallet>(null)
  const [walletSecond, setWalletSecond] = useState<ethers.HDNodeWallet>(null)
  const [walletFirstBalance, setWalletFirstBalance] = useState<string | null>(null)
  const [walletSecondBalance, setWalletSecondBalance] = useState<string | null>(null)

  useEffect(() => {
    if (!provider) return

    (async () => {
      const mnemonic1 = process.env.MNEMONIC_1 || process.env.NEXT_PUBLIC_MNEMONIC_1
      if (mnemonic1) {
        const wallet1: ethers.HDNodeWallet = await getWallet(mnemonic1, provider)
        setWalletFirst(wallet1)
      }

      const mnemonic2 = process.env.MNEMONIC_2 || process.env.NEXT_PUBLIC_MNEMONIC_2
      if (mnemonic2) {
        const wallet2: ethers.HDNodeWallet = await getWallet(mnemonic2, provider)
        setWalletSecond(wallet2)
      }
    })()
  }, [provider])

  useEffect(() => {
    if (!provider || !walletFirst) return;

    (async () => {
      const balance: string = await getBalance(provider, walletFirst.address)
      setWalletFirstBalance(balance)
    })()
  }, [walletFirst])

  useEffect(() => {
    if (!provider || !walletSecond) return;

    (async () => {
      const balance: string = await getBalance(provider, walletSecond.address)
      setWalletSecondBalance(balance)
    })()
  }, [walletSecond])

  async function handleInit() {
    const [provider, number]: [ethers.JsonRpcProvider, Number] = await connect()
    setProvider(provider)
    setBlockNumber(number)
  }

  async function handleCustomWallet() {
  }

  return (
    <>
      <Header />
      {!blockNumber ?
        <div className="items-center flex h-[calc(100vh-theme('spacing.16'))] justify-center mt-16">
          <button
            className="bg-sky-900 font-semibold px-6 py-3 rounded-lg text-white"
            onClick={handleInit}
          >
            Connect to blockchain
          </button>
        </div> :
        <main className="flex justify-center mt-16 p-5">
          {!customWallet &&
            <button
              className="bg-sky-900 font-semibold px-6 py-3 rounded-lg text-white"
              onClick={handleCustomWallet}
            >
              Create wallet
            </button>}
          {walletFirst &&
            <div>
              <h2>First Wallet</h2>
              <p>Address: {walletFirst.address}</p>
              <p>Balance: {walletFirstBalance || 0} ETH</p>
            </div>}
        </main>
      }
    </>
  )
}
