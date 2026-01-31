'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useAuth } from '@/contexts/AuthContext'

interface CanvasProps {
  activeTool: string
}

export default function Canvas({ activeTool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1280,
      height: 720,
      backgroundColor: '#1e293b', // slate-800
      preserveObjectStacking: true,
      selection: true,
    })

    // Resize canvas to fit container while maintaining aspect ratio
    const resizeCanvas = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight
      const scale = Math.min(
        containerWidth / 1280,
        containerHeight / 720
      ) * 0.95 // 95% to leave some margin

      canvas.setDimensions({
        width: 1280 * scale,
        height: 720 * scale
      })
      
      canvas.setZoom(scale)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    setFabricCanvas(canvas)

    return () => {
      canvas.dispose()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Handle Tool Changes
  useEffect(() => {
    if (!fabricCanvas) return

    fabricCanvas.isDrawingMode = false
    fabricCanvas.selection = true

    switch (activeTool) {
      case 'text':
        addText()
        break
      case 'rect':
        addRect()
        break
      case 'circle':
        addCircle()
        break
    }
  }, [activeTool, fabricCanvas])

  const addText = () => {
    if (!fabricCanvas) return
    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontFamily: 'Inter',
      fill: '#ffffff',
      fontSize: 60,
    })
    fabricCanvas.add(text)
    fabricCanvas.setActiveObject(text)
    fabricCanvas.renderAll()
  }

  const addRect = () => {
    if (!fabricCanvas) return
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#a855f7', // purple-500
      width: 200,
      height: 200,
    })
    fabricCanvas.add(rect)
    fabricCanvas.setActiveObject(rect)
    fabricCanvas.renderAll()
  }

  const addCircle = () => {
    if (!fabricCanvas) return
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      fill: '#ec4899', // pink-500
      radius: 100,
    })
    fabricCanvas.add(circle)
    fabricCanvas.setActiveObject(circle)
    fabricCanvas.renderAll()
  }

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fabricCanvas) return

      // Delete (Backspace or Delete key)
      if (e.key === 'Backspace' || e.key === 'Delete') {
        // Don't delete if editing text
        const activeObj = fabricCanvas.getActiveObject()
        if (activeObj && !(activeObj instanceof fabric.IText && activeObj.isEditing)) {
          const activeObjects = fabricCanvas.getActiveObjects()
          if (activeObjects.length) {
            fabricCanvas.discardActiveObject()
            activeObjects.forEach((obj) => {
              fabricCanvas.remove(obj)
            })
            fabricCanvas.requestRenderAll()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fabricCanvas])

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-slate-900/50">
      <canvas ref={canvasRef} />
    </div>
  )
}
