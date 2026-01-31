'use client'

import React, { useState } from 'react'
import { 
  RotateCcw, 
  Edit3, 
  Type, 
  BarChart2, 
  Mic, 
  Sparkles, 
  Image as ImageIcon,
  User,
  MessageSquare,
  HelpCircle
} from 'lucide-react'

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState('Prompt')
  const [prompt, setPrompt] = useState('Generate a sinister, greedy version of Mario with a cigar, surrounded by poker chips & stacks of cash & place the Nintendo logo behind him')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedImage(null) // Clear previous image
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      // Handle different possible response formats based on the API route implementation
      if (data.image) {
        setGeneratedImage(data.image)
      } else if (data.url) {
        setGeneratedImage(data.url) 
      } else {
        console.log('Unknown response format:', data)
      }

    } catch (error) {
      console.error('Generation failed:', error)
      alert('Failed to generate image. Check console for details.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white relative flex flex-col items-center overflow-hidden">
      
      {/* Background Dots Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Sub-Header: Plan & Credits (Below Global Nav) */}
      <div className="w-full flex justify-between items-center px-8 py-4 z-10">



        {/* Right: Credits */}
        <div className="flex items-center gap-2 font-medium">
          <div className="w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center text-xs text-zinc-400">P</div>
          <span className="text-white font-bold text-lg">200</span>
          <span className="text-zinc-400">Credits</span>
        </div>
      </div>

      {/* Spacer to center content vertically in remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 px-4 pb-20">
        
        {/* Generated Result Display */}
        {generatedImage && (
          <div className="mb-8 p-1 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-2xl">
             <div className="bg-[#09090b] rounded-xl overflow-hidden relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={generatedImage} alt="Generated result" className="max-w-[512px] max-h-[512px] object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-zinc-200">Download</button>
                   <button className="bg-zinc-800 text-white px-4 py-2 rounded-full font-bold text-sm border border-zinc-700 hover:bg-zinc-700" onClick={() => setGeneratedImage(null)}>Dismiss</button>
                </div>
             </div>
          </div>
        )}

        {/* Input Container */}
        <div className="w-full max-w-5xl bg-[#09090b] border border-zinc-800/60 rounded-[32px] p-2 shadow-2xl shadow-black/80 relative">
          
          {/* Header Area: Get Started + Tabs */}
          <div className="flex items-center justify-between px-8 pt-6 pb-2">
            <h2 className="text-teal-400 font-medium text-xl tracking-wide">Get Started</h2>
            
            <div className="flex items-center gap-1">
              <TabButton 
                active={activeTab === 'Prompt'} 
                onClick={() => setActiveTab('Prompt')} 
                icon={<ImageIcon size={14} />} 
                label="Prompt" 
                activeColor="bg-[#0f2e2a] text-teal-400 border border-teal-500/20"
              />
              <TabButton 
                active={activeTab === 'Recreate'} 
                onClick={() => setActiveTab('Recreate')} 
                icon={<RotateCcw size={14} />} 
                label="Recreate" 
              />
              <TabButton 
                active={activeTab === 'Edit'} 
                onClick={() => setActiveTab('Edit')} 
                icon={<Edit3 size={14} />} 
                label="Edit" 
              />
              <TabButton 
                active={activeTab === 'Title'} 
                onClick={() => setActiveTab('Title')} 
                icon={<Type size={14} />} 
                label="Title" 
              />
              <TabButton 
                active={activeTab === 'Analyze'} 
                onClick={() => setActiveTab('Analyze')} 
                icon={<BarChart2 size={14} />} 
                label="Analyze" 
                badge="NEW"
              />
            </div>
          </div>

          {/* Dynamic Content Area based on Active Tab */}
          <div className="px-8 py-6 min-h-[200px]">
            
            {activeTab === 'Prompt' && (
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 bg-transparent text-gray-200 text-lg resize-none focus:outline-none placeholder-zinc-600 font-light leading-relaxed selection:bg-teal-500/30"
                placeholder="Describe what you want to create..."
              />
            )}

            {activeTab === 'Recreate' && (
              <div className="space-y-6">
                 <div>
                    <label className="text-zinc-400 text-sm mb-2 block">YouTube URL or Image Link</label>
                    <input 
                      type="text" 
                      placeholder="Paste a MrBeast or competitor URL..."
                      className="w-full bg-[#1c1c1e] border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
                    />
                 </div>
                 
                 <div className="bg-[#1c1c1e] p-4 rounded-xl border border-zinc-800">
                    <div className="flex justify-between text-sm mb-3 font-medium">
                      <span className="text-teal-400">Strict Layout</span>
                      <span className="text-purple-400">Creative Remix</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="50"
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-teal-500" 
                    />
                    <p className="text-xs text-zinc-500 mt-2 text-center">
                      Controls how closely the AI mimics the original composition vs adding its own flair.
                    </p>
                 </div>
              </div>
            )}

            {activeTab === 'Analyze' && (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer bg-[#1c1c1e]/50">
                 <BarChart2 className="w-10 h-10 text-zinc-600 mb-3" />
                 <p className="text-zinc-400 font-medium">Drop your thumbnail here to analyze</p>
                 <p className="text-zinc-600 text-sm mt-1">We'll give you a virality score + instant AI fixes.</p>
              </div>
            )}
            
            {activeTab === 'Edit' && (
               <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer bg-[#1c1c1e]/50">
                 <ImageIcon className="w-10 h-10 text-zinc-600 mb-3" />
                 <p className="text-zinc-400 font-medium">Upload image to edit</p>
               </div>
            )}

            {activeTab === 'Title' && (
              <div className="space-y-4">
                 <input 
                   type="text" 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none placeholder-zinc-700 border-b border-transparent focus:border-zinc-800 pb-2"
                   placeholder="Enter your video title..."
                 />
                 <div className="flex gap-2">
                    {['Clickbait', 'Curiosity', 'Shocking', 'Question'].map(style => (
                      <button key={style} className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-teal-500/50 transition-colors">
                        {style}
                      </button>
                    ))}
                 </div>
              </div>
            )}

          </div>

          {/* Bottom Toolbar & Generate Button */}
          <div className="px-6 pb-6 pt-2 flex items-end justify-between relative">
            
            {/* Left Tools */}
            <div className="flex gap-3">
              {(activeTab === 'Prompt' || activeTab === 'Recreate') && (
                <>
                  <ToolPill icon={<User size={16} />} label="Personas" />
                  <ToolPill icon={<ImageIcon size={16} />} label="Styles" />
                </>
              )}
            </div>

            {/* Centered Generate Button (Floating Overlay effect) */}
            <div className="absolute left-1/2 -bottom-7 transform -translate-x-1/2 z-20">
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating}
                 className={`bg-gradient-to-r from-teal-400 to-emerald-400 hover:brightness-110 text-black font-bold py-3.5 px-12 rounded-full shadow-[0_0_50px_-10px_rgba(45,212,191,0.5)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                   isGenerating ? 'opacity-80 cursor-wait' : ''
                 }`}
               >
                 {isGenerating ? (
                   <>
                     <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                     Generating...
                   </>
                 ) : (
                   <>
                     <Sparkles size={18} className="fill-black" />
                     {activeTab === 'Analyze' ? 'Analyze & Fix' : 'Generate'}
                   </>
                 )}
               </button>
            </div>

            {/* Right Tools */}
            <div className="flex gap-3 items-center">
              {activeTab === 'Prompt' && (
                <>
                  <button className="p-3 rounded-full bg-[#1c1c1e] hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                    <Mic size={18} />
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1c1e] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                    <Sparkles size={16} />
                    Enhance Prompt
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}

function TabButton({ active, onClick, icon, label, badge, activeColor = "bg-zinc-800 text-white" }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active 
          ? `${activeColor}` 
          : 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
      }`}
    >
      {icon}
      {label}
      {badge && (
        <span className="absolute top-0 right-0 flex h-2 w-2">
           <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
        </span>
      )}
    </button>
  )
}

function ToolPill({ icon, label }: any) {
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1c1e] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
      {icon}
      <span>{label}</span>
    </button>
  )
}
