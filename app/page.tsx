'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

import type { TypeWallet, TypeFullWallet } from '@/_app/definitions'
import Button from '@/components/button'
import ClipboardCopy from '@/components/clipboard-copy'
import StartScreen from '@/components/start-screen'
import Transfer from '@/components/transfer'
import Wallet from '@/components/wallet'
import { connect, createWallet, getBalance, getDefaultWallets } from '@/_app/api'


export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<boolean>(false)
  // Wallets
  const [walletMain, setWalletMain] = useState<TypeWallet>()
  const [walletSecondary, setWalletSecondary] = useState<TypeWallet>()
  const [walletUser, setWalletUser] = useState<TypeWallet>()

  // Wallets related
  const getMainWalletBalance = useCallback(async () => {
    if (!walletMain) return
    const balance = await getBalance(walletMain.wallet.address)
    setWalletMain({...walletMain, balance: balance})
  }, [walletMain])

  const getSecondaryWalletBalance = useCallback(async () => {
    if (!walletSecondary) return
    const balance = await getBalance(walletSecondary.wallet.address)
    setWalletSecondary({...walletSecondary, balance: balance})
  }, [walletSecondary])

  const getUserWalletBalance = useCallback(async () => {
    if (!walletUser) return
    const balance = await getBalance(walletUser.wallet.address)
    setWalletUser({...walletUser, balance: balance})
  }, [walletUser])

  useEffect(() => {
    if (!provider) return

    (async () => {
      const [wallet1, wallet2] = await getDefaultWallets()
      if (!wallet1) return
      setWalletMain({name: 'Main wallet', wallet: wallet1})
      setWalletSecondary({name: 'Secondary wallet', wallet: wallet2})
    })()
  }, [provider])

  useEffect(() => {
    if (!walletMain || walletMain.balance !== undefined) return
    getMainWalletBalance()
  }, [getMainWalletBalance, walletMain])

  useEffect(() => {
    if (!walletSecondary || walletSecondary.balance !== undefined) return
    getSecondaryWalletBalance()
  }, [getSecondaryWalletBalance, walletSecondary])

  async function handleWalletUser() {
    setLoading(true)
    try {
      const wallet: TypeFullWallet = await createWallet()
      setWalletUser({balance: BigInt(0), name: 'User wallet', wallet: wallet})

      toast.success(({ closeToast }) => (
        <>
          <div className="items-center flex gap-5 mb-3">
            <p className="font-bold">Your wallet info, store it safe:</p>
            <ClipboardCopy
              text={
                `Mnemonic: ${wallet.mnemonic?.phrase}\n` +
                `Private key: ${wallet.signingKey?.privateKey}\n` +
                `Public key: ${wallet.publicKey}`
              }
            />
          </div>
          <p className="text-sm mb-1"><b>Mnemonic:</b> {wallet.mnemonic?.phrase}</p>
          <p className="text-sm mb-1"><b>Private Key:</b> {wallet.signingKey?.privateKey}</p>
          <p className="text-sm"><b>Public Key:</b> {wallet.publicKey}</p>
        </>
      ), {autoClose: false})
    } catch (error) {
      console.error(error)
      toast.error('Could not create a new wallet.')
    } finally {
      setLoading(false)
    }
  }

  const updateBalances = useCallback(() => {
    getMainWalletBalance()
    getSecondaryWalletBalance()
    getUserWalletBalance()
  }, [getMainWalletBalance, getSecondaryWalletBalance, getUserWalletBalance])

  async function handleInit() {
    setLoading(true)

    try {
      const provider = await connect()
      setProvider(provider)
    } catch(e) {
      console.error(e)
      toast.error('Could not connect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!provider ?
        <StartScreen handleInit={handleInit} loading={loading} /> :
        <main className="mt-14 p-4">
          <div className="flex flex-wrap gap-4 md:flex-nowrap">
            {walletMain &&
              <div className={`basis-full md:basis-1/${walletUser ? '3' : '2'}`}>
                <Wallet wallet={walletMain} />
              </div>}
            {walletSecondary && 
              <div className={`basis-full md:basis-1/${walletUser ? '3' : '2'}`}>
                <Wallet wallet={walletSecondary} />
              </div>}
            {walletUser &&
              <div className="basis-full md:basis-1/3">
                <Wallet wallet={walletUser} />
              </div>}
          </div>

          {!walletUser &&
            <Button className="mt-3 mx-auto" loading={loading} onClick={handleWalletUser} size="sm">
              Create custom wallet
            </Button>}

          {walletMain && walletSecondary &&
            <div className="mt-8">
              <Transfer
                onTransaction={updateBalances}
                wallets={
                  walletUser ?
                    [walletMain, walletSecondary, walletUser] :
                    [walletMain, walletSecondary]
                }
              />
            </div>}
        </main>
      }
    </>
  )
}
