import React from 'react';
import { motion } from 'framer-motion';
import GameTile from './GameTile';

const GameGrid = ({ grid, selectedTile, animatingTiles, onTileClick }) => {
  return (
    <motion.div 
      className="grid grid-cols-7 gap-1 mb-6 p-4 bg-black/5 rounded-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      {grid.map((letter, index) => (
        <GameTile
          key={index}
          letter={letter}
          index={index}
          isSelected={selectedTile === index}
          isAnimating={animatingTiles.has(index)}
          onClick={() => onTileClick(index)}
        />
      ))}
    </motion.div>
  );
};

export default GameGrid;