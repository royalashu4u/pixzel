'use client'

import { 
  Type, 
  Square, 
  Circle, 
  MousePointer2, 
  Image as ImageIcon,
  Download,
  Undo2,
  Redo2,
  Trash2
} from 'lucide-react'

interface ToolbarProps {
  activeTool: string
  setActiveTool: (tool: string) => void
}

export default function Toolbar({ activeTool, setActiveTool }: ToolbarProps) {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
  ]

  return (
    <div className="flex flex-col items-center py-4 gap-4 h-full">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          className={`p-3 rounded-xl transition tooltip group relative ${
            activeTool === tool.id 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
          <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none border border-white/10 z-50">
            {tool.label}
          </span>
        </button>
      ))}

      <div className="w-8 h-px bg-white/10 my-2" />

      <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition" title="Undo">
        <Undo2 className="w-5 h-5" />
      </button>
      <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition" title="Redo">
        <Redo2 className="w-5 h-5" />
      </button>
      
      <div className="mt-auto flex flex-col gap-4">
        <button className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition" title="Delete">
          <Trash2 className="w-5 h-5" />
        </button>
        <button className="p-3 bg-white text-slate-900 rounded-xl hover:bg-slate-200 transition shadow-lg" title="Export">
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
