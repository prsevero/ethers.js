import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { ethers } from 'ethers'

import Header from '@/components/ui/header'

const inter = Inter({ subsets: ['latin'] })

const node = 'https://frequent-delicate-friday.ethereum-sepolia.quiknode.pro/5c2b315f3c47519007ca3f988c220ea7c76ad9ca/'

export default function Home() {
  const [blockNumber, setBlockNumber] = useState(null)

  async function handleConnection() {
    const provider = new ethers.JsonRpcProvider(node)
    const number = await provider.getBlockNumber()
    setBlockNumber(number);
  }

  return (
    <>
      <Header />
      <main className="flex justify-center mt-16 p-5">
        <button
          className={`${blockNumber ? 'bg-green-600 pointer-events-none' : 'bg-sky-900'} font-semibold px-6 py-3 rounded-lg text-white`}
          onClick={handleConnection}
        >
          {blockNumber ? 'Connected' : 'Connect'} to blockchain
        </button>
      </main>
    </>
  )
}
