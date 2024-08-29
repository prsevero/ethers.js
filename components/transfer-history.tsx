import { Fragment } from 'react'
import { ethers } from 'ethers'

import type { TypeTransaction } from '@/_lib/definitions'
import Loading from '@/components/loading'

export default function TransferHistory({
  history,
}: {
  history: TypeTransaction[]
}) {
  if (!history.length) return

  return (
    <>
      <p className="font-bold">History</p>
      <div className={`grid grid-cols-3 space-between`}>
        {history.map((data, i) => (
          <Fragment key={i}>
            <a
              className={`
                underline text-teal-900 transition-color duration-200 hover:text-teal-700
              `}
              href={`https://sepolia.etherscan.io/tx/${data.hash}`}
              target="_blank"
              title={data.hash}
            >
              {data.hash.substr(0, 10)}
            </a>
            <span className="text-center">{data.value} ETH</span>
            <span
              className={`
                items-center
                flex
                gap-2
                justify-end
                ${data.status !== -1 && 'font-bold'}
                ${data.status === -1 ? '' : data.status === 1 ? 'text-green-600' : 'text-red-600'}
              `}
            >
              {data.status === 1 ? 'Success' : data.status === -1 ? <>Pending <Loading /></> : 'Error'}
            </span>
          </Fragment>
        ))}
      </div>
    </>
  )
}
