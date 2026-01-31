'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Upload, Camera, AlertCircle } from 'lucide-react'

interface PersonaModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PersonaModal({ isOpen, onClose }: PersonaModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

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
    <Modal isOpen={isOpen} onClose={onClose} title="Train New Persona">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Upload Training Photos
          </label>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 hover:bg-white/5 hover:border-purple-500/50 transition cursor-pointer text-center relative group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <Upload className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-500 mt-1">Upload 5-10 clear photos of your face</p>
              </div>
            </div>
          </div>
          {files.length > 0 && (
            <p className="text-sm text-green-400 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              {files.length} photos selected
            </p>
          )}
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm">
          <h4 className="flex items-center gap-2 font-semibold text-blue-300 mb-2">
            <AlertCircle className="w-4 h-4" />
            Best Practices
          </h4>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Use good lighting and clear backgrounds</li>
            <li>Include different facial expressions</li>
            <li>Avoid sunglasses or face coverings</li>
            <li>Look directly at the camera for some shots</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={files.length === 0}>
            Start Training (50 Credits)
          </Button>
        </div>
      </form>
    </Modal>
  )
}
