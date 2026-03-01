'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Wand2, LogIn } from 'lucide-react'
import { UserMenu } from './UserMenu'

export default function Navbar() {
  const { user, loading } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white to-slate-400 text-transparent bg-clip-text">
            Pixzel
          </span>
        </Link>

        {/* Center Nav Items */}
        <div className="hidden md:flex items-center gap-8 translate-x-12">
          {user && (
            <Link href="/studio" className="text-slate-300 hover:text-white transition font-medium">
              Studio
            </Link>
          )}
          <Link href="/pricing" className="text-slate-300 hover:text-white transition font-medium">
            Pricing
          </Link>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center">
          {loading ? (
             <div className="w-16 h-8 animate-pulse bg-slate-800 rounded-full" />
          ) : user ? (
            <UserMenu />
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-2 px-5 py-2 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-slate-100 transition shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
