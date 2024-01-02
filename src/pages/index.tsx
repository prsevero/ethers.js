import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import Header from '@/components/ui/header'
import Wallet from '@/components/ui/wallet'
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
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [walletCustom, setWalletCustom] = useState<ethers.HDNodeWallet>(null)
  const [walletFirst, setWalletFirst] = useState<ethers.HDNodeWallet>(null)
  const [walletSecond, setWalletSecond] = useState<ethers.HDNodeWallet>(null)
  const [walletCustomBalance, setWalletCustomBalance] = useState<string>('0')
  const [walletFirstBalance, setWalletFirstBalance] = useState<string>('0')
  const [walletSecondBalance, setWalletSecondBalance] = useState<string>('0')

  useEffect(() => {
    if (!provider) return

    (async () => {
      const mnemonic1 = process.env.MNEMONIC_1 || process.env.NEXT_PUBLIC_MNEMONIC_1
      if (mnemonic1) {
        const wallet1: ethers.HDNodeWallet = await getWallet(mnemonic1, provider)
        setWalletFirst(wallet1)
        setWalletSecond(wallet1)
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
    const [provider, number]: [ethers.JsonRpcProvider, number] = await connect()
    setProvider(provider)
    setBlockNumber(number)
  }

  async function handleWalletCustom() {
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
        <main className="mt-16 p-4">
          <div className="flex flex-wrap gap-4">
            {walletFirst &&
              <Wallet balance={walletFirstBalance} name="Main wallet" wallet={walletFirst} />}
            {walletSecond &&
              <Wallet balance={walletSecondBalance} name="Secondary wallet" wallet={walletSecond} />}
            {walletCustom &&
              <Wallet balance={walletCustomBalance} name="Secondary wallet" wallet={walletCustom} />}
          </div>

          {!walletCustom &&
            <button
              className="bg-sky-900 block font-semibold mt-20 mx-auto px-6 py-3 rounded-lg text-white"
              onClick={handleWalletCustom}
            >
              Create custom wallet
            </button>}
        </main>
      }
    </>
  )
}
