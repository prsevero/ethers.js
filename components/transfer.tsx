import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

import type { TypeTransaction, TypeWallet } from '@/_app/definitions'
import { sendTransaction, waitTransaction } from '@/_app/api'
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
  const [history, setHistory] = useState<TypeTransaction[]>([])
  const [transactions, setTransactions] = useState<TypeTransaction[]>([])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setValue(v)
  }

  useEffect(() => {
    (async() => {
      const tx = transactions.pop()
      if (!tx) return

      const receipt = await waitTransaction(tx.hash)
      if (receipt === null) return

      setHistory(prev => {
        let hist = [...prev]
        for (let i=0, max=hist.length; i<max; i++) {
          if (hist[i].hash === tx.hash) {
            hist[i].status = receipt
            break
          }
        }
        return hist
      })
      onTransaction()
    })()
  }, [onTransaction, transactions])

  async function handleTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!from || !to) return;

    setLoading(true)
    try {
      const transaction = await sendTransaction(from, to, value)
      if (!transaction) return

      if (typeof transaction === 'object' && 'hash' in transaction) {
        const tx = transaction as TypeTransaction
        let h = [...history]
        h.unshift({
          hash: tx.hash,
          status: -1,
          value: value,
        })
        setTransactions([...transactions, tx])
        setHistory(h)
      } else {
        const error = transaction as ethers.ErrorCode
        if (error === 'INSUFFICIENT_FUNDS') {
          toast.error('The selected wallet does not have sufficient funds.')
        } else {
          toast.error('An error occurred, please try again.')
        }
      }
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
          <label
            className={`
              block
              cursor-pointer
              font-bold
              mb-1
              mt-3
              mx-auto
              text-sm
              w-44
            `}
            htmlFor="value"
          >Value</label>
          <input
            className={`
              border
              border-gray-500
              block
              h-9
              mb-1
              mx-auto
              outline-0
              px-2
              rounded-sm
              w-44
              transition-colors
              duration-200
              focus:border-sky-600
            `}
            id="value"
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
