"use client"

import type React from "react"

import { useEffect } from "react"
import jsQR from "jsqr"

interface QrCodeReaderProps {
  imageUrl: string
  onScanned: (text: string) => void
  onError: (errorMessage: string) => void
}

const QrCodeReader: React.FC<QrCodeReaderProps> = ({ imageUrl, onScanned, onError }) => {
  useEffect(() => {
    const decodeQrCode = async () => {
      try {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const context = canvas.getContext("2d")
          if (!context) {
            onError("Could not create canvas context.")
            return
          }
          context.drawImage(img, 0, 0, img.width, img.height)
          const imageData = context.getImageData(0, 0, img.width, img.height)
          const code = jsQR(imageData.data, img.width, img.height)

          if (code) {
            onScanned(code.data)
          } else {
            onError("QR code not found or is unreadable. Please upload a clearer image.")
          }
        }
        img.onerror = () => {
          onError("Error loading image.")
        }
        img.src = imageUrl
      } catch (error: any) {
        onError("An unexpected error occurred: " + error.message)
      }
    }

    decodeQrCode()
  }, [imageUrl, onScanned, onError])

  return null
}

export default QrCodeReader
