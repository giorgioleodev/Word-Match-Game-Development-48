import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameGrid from './components/GameGrid';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import Instructions from './components/Instructions';
import WordFoundNotification from './components/WordFoundNotification';
import { WORDS } from './utils/wordDictionary';
import './App.css';

const GRID_SIZE = 7;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const VOWELS = 'AEIOU';

function App() {
  const [grid, setGrid] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => 
    parseInt(localStorage.getItem('wordMatchBestScore') || '0')
  );
  const [foundWords, setFoundWords] = useState([]);
  const [animatingTiles, setAnimatingTiles] = useState(new Set());

  const generateLetters = useCallback(() => {
    const newGrid = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const letter = Math.random() < 0.3 ? 
        VOWELS[Math.floor(Math.random() * VOWELS.length)] :
        LETTERS[Math.floor(Math.random() * LETTERS.length)];
      newGrid.push(letter);
    }
    return newGrid;
  }, []);

  const newGame = useCallback(() => {
    setScore(0);
    setSelectedTile(null);
    setFoundWords([]);
    setAnimatingTiles(new Set());
    setGrid(generateLetters());
  }, [generateLetters]);

  const areAdjacent = useCallback((index1, index2) => {
    const row1 = Math.floor(index1 / GRID_SIZE);
    const col1 = index1 % GRID_SIZE;
    const row2 = Math.floor(index2 / GRID_SIZE);
    const col2 = index2 % GRID_SIZE;
    
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }, []);

  const swapTiles = useCallback((index1, index2) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const temp = newGrid[index1];
      newGrid[index1] = newGrid[index2];
      newGrid[index2] = temp;
      return newGrid;
    });
  }, []);

  const getHorizontalWord = useCallback((row, startCol) => {
    let word = '';
    for (let col = startCol; col < GRID_SIZE; col++) {
      const letter = grid[row * GRID_SIZE + col];
      if (letter && /[A-Z]/.test(letter)) {
        word += letter;
      } else {
        break;
      }
    }
    return word;
  }, [grid]);

  const getVerticalWord = useCallback((startRow, col) => {
    let word = '';
    for (let row = startRow; row < GRID_SIZE; row++) {
      const letter = grid[row * GRID_SIZE + col];
      if (letter && /[A-Z]/.test(letter)) {
        word += letter;
      } else {
        break;
      }
    }
    return word;
  }, [grid]);

  const getDiagonalWord = useCallback((startRow, startCol, rowDir, colDir) => {
    let word = '';
    let row = startRow;
    let col = startCol;
    
    while (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      const letter = grid[row * GRID_SIZE + col];
      if (letter && /[A-Z]/.test(letter)) {
        word += letter;
        row += rowDir;
        col += colDir;
      } else {
        break;
      }
    }
    return word;
  }, [grid]);

  const checkForWords = useCallback(() => {
    const foundWordsData = [];
    
    // Check horizontal words
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col <= GRID_SIZE - 3; col++) {
        const word = getHorizontalWord(row, col);
        if (word.length >= 3 && WORDS.includes(word.toLowerCase())) {
          const indices = [];
          for (let i = 0; i < word.length; i++) {
            indices.push(row * GRID_SIZE + col + i);
          }
          foundWordsData.push({word, indices});
        }
      }
    }
    
    // Check vertical words
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row <= GRID_SIZE - 3; row++) {
        const word = getVerticalWord(row, col);
        if (word.length >= 3 && WORDS.includes(word.toLowerCase())) {
          const indices = [];
          for (let i = 0; i < word.length; i++) {
            indices.push((row + i) * GRID_SIZE + col);
          }
          foundWordsData.push({word, indices});
        }
      }
    }
    
    // Check diagonal words (top-left to bottom-right)
    for (let row = 0; row <= GRID_SIZE - 3; row++) {
      for (let col = 0; col <= GRID_SIZE - 3; col++) {
        const word = getDiagonalWord(row, col, 1, 1);
        if (word.length >= 3 && WORDS.includes(word.toLowerCase())) {
          const indices = [];
          for (let i = 0; i < word.length; i++) {
            indices.push((row + i) * GRID_SIZE + col + i);
          }
          foundWordsData.push({word, indices});
        }
      }
    }
    
    // Check diagonal words (top-right to bottom-left)
    for (let row = 0; row <= GRID_SIZE - 3; row++) {
      for (let col = 2; col < GRID_SIZE; col++) {
        const word = getDiagonalWord(row, col, 1, -1);
        if (word.length >= 3 && WORDS.includes(word.toLowerCase())) {
          const indices = [];
          for (let i = 0; i < word.length; i++) {
            indices.push((row + i) * GRID_SIZE + col - i);
          }
          foundWordsData.push({word, indices});
        }
      }
    }
    
    if (foundWordsData.length > 0) {
      processFoundWords(foundWordsData);
    }
  }, [getHorizontalWord, getVerticalWord, getDiagonalWord]);

  const calculateWordScore = useCallback((word) => {
    const baseScore = word.length * 10;
    const lengthBonus = word.length > 4 ? (word.length - 4) * 5 : 0;
    return baseScore + lengthBonus;
  }, []);

  const processFoundWords = useCallback((foundWordsData) => {
    let totalScore = 0;
    const allIndices = new Set();
    
    foundWordsData.forEach(({word, indices}) => {
      const wordScore = calculateWordScore(word);
      totalScore += wordScore;
      
      indices.forEach(index => {
        allIndices.add(index);
      });
      
      setFoundWords(prev => [...prev, {word, score: wordScore, id: Date.now() + Math.random()}]);
    });
    
    setAnimatingTiles(allIndices);
    
    // Update score
    const newScore = score + totalScore;
    setScore(newScore);
    
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem('wordMatchBestScore', newScore.toString());
    }
    
    // Remove found letters and apply gravity
    setTimeout(() => {
      removeLettersAndApplyGravity(Array.from(allIndices));
    }, 1000);
  }, [score, bestScore, calculateWordScore]);

  const removeLettersAndApplyGravity = useCallback((indices) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      
      // Remove letters at found positions
      indices.forEach(index => {
        newGrid[index] = null;
      });
      
      // Apply gravity - move letters down
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = [];
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          const letter = newGrid[row * GRID_SIZE + col];
          if (letter !== null) {
            column.push(letter);
          }
        }
        
        // Fill column from bottom
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          if (column.length > 0) {
            newGrid[row * GRID_SIZE + col] = column.shift();
          } else {
            // Generate new letter for empty spots
            const newLetter = Math.random() < 0.3 ? 
              VOWELS[Math.floor(Math.random() * VOWELS.length)] :
              LETTERS[Math.floor(Math.random() * LETTERS.length)];
            newGrid[row * GRID_SIZE + col] = newLetter;
          }
        }
      }
      
      return newGrid;
    });
    
    setAnimatingTiles(new Set());
    
    // Check for new words after gravity
    setTimeout(() => {
      checkForWords();
    }, 800);
  }, [checkForWords]);

  const handleTileClick = useCallback((clickedIndex) => {
    if (selectedTile === null) {
      setSelectedTile(clickedIndex);
    } else if (selectedTile === clickedIndex) {
      setSelectedTile(null);
    } else if (areAdjacent(selectedTile, clickedIndex)) {
      swapTiles(selectedTile, clickedIndex);
      setSelectedTile(null);
      
      setTimeout(() => {
        checkForWords();
      }, 300);
    } else {
      setSelectedTile(clickedIndex);
    }
  }, [selectedTile, areAdjacent, swapTiles, checkForWords]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-700 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Word Match
          </h1>
        </motion.div>
        
        <ScoreBoard score={score} bestScore={bestScore} />
        <GameGrid 
          grid={grid}
          selectedTile={selectedTile}
          animatingTiles={animatingTiles}
          onTileClick={handleTileClick}
        />
        <Controls onNewGame={newGame} />
        <Instructions />
      </motion.div>
      
      <AnimatePresence>
        {foundWords.map((wordData) => (
          <WordFoundNotification
            key={wordData.id}
            word={wordData.word}
            score={wordData.score}
            onComplete={() => {
              setFoundWords(prev => prev.filter(w => w.id !== wordData.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default App;