"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Download, Text } from "lucide-react"
import { useI18n } from "@/app/lib/i18n/i18n-context"

export default function QrCodeGenerator() {
  const { t } = useI18n()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [text, setText] = useState<string>("")
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show nothing until client-side hydration is complete
  if (!isClient) {
    return null
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas")
      if (canvas) {
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = "qr-code.png"
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        toast({
          title: t("toastDownloadTitle"),
          description: t("toastDownloadDescription"),
          variant: "success",
        })
      } else {
        toast({
          title: t("errorTitle"),
          description: t("qrNotGeneratedError"),
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="neo-brutalist-card w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Text className="h-8 w-8 text-accent" />
          <CardTitle className="text-3xl font-black tracking-tight">{t("generatorTitle")}</CardTitle>
        </div>
        <CardDescription className="text-base font-medium">{t("generatorDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div>
          <label htmlFor="qr-text-input" className="block text-sm font-medium text-gray-700 mb-1">
            {t("textToEncode")}
          </label>
          <Input
            id="qr-text-input"
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder={t("enterTextPlaceholder")}
            className="neo-brutalist-input"
          />
        </div>

        {text && (
          <div className="mt-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">{t("generatedQrCode")}</h3>
            <div ref={qrRef} className="p-4 border-2 border-black neo-brutalist-section bg-white inline-block">
              <QRCodeCanvas value={text} size={256} level="H" bgColor="#ffffff" fgColor="#000000" />
            </div>
            <Button
              onClick={downloadQRCode}
              className="neo-brutalist-button font-bold text-white px-6 py-3 text-md mt-4"
              disabled={!text}
            >
              <Download className="h-5 w-5 mr-2" />
              {t("downloadQrCode")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
