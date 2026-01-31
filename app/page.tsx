import Link from 'next/link'
import { ArrowRight, Wand2, MonitorPlay, Layers } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Hero Section */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Viral Thumbnails in Seconds
        </h1>
        <p className="text-xl text-slate-300">
          Recreate top-performing styles or train your own AI persona.
          <br />
          The all-in-one studio for YouTube creators.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <Link 
          href="/studio" 
          className="flex items-center gap-2 px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition shadow-lg shadow-purple-500/20"
        >
          <Wand2 className="w-5 h-5" />
          Open Studio
        </Link>
        <Link 
          href="/signup" 
          className="px-8 py-3 border border-slate-600 rounded-full font-semibold hover:bg-slate-800 transition"
        >
          Sign Up Free
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-5xl">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto text-purple-400">
            <MonitorPlay className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Recreate Anything</h3>
          <p className="text-slate-400">Paste a YouTube URL and get a customizable template instantly.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto text-pink-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Smart Layers</h3>
          <p className="text-slate-400">Drag, drop, and edit text, shapes, and AI-generated assets.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto text-blue-400">
            <ArrowRight className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Persona Training</h3>
          <p className="text-slate-400">Train AI on your face to generate consistent reaction shots.</p>
        </div>
      </div>
    </div>
  )
}
