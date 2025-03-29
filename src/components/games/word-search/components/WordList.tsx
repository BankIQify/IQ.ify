import { useWordSearchContext } from "../context/WordSearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, Star, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const WordList = () => {
  const { words, foundWords } = useWordSearchContext();
  const foundWordsCount = foundWords.length;
  const totalWords = words.length;
  const progress = (foundWordsCount / totalWords) * 100;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Progress: {foundWordsCount} / {totalWords}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg mb-4 flex items-center gap-3"
        >
          <Trophy className="w-5 h-5 text-yellow-500" />
          <p className="text-amber-700 font-medium">
            Congratulations! You've found all the words!
          </p>
        </motion.div>
      )}

      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {words.map((word) => {
            const isFound = foundWords.includes(word);
            
            return (
              <motion.li
                key={word}
                variants={item}
                layout
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-all duration-300",
                  "font-medium text-lg",
                  isFound
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600"
                    : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                )}
              >
                <div className="flex-1">
                  {isFound ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="line-through decoration-2"
                    >
                      {word}
                    </motion.span>
                  ) : (
                    <motion.span whileHover={{ scale: 1.02 }}>
                      {word}
                    </motion.span>
                  )}
                </div>
                
                {isFound && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 10
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {progress >= 50 && progress < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mt-4 flex items-center gap-3"
        >
          <Star className="w-5 h-5 text-blue-500" />
          <p className="text-blue-700 font-medium">
            You're doing great! Keep going!
          </p>
        </motion.div>
      )}
    </div>
  );
};
