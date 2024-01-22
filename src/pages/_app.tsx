import Root from '@/components/root'
import { ThemeProvider } from '@/components/theme-provider'
import '@/styles/globals.css'
import { trpc } from '@/utils/trpc'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class' defaultTheme='dark'>
      <ClerkProvider appearance={dark} {...pageProps}>
        <Root {...pageProps}>
          <Component {...pageProps} />
        </Root>
      </ClerkProvider>
    </ThemeProvider>
  )
}

export default trpc.withTRPC(App)
