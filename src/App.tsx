import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('Ready');
  const [feedbackColor, setFeedbackColor] = useState<string>('text-slate-400');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasWon, setHasWon] = useState<boolean>(false);
  const MAX_ATTEMPTS = 10;

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setFeedback('Ready');
    setFeedbackColor('text-slate-400');
    setAttempts(0);
    setGameOver(false);
    setHasWon(false);
  };

  const handleGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (gameOver) return;

    const num = parseInt(guess, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setFeedback('Invalid input');
      setFeedbackColor('text-slate-600');
      return;
    }

    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);

    if (num === targetNumber) {
      setFeedback('Correct!');
      setFeedbackColor('text-emerald-500');
      setHasWon(true);
      setGameOver(true);
    } else if (currentAttempts >= MAX_ATTEMPTS) {
      setFeedback(`Game Over! It was ${targetNumber}`);
      setFeedbackColor('text-slate-800');
      setGameOver(true);
    } else if (num > targetNumber) {
      setFeedback('Too high');
      setFeedbackColor('text-amber-500');
    } else {
      setFeedback('Too low');
      setFeedbackColor('text-amber-500');
    }
    
    // Clear input after guess if not game over
    if (num !== targetNumber && currentAttempts < MAX_ATTEMPTS) {
      setGuess('');
    }
  };

  return (
    // Application Window / Stage equivalent
    <div className="min-h-screen bg-slate-200 flex items-center justify-center font-sans text-slate-900 overflow-hidden relative">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-0 left-0 p-8 sm:p-12 pointer-events-none">
        <span className="text-slate-200 text-[80px] sm:text-[120px] font-black leading-none select-none">?</span>
      </div>
      <div className="absolute bottom-0 right-0 p-8 sm:p-12 pointer-events-none">
        <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-slate-100 rounded-full flex items-center justify-center opacity-50">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border border-slate-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="w-full max-w-lg p-4 relative z-10">
        {/* Main container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-[40px] p-6 sm:p-10 shadow-xl shadow-slate-200/50 flex flex-col items-center w-full"
        >
          {/* Header Section */}
          <header className="mb-6 sm:mb-8 text-center w-full">
            <div className="w-12 h-1 bg-slate-900 mx-auto mb-4 sm:mb-6 rounded-full"></div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-800 mb-2 italic">
              Number Guessing Game
            </h1>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold">
              Try to guess the number between 1 and 100
            </p>
          </header>

          {/* Main Interaction Input and Button */}
          <form onSubmit={handleGuess} className="w-full space-y-4">
            <div className="relative group">
              <input
                type="number"
                min="1"
                max="100"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                disabled={gameOver}
                className="w-full h-16 sm:h-20 bg-slate-50 border-2 border-slate-100 rounded-3xl text-center text-3xl sm:text-4xl font-light focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300 placeholder-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="00"
              />
            </div>
            <button
              type="submit"
              disabled={gameOver || !guess}
              className="w-full h-14 sm:h-16 bg-slate-900 text-white rounded-3xl font-medium text-base sm:text-lg tracking-wide hover:shadow-lg active:scale-[0.98] transition-all disabled:bg-slate-300 disabled:shadow-none disabled:active:scale-100"
            >
              Guess
            </button>
          </form>

          {/* Feedback Label */}
          <div className="mt-6 sm:mt-8 h-14 w-full flex items-center justify-center text-center">
            <AnimatePresence mode="popLayout">
              <motion.div 
                key={attempts + feedback}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <span className={`font-medium text-lg uppercase tracking-widest ${feedbackColor}`}>
                  {feedback}
                </span>
                {(feedback === 'Too high' || feedback === 'Too low') && (
                  <div className="h-[1px] w-24 bg-amber-200"></div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer / Info Label - Attempts */}
          <footer className="mt-8 w-full pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">
                Attempts
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-light text-slate-900">
                  {attempts.toString().padStart(2, '0')}
                </span>
                <span className="text-slate-300 font-light">
                  / {MAX_ATTEMPTS.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <button
              onClick={startNewGame}
              className="px-5 sm:px-6 py-3 rounded-full border border-slate-200 text-slate-400 text-[10px] sm:text-xs uppercase font-bold tracking-widest hover:bg-slate-50 hover:text-slate-900 hover:border-slate-900 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Restart</span>
            </button>
          </footer>

        </motion.div>
      </div>
    </div>
  );
}
