import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#09090b] text-white flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-4">
        Pricing Plans
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mb-8">
        We are currently working on our pricing plans. For now, enjoy the early access credits and create viral thumbnails!
      </p>
      <Link 
        href="/studio" 
        className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition shadow-lg shadow-purple-500/20"
      >
        Go to Studio
      </Link>
    </div>
  )
}
