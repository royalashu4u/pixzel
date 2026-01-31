'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Wand2, LogIn, LayoutGrid } from 'lucide-react'

export default function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white to-slate-400 text-transparent bg-clip-text">
            Pixzel
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/studio" className="text-slate-400 hover:text-white transition text-sm font-medium">
            Studio
          </Link>
          <Link href="/pricing" className="text-slate-400 hover:text-white transition text-sm font-medium">
            Pricing
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-sm text-slate-400 hover:text-white transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-slate-100 transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
