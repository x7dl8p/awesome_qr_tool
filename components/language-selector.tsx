"use client"

import { useI18n } from "@/app/lib/i18n/i18n-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useState, useEffect } from "react"
import GitHubLink from "./github-link"

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, languages } = useI18n()
  const [open, setOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getCurrentLanguageName = () => {
    const lang = languages.find((l) => l.code === currentLanguage)
    return lang ? lang.nativeName : "English"
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <GitHubLink />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="neo-brutalist-input flex gap-2 items-center h-10 hover:bg-white rounded-none"
            onClick={() => setOpen(true)}
          >
            <Globe className="h-4 w-4" />
            <span className="font-medium">{getCurrentLanguageName()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={5}
          className="neo-brutalist-section min-w-[180px] p-0 border-[3px] border-black bg-white"
          style={{ zIndex: 9999 }}
          forceMount
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className={`cursor-pointer font-medium p-2 hover:bg-muted/30 ${
                currentLanguage === language.code ? "bg-secondary" : ""
              }`}
              onClick={() => {
                setLanguage(language.code)
                setOpen(false)
              }}
            >
              {language.nativeName} ({language.name})
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
