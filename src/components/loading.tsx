import Image from 'next/image'

import loading from '@/assets/loading.svg'

export default function Loading() {
  return (
    <Image src={loading} height={20} width={20} alt="Loading" />
  )
}
