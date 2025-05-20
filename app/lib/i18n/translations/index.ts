import { Language, Translations } from './types'
import { en } from './en'
import { ar } from './ar'
import { es } from './es'
import { fr } from './fr'
import { de } from './de'
import { zh } from './zh'

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
]

export const translations: Record<string, Translations> = {
  en,
  ar,
  es,
  fr,
  de,
  zh
}

export type { Language, Translations, TranslationKey } from './types'