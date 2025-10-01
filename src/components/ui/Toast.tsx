"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  type: ToastType
  message: string
  onClose: () => void
  durationMs?: number
}

const typeStyles: Record<ToastType, { container: string; icon: string; label: string; iconBg: string }> = {
  success: {
    container: "bg-white border-l-4 border-green-700 text-gray-800",
    iconBg: "bg-green-50",
    icon: "✓",
    label: "Éxito",
  },
  error: {
    container: "bg-white border-l-4 border-red-700 text-gray-800",
    iconBg: "bg-red-50",
    icon: "✕",
    label: "Error",
  },
  info: {
    container: "bg-white border-l-4 border-blue-700 text-gray-800",
    iconBg: "bg-blue-50",
    icon: "i",
    label: "Info",
  },
  warning: {
    container: "bg-white border-l-4 border-amber-600 text-gray-800",
    iconBg: "bg-amber-50",
    icon: "!",
    label: "Aviso",
  },
}

export default function Toast({ type, message, onClose, durationMs = 4000 }: ToastProps) {
  const [mounted, setMounted] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const enterId = window.setTimeout(() => setMounted(true), 10)
    const autoId = window.setTimeout(() => {
      setLeaving(true)
      closeTimerRef.current = window.setTimeout(() => onClose(), 300)
    }, durationMs)
    return () => {
      window.clearTimeout(enterId)
      window.clearTimeout(autoId)
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    }
  }, [onClose, durationMs])

  const styles = typeStyles[type] || typeStyles.info

  const handleClose = () => {
    setLeaving(true)
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => onClose(), 300)
  }

  const toastContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
      <div
        className={`max-w-sm w-full pointer-events-auto shadow-xl shadow-black/5 rounded-xl border border-gray-100 backdrop-blur-sm ${styles.container} transition-all duration-300 ease-out ${mounted && !leaving ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="flex items-start gap-4 p-5">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <span className="text-sm font-semibold leading-none">{styles.icon}</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">{styles.label}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Cerrar notificación"
          >
            <span className="text-xs leading-none">✕</span>
          </button>
        </div>
      </div>
    </div>
  )

  // Render como portal para asegurar que aparezca por encima de todos los modales
  if (typeof document !== 'undefined') {
    return createPortal(toastContent, document.body)
  }
  return toastContent
}
