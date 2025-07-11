import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const WordFoundNotification = ({ word, score, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed top-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 
                 text-white px-5 py-3 rounded-2xl font-bold shadow-lg z-50"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {word.toUpperCase()} +{score}
    </motion.div>
  );
};

export default WordFoundNotification;