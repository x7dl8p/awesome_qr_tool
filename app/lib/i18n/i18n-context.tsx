"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Language, Translations, TranslationKey } from "./translations/types"
import { translations, languages } from "./translations/index"

type I18nContextType = {
  t: (key: TranslationKey) => string
  currentLanguage: string
  setLanguage: (lang: string) => void
  languages: Language[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<string>("en")

  // Initialize language only after component mounts
  useEffect(() => {
    setIsClient(true)
    try {
      const savedLanguage = localStorage.getItem("qr-reader-language")
      const browserLanguage = navigator.language.split("-")[0]
      const isLanguageSupported = Object.keys(translations).includes(browserLanguage)

      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage)
      } else if (isLanguageSupported) {
        setCurrentLanguage(browserLanguage)
      }
    } catch (e) {
      // Fallback to default language if localStorage is not available
      console.warn("Failed to access browser APIs:", e)
    }
  }, [])

  // Update lang attribute after language changes
  useEffect(() => {
    if (isClient) {
      document.documentElement.lang = currentLanguage
    }
  }, [currentLanguage, isClient])

  const setLanguage = (lang: string) => {
    if (Object.keys(translations).includes(lang)) {
      setCurrentLanguage(lang)
      if (isClient) {
        try {
          localStorage.setItem("qr-reader-language", lang)
        } catch (e) {
          console.warn("Failed to save language preference:", e)
        }
      }
    }
  }

  const t = (key: TranslationKey): string => {
    const currentTranslations = translations[currentLanguage] as Translations
    return currentTranslations[key] || translations.en[key] || key
  }

  return <I18nContext.Provider value={{ t, currentLanguage, setLanguage, languages }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
