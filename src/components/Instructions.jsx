import React from 'react';
import { motion } from 'framer-motion';

const Instructions = ({ translations }) => {
  return (
    <motion.div 
      className="bg-black/5 p-4 rounded-2xl text-sm leading-relaxed text-gray-600 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <strong>{translations.instructions}</strong>
    </motion.div>
  );
};

export default Instructions;