"use client"

import { useState, useEffect } from "react"

export interface QrHistoryItem {
  id: string
  text: string
  timestamp: number
  imageUrl?: string
}

export function useQrHistory() {
  const [history, setHistory] = useState<QrHistoryItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Only run on client-side after initial mount
  useEffect(() => {
    setIsClient(true)
    try {
      const savedHistory = localStorage.getItem("qr-code-history")
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory)
      }
    } catch (error) {
      console.error("Failed to load history:", error)
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isClient && history.length > 0) {
      try {
        localStorage.setItem("qr-code-history", JSON.stringify(history))
      } catch (error) {
        console.error("Failed to save history:", error)
      }
    }
  }, [history, isClient])

  // Add a new QR code to history
  const addToHistory = (text: string, imageUrl?: string) => {
    // Don't add empty text
    if (!text.trim()) return

    // Create new history item
    const newItem: QrHistoryItem = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
      imageUrl,
    }

    // Add to beginning of history (most recent first)
    setHistory((prev) => {
      // Check if this exact text already exists in history
      const existingIndex = prev.findIndex((item) => item.text === text)

      if (existingIndex >= 0) {
        // Move to top and update timestamp if exists
        const updated = [...prev]
        const [existing] = updated.splice(existingIndex, 1)
        return [{ ...existing, timestamp: Date.now(), imageUrl }, ...updated]
      }

      // Limit history to 50 items
      const newHistory = [newItem, ...prev]
      if (newHistory.length > 50) {
        return newHistory.slice(0, 50)
      }
      return newHistory
    })
  }

  // Remove an item from history
  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  // Clear all history
  const clearHistory = () => {
    setHistory([])
  }

  return {
    history,
    addToHistory: isClient ? addToHistory : () => {},
    removeFromHistory: isClient ? removeFromHistory : () => {},
    clearHistory: isClient ? clearHistory : () => {},
    isLoaded: isClient,
  }
}
