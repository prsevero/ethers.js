import type { TypeWallet } from '@/_app/definitions'
import Button from '@/components/button'

export default function TransferWallets({
  disabled,
  label,
  onSelect,
  selected,
  wallets,
}: {
  disabled: boolean
  label: string
  onSelect: Function
  selected?: TypeWallet
  wallets: TypeWallet[]
}) {
  return (
    <div className="flex flex-1 flex-wrap">
      <p className="basis-full text-sm"><b>{label}</b></p>

      {wallets.map(wallet => (
        <Button
          className={
            `mt-1 mb-2 mr-2
            ${selected && selected.wallet.address === wallet.wallet.address ? ' bg-teal-700 pointer-events-none hover:bg-teal-700': ''}`
          }
          disabled={disabled}
          key={wallet.name}
          onClick={() => onSelect(wallet)}
          size="sm"
        >
          {wallet.name}
        </Button>
      ))}
    </div>
  )
}
