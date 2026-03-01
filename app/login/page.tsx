'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/studio')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    )
  }

  // Brief flash protection to hold redirect over rendering component
  if (user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
