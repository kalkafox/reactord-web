import { type ReactNode } from 'react'

function Root({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>
}

export default Root
