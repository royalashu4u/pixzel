'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname === '/studio'

  return (
    <>
      {!isStudio && <Navbar />}
      <main className={`min-h-screen ${!isStudio ? 'pt-16' : ''}`}>
        {children}
      </main>
    </>
  )
}
