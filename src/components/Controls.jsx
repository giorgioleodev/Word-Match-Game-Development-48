import React from 'react';
import { motion } from 'framer-motion';

const Controls = ({ onNewGame }) => {
  return (
    <motion.div 
      className="flex justify-center mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <motion.button
        className="px-6 py-3 text-lg font-bold border-none rounded-full cursor-pointer 
                   bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
        onClick={onNewGame}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        New Game
      </motion.button>
    </motion.div>
  );
};

export default Controls;