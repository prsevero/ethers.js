import Button from '@/components/button'

export default function StartScreen({
  handleInit,
  loading,
}: {
  handleInit: React.MouseEventHandler
  loading: boolean
}) {
  return (
    <div className="items-center flex h-[calc(100vh-theme('spacing.16'))] justify-center mt-16">
      <Button loading={loading} onClick={handleInit}>
        Connect to testnet
      </Button>
    </div>
  )  
}
