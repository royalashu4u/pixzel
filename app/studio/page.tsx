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
  HelpCircle,
  Download,
  Maximize2,
  X
} from 'lucide-react'

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState('Prompt')
  const [prompt, setPrompt] = useState('Generate a sinister, greedy version of Mario with a cigar, surrounded by poker chips & stacks of cash & place the Nintendo logo behind him')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  
  const [activePersona, setActivePersona] = useState<string | null>(null)
  const [activeStyle, setActiveStyle] = useState<string | null>(null)
  const [showPersonas, setShowPersonas] = useState(false)
  const [showStyles, setShowStyles] = useState(false)

  // Recreate Tab State
  const [recreateUrl, setRecreateUrl] = useState('')
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [strength, setStrength] = useState(50)
  const [faceImage, setFaceImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedImage(null) // Clear previous image
    
    let finalPrompt = prompt
    
    // If in Recreate mode, override the text prompt with a specialized "Recreate" instruction
    // unless the user has typed something specific (optional enhancement, but for now we force the recreate prompt if they are in that tab)
    if (activeTab === 'Recreate') {
       finalPrompt = "Recreate this youtube thumbnail, preserve composition and main elements, enhance quality, 8k resolution, cinematic lighting, vibrant colors, viral clickbait style, highly detailed"
       if (faceImage) {
         finalPrompt += ", replacing the main subject's face with the provided face image"
       }
    }

    if (activePersona) {
      const p = PERSONAS.find((p: any) => p.id === activePersona)
      if (p) finalPrompt += `, ${p.prompt}`
    }
    if (activeStyle) {
      const s = STYLES.find((s: any) => s.id === activeStyle)
      if (s) finalPrompt += `, ${s.prompt}`
    }

    try {
      const body: any = { prompt: finalPrompt }
      if (activeTab === 'Recreate' && referenceImage) {
        body.image = referenceImage
        body.strength = strength
        if (faceImage) {
          body.faceImage = faceImage
        }
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  const handleDownload = async () => {
    if (!generatedImage) return
    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pixzel-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback for simple download if fetch fails
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `pixzel-${Date.now()}.png`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const closeMenus = () => {
    setShowPersonas(false)
    setShowStyles(false)
  }

  const handleRecreateUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setRecreateUrl(url)
    
    // Check if it's a YouTube URL and extract thumbnail
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    
    if (match && match[1]) {
      setReferenceImage(`https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`)
    } else {
      // If valid URL but not YouTube, use it directly (basic check)
      if (url.match(/^https?:\/\/.+/)) {
        setReferenceImage(url)
      } else {
        setReferenceImage(null)
      }
    }
  }

  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFaceImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white relative flex flex-col items-center overflow-hidden" onClick={closeMenus}>
      
      {/* Background Dots Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Full Screen Modal */}
      {isFullScreen && generatedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm" onClick={() => setIsFullScreen(false)}>
          <div className="relative max-w-[95vw] max-h-[95vh]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={generatedImage} alt="Full screen pixel art" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
            <div className="absolute top-4 right-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
               <button onClick={handleDownload} className="p-3 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all border border-white/10">
                 <Download size={24} />
               </button>
               <button onClick={() => setIsFullScreen(false)} className="p-3 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all border border-white/10">
                 <X size={24} />
               </button>
            </div>
          </div>
        </div>
      )}
      
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
          <div className="mb-8 p-1 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-2xl animate-in fade-in zoom-in duration-300">
             <div className="bg-[#09090b] rounded-xl overflow-hidden relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={generatedImage} 
                  alt="Generated result" 
                  className="max-w-[512px] max-h-[512px] object-contain cursor-zoom-in" 
                  onClick={(e) => { e.stopPropagation(); setIsFullScreen(true); }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                   <button 
                    onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                    className="p-3 bg-white text-black rounded-full hover:bg-teal-400 hover:scale-110 transition-all shadow-lg group/btn relative"
                    title="Download"
                   >
                     <Download size={20} />
                     <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover/btn:opacity-100 whitespace-nowrap transition-opacity">Save</span>
                   </button>
                   
                   <button 
                    onClick={(e) => { e.stopPropagation(); setIsFullScreen(true); }}
                    className="p-3 bg-white text-black rounded-full hover:bg-teal-400 hover:scale-110 transition-all shadow-lg group/btn relative"
                    title="Full Screen"
                   >
                     <Maximize2 size={20} />
                     <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover/btn:opacity-100 whitespace-nowrap transition-opacity">Expand</span>
                   </button>
                   
                   <button 
                    onClick={(e) => { e.stopPropagation(); setGeneratedImage(null); }}
                    className="p-3 bg-zinc-800 text-white border border-zinc-700 rounded-full hover:bg-red-500/20 hover:border-red-500 hover:text-red-500 hover:scale-110 transition-all shadow-lg group/btn relative"
                    title="Dismiss"
                   >
                     <X size={20} />
                     <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover/btn:opacity-100 whitespace-nowrap transition-opacity">Close</span>
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Input Container */}
        <div className="w-full max-w-5xl bg-[#09090b] border border-zinc-800/60 rounded-[32px] p-2 shadow-2xl shadow-black/80 relative" onClick={(e) => e.stopPropagation()}>
          
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
                      value={recreateUrl}
                      onChange={handleRecreateUrlChange}
                      placeholder="Paste a MrBeast or competitor URL..."
                      className="w-full bg-[#1c1c1e] border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
                    />
                    {referenceImage && (
                      <div className="mt-4 relative rounded-xl overflow-hidden border border-zinc-700 h-40 w-full bg-[#0c0c0c] flex items-center justify-center group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={referenceImage} alt="Reference" className="h-full object-contain" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">Reference Image</span>
                        </div>
                      </div>
                     )}
                 </div>

                 {/* Face Swap UI */}
                 <div>
                    <label className="text-zinc-400 text-sm mb-2 block flex justify-between">
                      <span>Face Swap (Optional)</span>
                      <span className="text-teal-500 text-xs">New!</span>
                    </label>
                    <div className="flex items-center gap-4">
                      {faceImage ? (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-teal-500/50 group">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={faceImage} alt="Face" className="w-full h-full object-cover" />
                           <button 
                            onClick={() => setFaceImage(null)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                           >
                              <X size={16} />
                           </button>
                        </div>
                      ) : (
                        <label className="w-full border border-zinc-700 hover:border-teal-500/50 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors bg-[#1c1c1e] group">
                           <div className="p-2 bg-zinc-800 rounded-full group-hover:bg-zinc-700 transition-colors">
                             <User size={16} className="text-zinc-400" />
                           </div>
                           <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Upload your face to swap</span>
                           <input type="file" onChange={handleFaceUpload} accept="image/*" className="hidden" />
                        </label>
                      )}
                    </div>
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
                      value={strength}
                      onChange={(e) => setStrength(Number(e.target.value))}
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
            <div className="flex gap-3 relative">
              {(activeTab === 'Prompt' || activeTab === 'Recreate') && (
                <>
                  <div className="relative">
                    <ToolPill 
                      icon={<User size={18} className="text-teal-400" />} 
                      label={activePersona ? PERSONAS.find((p: any) => p.id === activePersona)?.label : "Personas"} 
                      isActive={activePersona !== null}
                      onClick={() => { setShowPersonas(!showPersonas); setShowStyles(false); }}
                    />
                    {showPersonas && (
                       <SelectionMenu 
                          options={PERSONAS} 
                          activeId={activePersona} 
                          onSelect={setActivePersona} 
                          onClose={() => setShowPersonas(false)}
                       />
                    )}
                  </div>
                  
                  <div className="relative">
                    <ToolPill 
                      icon={<ImageIcon size={18} className="text-teal-400" />} 
                      label={activeStyle ? STYLES.find((s: any) => s.id === activeStyle)?.label : "Styles"} 
                      isActive={activeStyle !== null}
                      onClick={() => { setShowStyles(!showStyles); setShowPersonas(false); }}
                    />
                    {showStyles && (
                       <SelectionMenu 
                          options={STYLES} 
                          activeId={activeStyle} 
                          onSelect={setActiveStyle} 
                          onClose={() => setShowStyles(false)}
                       />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Centered Generate Button (Floating Overlay effect) */}
            <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2 z-20">
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating}
                 className={`bg-[#2dd4bf] hover:bg-[#2cc9b5] text-black font-bold py-3 px-10 rounded-full shadow-[0_0_40px_-5px_rgba(45,212,191,0.4)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border-[3px] border-black/10 ${
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
                     <Sparkles size={20} className="fill-black text-black" />
                     <span className="text-base">Generate</span>
                   </>
                 )}
               </button>
            </div>

            {/* Right Tools */}
            <div className="flex gap-3 items-center">
              {activeTab === 'Prompt' && (
                <>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c1c1e] hover:bg-zinc-800 text-teal-400 transition-colors border border-white/5">
                    <Mic size={20} />
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1c1e] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors text-sm font-medium border border-white/5 group">
                    <Sparkles size={18} className="text-teal-400 group-hover:text-teal-300 transition-colors" />
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

const PERSONAS = [
  { id: 'mrbeast', label: 'MrBeast', prompt: 'loud expressive face, high saturation, shock emotion, wide eyes, youtube retention style' },
  { id: 'minimalist', label: 'Minimalist', prompt: 'clean background, negative space, bold typography style, high contrast, minimal elements' },
  { id: 'gaming', label: 'Gaming', prompt: 'rgb lighting, intense action, esports style, glowing effects, dynamic angle' },
  { id: 'business', label: 'Business', prompt: 'professional studio lighting, confident pose, clean corporate style, sharp focus' }
]

const STYLES = [
  { id: 'photorealistic', label: 'Photo Real', prompt: 'hyper realistic, 8k, photograph, raw candid' },
  { id: '3d', label: '3D Render', prompt: '3d blender render, pixar style, disney animation style, c4d' },
  { id: 'anime', label: 'Anime', prompt: 'anime art style, studio ghibli, vibrant, detailed cel shading' },
  { id: 'painting', label: 'Digital Art', prompt: 'digital painting, concept art, smooth brushwork, detailed illustration' }
]

function ToolPill({ icon, label, onClick, isActive }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-sm font-medium border ${
        isActive 
          ? 'bg-teal-500/10 border-teal-500 text-teal-400' 
          : 'bg-[#1c1c1e] hover:bg-zinc-800 text-zinc-300 hover:text-white border-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
      {isActive && <span className="flex h-2 w-2 rounded-full bg-teal-500 ml-1" />}
    </button>
  )
}

function SelectionMenu({ options, onSelect, activeId, onClose }: any) {
  return (
    <div className="absolute bottom-16 left-0 bg-[#09090b] border border-zinc-800 rounded-xl p-2 shadow-xl min-w-[200px] z-30 flex flex-col gap-1 animate-in slide-in-from-bottom-2 duration-200">
      {options.map((opt: any) => (
        <button
          key={opt.id}
          onClick={() => { onSelect(opt.id); onClose(); }}
          className={`px-3 py-2 text-left text-sm rounded-lg transition-colors ${
            activeId === opt.id 
              ? 'bg-teal-500/10 text-teal-400 font-medium' 
              : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
