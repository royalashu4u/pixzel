'use client'

import { useState } from 'react'
import { Search, Image, Smile, ArrowRight, Wand2 } from 'lucide-react'

export default function AssetLibrary() {
  const [activeTab, setActiveTab] = useState('templates')

  const tabs = [
    { id: 'templates', label: 'Templates' },
    { id: 'assets', label: 'Assets' },
    { id: 'ai', label: 'AI Gen' },
  ]

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-white/10">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-purple-500 bg-white/5'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'templates' && (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-video bg-slate-800 rounded-lg border border-white/5 hover:border-purple-500 transition cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                  <span className="text-xs font-medium">Template {i}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Stickers</h3>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-square bg-slate-800 rounded-md hover:bg-slate-700 transition cursor-pointer flex items-center justify-center text-2xl">
                    🔥
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Arrows</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-slate-800 rounded-md hover:bg-slate-700 transition cursor-pointer flex items-center justify-center p-2">
                    <ArrowRight className="w-full h-full text-red-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-400" />
                Generate Assets
              </h3>
              <textarea 
                placeholder="Describe an image to generate..." 
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-sm h-24 resize-none focus:outline-none focus:border-purple-500 mb-2"
              />
              <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium text-sm transition">
                Generate
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
               {/* AI Generated History */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
