import { useWordSearchContext } from "../context/WordSearchContext";
import { WordGrid } from "./WordGrid";
import { WordList } from "./WordList";
import { GameHeader } from "./GameHeader";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const WordSearchContent = () => {
  const { loading, checkSelection } = useWordSearchContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        checkSelection();
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [checkSelection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-gray-600"
        >
          Loading your word search puzzle...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <GameHeader />

      <div className={cn(
        "w-full max-w-6xl mx-auto p-4",
        "flex flex-col md:flex-row gap-6",
        "items-start justify-center"
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-2/3"
        >
          <WordGrid />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full md:w-1/3 md:sticky md:top-4"
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-slate-50">
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Words to Find
              </h3>
              <WordList />
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
