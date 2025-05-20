"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Clock, ExternalLink, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { QrHistoryItem } from "@/hooks/use-history";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/app/lib/i18n/i18n-context";

interface HistoryPanelProps {
  history: QrHistoryItem[];
  onSelect: (item: QrHistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function HistoryPanel({
  history,
  onSelect,
  onRemove,
  onClear,
}: HistoryPanelProps) {
  const { toast } = useToast();
  const { t } = useI18n();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = (text: string) => {
    if (isClient) {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: t("toastCopiedTitle"),
          description: t("toastCopiedDescription"),
          variant: "success",
        });
      });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Helper to determine if text is a URL
  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  // Helper to truncate text
  const truncateText = (text: string, maxLength = 30) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t("historyTitle")}
        </h2>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="neo-brutalist-input hover:bg-white rounded-none"
            onClick={onClear}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("clearHistory")}
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="neo-brutalist-section p-4 text-center">
          <p className="text-muted-foreground">{t("noHistory")}</p>
        </div>
      ) : (
        <ScrollArea className="h-[300px] neo-brutalist-section p-0">
          <div className="space-y-0 divide-y-[3px] divide-black">
            {history.map((item) => (
              <div key={item.id} className="p-3 hover:bg-muted/10">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <button
                      className="text-left w-full font-medium hover:underline break-all"
                      onClick={() => onSelect(item)}
                    >
                      {expandedItem === item.id
                        ? item.text
                        : truncateText(item.text)}
                    </button>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(item.timestamp, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                <Button
                    variant="link"
                    size="sm"
                    className="mt-1 h-auto p-0 text-xs pr-4"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {expandedItem === item.id ? t("showLess") : t("showMore")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(item.text)}
                    title={t("copyText")}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">{t("copyText")}</span>
                  </Button>
                  {isUrl(item.text) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                      title={t("openLink")}
                    >
                      <a
                        href={item.text}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">{t("openLink")}</span>
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onRemove(item.id)}
                    title={t("removeFromHistory")}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t("removeFromHistory")}</span>
                  </Button>
                  
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
