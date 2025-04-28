import { motion } from 'framer-motion';

export const LoadingFallback = () => (
  <motion.div 
    className="flex h-screen w-full items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="h-32 w-32 rounded-full border-b-2 border-t-2 border-gray-900"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.div>
);
