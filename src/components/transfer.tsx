import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'

import type { TypeTransactionsHistory, TypeWallet } from '@/_app/definitions'
import Button from '@/components/button'
import TransferHistory from '@/components/transfer-history'
import TransferWallets from '@/components/transfer-wallets'

const min = 0.000001
const max = 0.00001

export default function Transfer({
  onTransaction,
  wallets,
}: {
  onTransaction: Function
  wallets: TypeWallet[]
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [from, setFrom] = useState<TypeWallet>()
  const [to, setTo] = useState<TypeWallet>()
  const [value, setValue] = useState<number>(min)
  const [history, setHistory] = useState<TypeTransactionsHistory[]>([])
  const transactions = useRef<ethers.TransactionResponse[]>([])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setValue(v)
  }

  useEffect(() => {
    (async() => {
      const tx = transactions.current.pop()
      if (!tx) return

      const receipt = await tx.wait()
      if (!receipt) return

      setHistory(prev => {
        let hist = [...prev]
        for (let i=0, max=hist.length; i<max; i++) {
          if (hist[i].hash === tx.hash) {
            hist[i].status = receipt.status
            break
          }
        }
        onTransaction()
        return hist
      })
    })()
  }, [transactions.current])

  async function handleTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!from || !to) return;

    setLoading(true)
    try {
      const tx = await from.wallet.sendTransaction({
        to: to.wallet.address,
        value: ethers.parseUnits(`${value}`, 'ether'),
      })
      let h = [...history]
      h.unshift({
        hash: tx.hash,
        status: -1,
        value: value,
      })
      transactions.current = [...transactions.current, tx]
      setHistory(h)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="font-bold">Transfer</p>
      <div className="flex flex-wrap gap-4 md:flex-nowrap">
        <TransferWallets
          disabled={loading}
          label="From:"
          onSelect={(wallet: TypeWallet) => setFrom(wallet)}
          selected={from}
          wallets={wallets}
        />
        <TransferWallets
          disabled={loading}
          label="To:"
          onSelect={(wallet: TypeWallet) => setTo(wallet)}
          selected={to}
          wallets={wallets}
        />
      </div>
      <form onSubmit={handleTransfer}>
        <fieldset disabled={loading}>
          <input
            className={`
              border
              border-gray-500
              block
              h-9
              mb-1
              mt-3
              mx-auto
              outline-0
              px-2
              rounded-sm
              w-44
              transition-colors
              duration-200
              focus:border-sky-600
            `}
            max={max}
            min={min}
            onChange={handleValueChange}
            step={min}
            type="number"
            value={value}
          />
          <p className={`color-gray-600 text-center text-xs`}>Min. {min} - Max. {max}</p>

          <Button
            className="my-5 mx-auto"
            disabled={
              loading ||
              !from ||
              !to ||
              from.wallet.address === to.wallet.address ||
              value < min ||
              value > max
            }
            loading={loading}
            size="sm"
          >
            Transfer!
          </Button>
        </fieldset>
      </form>

      <TransferHistory history={history} />
    </div>
  )
}
