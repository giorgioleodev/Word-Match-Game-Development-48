import React from 'react';
import { motion } from 'framer-motion';

const LanguageSwitch = ({ language, onSwitch, translations }) => {
  return (
    <motion.div 
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <motion.button
        className="px-4 py-2 text-sm font-bold border-none rounded-lg cursor-pointer 
                   bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
        onClick={onSwitch}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {translations.switchLanguage}
      </motion.button>
    </motion.div>
  );
};

export default LanguageSwitch;