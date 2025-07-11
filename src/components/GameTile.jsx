import React from 'react';
import { motion } from 'framer-motion';

const GameTile = ({ letter, index, isSelected, isAnimating, onClick }) => {
  const getGradientClass = (index) => {
    const gradients = [
      'from-pink-400 to-pink-600',
      'from-blue-400 to-blue-600', 
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-indigo-400 to-indigo-600'
    ];
    return gradients[index % 7];
  };

  return (
    <motion.div
      className={`
        aspect-square flex items-center justify-center text-lg font-bold text-white 
        rounded-xl cursor-pointer select-none relative overflow-hidden
        bg-gradient-to-br ${getGradientClass(index)}
        ${isSelected ? 'ring-4 ring-white ring-opacity-80 shadow-lg' : ''}
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isAnimating ? {
        scale: [1, 1.2, 1],
        backgroundColor: ['#ffffff', '#ffd700', '#ffffff']
      } : {}}
      transition={{ 
        duration: isAnimating ? 0.6 : 0.2,
        ease: "easeInOut"
      }}
    >
      <motion.span
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {letter}
      </motion.span>
    </motion.div>
  );
};

export default GameTile;