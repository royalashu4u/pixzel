'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { MonitorPlay, Sparkles } from 'lucide-react'

interface RecreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RecreateModal({ isOpen, onClose }: RecreateModalProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement API call
    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recreate from YouTube">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Paste YouTube Video URL
          </label>
          <div className="relative">
            <MonitorPlay className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              required
            />
          </div>
          <p className="text-xs text-slate-500">
            We&apos;ll analyze the thumbnail structure, colors, and text styles.
          </p>
        </div>

        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-purple-300 mb-2">
            <Sparkles className="w-4 h-4" />
            AI Analysis Includes:
          </h4>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Face emotion and pose detection</li>
            <li>Background scene synthesis</li>
            <li>Text hierarchy and font matching</li>
            <li>Color palette extraction</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Generate Template
          </Button>
        </div>
      </form>
    </Modal>
  )
}
