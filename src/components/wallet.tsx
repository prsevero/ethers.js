import { ethers } from 'ethers'

import type { TypeTransactionsHistory, TypeWallet } from '@/_app/definitions'
import Link from '@/components/link'
import ClipboardCopy from '@/components/clipboard-copy'

export default function Wallet({
  wallet,
}: {
  wallet: TypeWallet
}) {
  return (
    <div className="flex-1">
      <h2 className="font-bold mb-1">
        {wallet.name ? wallet.name : 'Wallet'}
      </h2>
      <p className="text-sm mb-1">
        <b>Address: </b>
        <Link href={`https://sepolia.etherscan.io/address/${wallet.wallet.address}`} target="_blank">
          {wallet.wallet.address}
        </Link>
      </p>
      <p className="text-sm"><b>Balance:</b> {wallet.balance ? ethers.formatEther(wallet.balance) : 0} ETH</p>
    </div>
  )
}
