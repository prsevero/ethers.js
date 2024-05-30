import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Header from '@/components/header'

export const metadata: Metadata = {
  title: 'ethers.js by @prsevero',
  description: 'This project utilizes ethers.js to interact with the Ethereum blockchain.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <ToastContainer newestOnTop={true} theme="colored" transition={Flip} />
        <GoogleAnalytics gaId="G-D4RLBTHNTW" />
      </body>
    </html>
  )
}
