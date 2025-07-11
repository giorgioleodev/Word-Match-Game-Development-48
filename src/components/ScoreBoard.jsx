import React from 'react';
import { motion } from 'framer-motion';

const ScoreBoard = ({ score, bestScore }) => {
  return (
    <motion.div 
      className="flex justify-between mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl text-white font-bold"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="text-center">
        <div className="text-sm mb-1">Score</div>
        <motion.div 
          className="text-2xl"
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {score}
        </motion.div>
      </div>
      <div className="text-center">
        <div className="text-sm mb-1">Best</div>
        <motion.div 
          className="text-2xl"
          key={bestScore}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {bestScore}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScoreBoard;