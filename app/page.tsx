"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  ClipboardCopy,
  AlertCircle,
  Zap,
  CheckCircle2,
  LinkIcon,
  Mail,
  MapPin,
  Phone,
  Text,
} from "lucide-react"
import QrCodeReader from "@/components/qr-code-reader"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import LanguageSelector from "@/components/language-selector"
import { useI18n } from "@/app/lib/i18n/i18n-context"
import { useQrHistory, type QrHistoryItem } from "@/hooks/use-history"
import { HistoryModal } from "@/components/history-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QrCodeGenerator from "@/components/qr-code-generator"

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const { t } = useI18n()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [qrText, setQrText] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("reader")

  // Use our history hook
  const { history, addToHistory, removeFromHistory, clearHistory } = useQrHistory()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setImageUrl(url)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setError(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setFile(file)
        const url = URL.createObjectURL(file)
        setImageUrl(url)
      } else {
        setError("Please drop an image file.")
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleQrCodeScanned = (text: string) => {
    setQrText(text)
    // Add to history when a QR code is successfully scanned
    if (text) {
      addToHistory(text, imageUrl || undefined)
    }
  }

  const handleQrCodeError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(qrText)
      .then(() => {
        toast({
          title: t("toastCopiedTitle"),
          description: t("toastCopiedDescription"),
          variant: "success",
        })
      })
      .catch((err) => {
        setError("Failed to copy text: " + err)
      })
  }

  const handleHistoryItemSelect = (item: QrHistoryItem) => {
    setQrText(item.text)
    if (item.imageUrl) {
      setImageUrl(item.imageUrl)
    }
  }

  useEffect(() => {
    const handleDocumentPaste = (e: ClipboardEvent) => {
      setError(null) // Clear any previous error messages
      const items = e.clipboardData?.items

      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile()
            if (blob) {
              setFile(blob)
              const url = URL.createObjectURL(blob)
              setImageUrl(url)
              return
            }
          }
        }

        setError(t("noImageError"))
      }
    }

    document.addEventListener("paste", handleDocumentPaste)
    return () => {
      document.removeEventListener("paste", handleDocumentPaste)
    }
  }, [t])

  // Set isClient to true after initial mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show nothing until client-side hydration is complete
  if (!isClient) {
    return null
  }

  return (
    <main className="container mx-auto py-10 px-4 font-mono">
      <h1 className="sr-only">QR Code Reader - Scan and Convert QR Codes to Text</h1>

      <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:justify-between sm:items-center">
        {activeTab === "reader" && (
          <HistoryModal
            history={history}
            onSelect={handleHistoryItemSelect}
            onRemove={removeFromHistory}
            onClear={clearHistory}
            open={historyOpen}
            onOpenChange={setHistoryOpen}
          />
        )}
        <LanguageSelector />
      </div>

      <Tabs defaultValue="reader" className="w-full max-w-3xl mx-auto mb-12" onValueChange={setActiveTab}>
        <TabsList className="flex justify-start items-center gap-4 mb-8 bg-[#ffde59]">
          <TabsTrigger value="reader" className="neo-brutalist-tab-trigger data-[state=active]:outline data-[state=active]:outline-2 data-[state=active]:outline-black data-[state=active]:outline-offset-[-4px]">{t("qrReaderTab")}</TabsTrigger>
          <TabsTrigger value="generator" className="neo-brutalist-tab-trigger data-[state=active]:outline data-[state=active]:outline-2 data-[state=active]:outline-black data-[state=active]:outline-offset-[-4px]">{t("qrGeneratorTab")}</TabsTrigger>
        </TabsList>
        <TabsContent value="reader">
          <Card className="neo-brutalist-card w-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-8 w-8 text-accent" />
                <CardTitle className="text-3xl font-black tracking-tight">{t("title")}</CardTitle>
              </div>
              <CardDescription className="text-base font-medium">{t("description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="space-y-6">
                <div
                  className="neo-brutalist-upload-area p-10 text-center cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  aria-label="Upload QR code image"
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-base font-bold mb-2">{t("uploadInstructions")}</p>
                  <p className="text-sm">{t("uploadFormats")}</p>
                  <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>

                <div className="text-center">
                  <p className="text-base font-bold">{t("pasteInstructions")}</p>
                  <p className="text-sm text-muted-foreground">{t("pasteSubtext")}</p>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="neo-brutalist-alert mt-4">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle className="font-bold">{t("errorTitle")}</AlertTitle>
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {imageUrl && (
                <>
                  <Separator className="h-[3px] bg-black my-6" />
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-black mb-3 uppercase">{t("qrCodeImage")}</h2>
                      <div className="neo-brutalist-section max-w-xs mx-auto">
                        <img src={imageUrl || "/placeholder.svg"} alt="Uploaded QR Code" className="max-w-full h-auto" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-black mb-3 uppercase">{t("decodedContent")}</h2>
                      <div className="relative">
                        <Textarea
                          value={qrText}
                          readOnly
                          className="neo-brutalist-textarea min-h-[150px] p-3 font-medium"
                          placeholder={t("placeholder")}
                          aria-label="Decoded QR code content"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {imageUrl && <QrCodeReader imageUrl={imageUrl} onScanned={handleQrCodeScanned} onError={handleQrCodeError} />}
            </CardContent>
            <CardFooter className="flex justify-between p-6 pt-0">
              {qrText && (
                <Button
                  className="neo-brutalist-button font-bold text-white px-8 py-6 text-lg flex-1 mx-auto hover:bg-opacity-90 transition-all"
                  onClick={copyToClipboard}
                >
                  <ClipboardCopy className="h-6 w-6 mr-3" />
                  {t("copyText")}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="generator">
          <QrCodeGenerator />
        </TabsContent>
      </Tabs>

      <div
        id="help-section"
        className={`neo-brutalist-card w-full max-w-3xl mx-auto`}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-black">
            {activeTab === "reader" ? t("howToUseReader") : t("howToUseGenerator")}
          </CardTitle>
          <CardDescription className="text-base font-medium">
            {activeTab === "reader" ? t("followStepsReader") : t("followStepsGenerator")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-black">STEP-BY-STEP INSTRUCTIONS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="neo-brutalist-section">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {activeTab === "reader" ? t("readerStep1Title") : t("generatorStep1Title")}
                    </h3>
                    <p>
                      {activeTab === "reader" ? t("readerStep1Description") : t("generatorStep1Description")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="neo-brutalist-section">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {activeTab === "reader" ? t("readerStep2Title") : t("generatorStep2Title")}
                    </h3>
                    <p>
                      {activeTab === "reader" ? t("readerStep2Description") : t("generatorStep2Description")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="neo-brutalist-section">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t("generatorStep3Title")}</h3>
                    <p>{t("generatorStep3Description")}</p>
                  </div>
                </div>
              </div>

              {activeTab === "reader" && (
                <div className="neo-brutalist-section">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{t("readerStep4Title")}</h3>
                      <p>{t("readerStep4Description")}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="h-[3px] bg-black" />

          <div className="space-y-4">
            <h2 className="text-xl font-black">{t("faqTitle")}</h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="neo-brutalist-section">
                <AccordionTrigger className="font-bold text-lg">{t("faq1Question")}</AccordionTrigger>
                <AccordionContent>{t("faq1Answer")}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="neo-brutalist-section">
                <AccordionTrigger className="font-bold text-lg">{t("faq2Question")}</AccordionTrigger>
                <AccordionContent>{t("faq2Answer")}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="neo-brutalist-section">
                <AccordionTrigger className="font-bold text-lg">{t("faq3Question")}</AccordionTrigger>
                <AccordionContent>{t("faq3Answer")}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="neo-brutalist-section">
                <AccordionTrigger className="font-bold text-lg">{t("faq4Question")}</AccordionTrigger>
                <AccordionContent>{t("faq4Answer")}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="neo-brutalist-section">
                <AccordionTrigger className="font-bold text-lg">{t("faq5Question")}</AccordionTrigger>
                <AccordionContent>{t("faq5Answer")}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          {/* Hide help button removed as help is always shown when no QR code is scanned */}
        </CardFooter>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-sm font-bold mb-2">{t("footerTitle")}</p>
        <p className="text-xs max-w-xl mx-auto">{t("footerDescription")}</p>
      </footer>
    </main>
  )
}
