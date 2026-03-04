import Link from 'next/link'
import { 
  Sparkles, 
  RotateCcw, 
  Image as ImageIcon,
  User,
  Type,
  BarChart2,
  ArrowRight,
  Play
} from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-[#09090b] text-white min-h-screen font-sans selection:bg-teal-500/30 overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <main className="relative z-10">
        
        {/* Navigation spacer if global nav is fixed, otherwise just padding */}
        <div className="h-16" />

        {/* Hero Section */}
        <section className="px-6 pb-24 pt-12 md:pt-24 max-w-7xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-teal-400 font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Pixzel Studio is live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            Stop Guessing. <br className="md:hidden" />
            Start <span className="bg-gradient-to-r from-teal-400 to-emerald-300 text-transparent bg-clip-text">Going Viral.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            The ultimate AI thumbnail studio. Clone top-performing styles, swap faces instantly, and generate high-CTR thumbnails from any YouTube link.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link 
              href="/studio" 
              className="px-8 py-4 bg-[#2dd4bf] hover:bg-[#2cc9b5] text-black rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(45,212,191,0.5)] border-[3px] border-black/10"
            >
              <Sparkles className="w-5 h-5" />
              Open Studio Now
            </Link>
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-5 h-5" />
              Start Free Trial
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="px-6 py-24 border-y border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need. <br className="md:hidden" />Nothing you don't.</h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto">Designed exclusively for YouTube creators who want to maximize CTR without spending hours in Photoshop.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-8 rounded-[32px] bg-[#1c1c1e]/50 border border-white/5 hover:border-teal-500/30 hover:bg-[#1c1c1e] transition-colors group">
                <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">One-Click Recreate</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Paste any YouTube URL. We'll identify the thumbnail's exact composition, lighting, and style, and recreate a highly-detailed template based on it.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-[32px] bg-[#1c1c1e]/50 border border-white/5 hover:border-teal-500/30 hover:bg-[#1c1c1e] transition-colors group">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI Face Swap</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Steal the composition, keep your brand. Upload a photo of your face, and seamlessly swap yourself into the cloned thumbnail's character.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-[32px] bg-[#1c1c1e]/50 border border-white/5 hover:border-teal-500/30 hover:bg-[#1c1c1e] transition-colors group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Personas & Styles</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Generating from scratch? Use built-in Personas like 'MrBeast' or 'Gaming' and instantly apply 3D, Anime, or Photorealistic styles.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-[32px] bg-[#1c1c1e]/50 border border-white/5 hover:border-teal-500/30 hover:bg-[#1c1c1e] transition-colors group lg:col-span-2">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Type className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Viral Title Generator</h3>
                <p className="text-zinc-400 leading-relaxed max-w-xl">
                  A good thumbnail needs a good hook. Generate perfectly optimized titles matching psychological triggers like Curiosity, Shock, and Clickbait styles.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-[32px] bg-[#1c1c1e]/50 border border-white/5 hover:border-teal-500/30 hover:bg-[#1c1c1e] transition-colors group">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
                  Thumbnail Analysis
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">New</span>
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Drop an existing thumbnail to instantly receive a virality score, contrast feedback, and actionable AI fixes before you publish.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow / Steps Section */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight">The 3-Step Viral Workflow</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
             <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-2xl mb-6">1</div>
                <h3 className="text-xl font-bold mb-2">Paste a Link</h3>
                <p className="text-zinc-400">Find a thumbnail with millions of views and paste its YouTube URL.</p>
             </div>
             <ArrowRight className="text-zinc-700 hidden md:block w-8 h-8" />
             <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-2xl mb-6">2</div>
                <h3 className="text-xl font-bold mb-2">Swap & Tweak</h3>
                <p className="text-zinc-400">Upload your face and adjust the "Creative Remix" slider.</p>
             </div>
             <ArrowRight className="text-zinc-700 hidden md:block w-8 h-8" />
             <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-2xl mb-6">3</div>
                <h3 className="text-xl font-bold mb-2">Generate & Win</h3>
                <p className="text-zinc-400">Export your 8K thumbnail and watch your CTR skyrocket.</p>
             </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-teal-500/5" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to break the algorithm?</h2>
            <Link 
              href="/signup" 
              className="inline-flex px-10 py-5 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-lg items-center gap-3 transition-transform hover:scale-105"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <footer className="px-6 py-8 border-t border-white/5 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} Pixzel. All rights reserved.</p>
        </footer>

      </main>
    </div>
  )
}
