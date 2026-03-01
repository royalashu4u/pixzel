'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut, Coins, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
  const { user, credits, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-2 py-1.5 rounded-full hover:bg-slate-800 transition border border-transparent hover:border-white/10"
      >
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-white/5">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold text-white">{credits !== null ? credits : '...'}</span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden shadow-inner">
          {user.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
            <div className="px-4 py-3 border-b border-white/10 bg-slate-900/50">
              <p className="text-sm text-slate-400 truncate">{user.email}</p>
            </div>
            
            <div className="p-2 space-y-1">
              <Link 
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              
              <button 
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
