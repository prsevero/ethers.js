import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '@/styles/globals.css'

import Header from '@/components/header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Header />

      <Component {...pageProps} />

      <ToastContainer newestOnTop={true} theme="colored" transition={Flip} />
    </div>
  )
}
