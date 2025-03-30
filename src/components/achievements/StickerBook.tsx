import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickerBookProps {
  stickers: Array<{
    id: string;
    name: string;
    imageUrl: string;
    unlocked: boolean;
    theme: string;
    task: string;
    chapter: number;
  }>;
  currentChapter?: number;
}

const CHAPTERS = [
  { id: 1, name: "Getting Started", theme: "space" },
  { id: 2, name: "Brain Training", theme: "animals" },
  { id: 3, name: "Quiz Master", theme: "toys" },
  { id: 4, name: "Daily Champion", theme: "nature" },
];

export const StickerBook = ({ stickers, currentChapter = 1 }: StickerBookProps) => {
  const [selectedChapter, setSelectedChapter] = useState(currentChapter);
  const [hoveredSticker, setHoveredSticker] = useState<string | null>(null);

  const chapterStickers = stickers.filter(s => Math.ceil(s.chapter) === selectedChapter);

  return (
    <Card className="card-iqify card-iqify-blue overflow-hidden">
      <CardHeader className="relative">
        <CardTitle className="text-xl text-iqify-navy flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-iqify-yellow" />
          Sticker Book
        </CardTitle>
        <div className="absolute right-4 top-4 flex gap-2">
          {CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setSelectedChapter(chapter.id)}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                selectedChapter === chapter.id
                  ? "bg-iqify-blue text-white"
                  : "bg-iqify-blue/10 text-iqify-blue hover:bg-iqify-blue/20"
              )}
            >
              {chapter.name}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4">
          {chapterStickers.map((sticker) => (
            <motion.div
              key={sticker.id}
              className="relative aspect-square"
              whileHover={{ scale: 1.1 }}
              onHoverStart={() => setHoveredSticker(sticker.id)}
              onHoverEnd={() => setHoveredSticker(null)}
            >
              <div
                className={cn(
                  "w-full h-full rounded-lg overflow-hidden",
                  !sticker.unlocked && "opacity-50 grayscale"
                )}
              >
                <img
                  src={sticker.imageUrl}
                  alt={sticker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {hoveredSticker === sticker.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg z-10 w-48"
                >
                  <p className="text-sm font-medium text-iqify-navy">{sticker.name}</p>
                  <p className="text-xs text-muted-foreground">{sticker.task}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}; 