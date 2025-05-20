"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { History } from "lucide-react"
import HistoryPanel from "@/components/history-panel"
import { useI18n } from "@/app/lib/i18n/i18n-context"
import type { QrHistoryItem } from "@/hooks/use-history"

interface HistoryModalProps {
  history: QrHistoryItem[]
  onSelect: (item: QrHistoryItem) => void
  onRemove: (id: string) => void
  onClear: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HistoryModal({ history, onSelect, onRemove, onClear, open, onOpenChange }: HistoryModalProps) {
  const { t } = useI18n()

  const handleItemSelect = (item: QrHistoryItem) => {
    onSelect(item)
    onOpenChange(false) // Close modal after selecting an item
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="neo-brutalist-input hover:bg-white rounded-none flex gap-2 items-center border-[3px] border-black"
          onClick={() => onOpenChange(true)}
        >
          <History className="h-4 w-4" />
          <span className="font-medium">{t("historyTitle")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="neo-brutalist-card border-[3px] border-black shadow-lg p-6 max-w-xl w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase">{t("historyTitle")}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <HistoryPanel history={history} onSelect={handleItemSelect} onRemove={onRemove} onClear={onClear} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
