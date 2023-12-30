import { ethers } from 'ethers'

export default function Wallet({
  balance,
  name,
  wallet
}: {
  balance: number,
  name?: string,
  wallet: ethers.HDNodeWallet
}) {
  return (
    <div className="flex-1">
      <h2 className="font-bold mb-1">{name ? name : 'Wallet'}</h2>
      <p className="text-sm mb-1"><b>Address:</b> {wallet.address}</p>
      <p className="text-sm"><b>Balance:</b> {balance || 0} ETH</p>
    </div>
  )
}
