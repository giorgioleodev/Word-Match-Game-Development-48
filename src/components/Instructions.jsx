import React from 'react';
import { motion } from 'framer-motion';

const Instructions = () => {
  return (
    <motion.div 
      className="bg-black/5 p-4 rounded-2xl text-sm leading-relaxed text-gray-600"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <strong>How to Play:</strong><br />
      Click two adjacent tiles to swap them. Form words horizontally, vertically, or diagonally (3+ letters). 
      Longer words = more points! Words disappear and new letters fall down.
    </motion.div>
  );
};

export default Instructions;