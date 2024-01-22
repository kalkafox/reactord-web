import Image from 'next/image'
import { Inter } from 'next/font/google'
import { SignInButton, UserButton } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <SignInButton />
      <UserButton afterSignOutUrl='/' />
    </main>
  )
}
