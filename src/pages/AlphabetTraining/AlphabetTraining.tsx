import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './AlphabetTraining.module.scss';

const AlphabetTraining = () => {
  const [trainingMode, setTrainingMode] = useState<'letterToMorse' | 'morseToLetter'>('letterToMorse');
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [currentMorse, setCurrentMorse] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [userLetterInput, setUserLetterInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isWaitingForSubmit, setIsWaitingForSubmit] = useState(true);

  const previousLetter = useRef<string>('');
  const previousMorse = useRef<string>('');

  const morseAlphabet: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
    'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..'
  };

  const morseToLetterMap: { [key: string]: string } = Object.entries(morseAlphabet).reduce((acc, [letter, morse]) => {
    acc[morse] = letter;
    return acc;
  }, {} as { [key: string]: string });

  const getRandomLetter = useCallback(() => {
    const letters = Object.keys(morseAlphabet);
    let newLetter;
    
    do {
      newLetter = letters[Math.floor(Math.random() * letters.length)];
    } while (letters.length > 1 && newLetter === previousLetter.current);
    
    previousLetter.current = newLetter;
    return newLetter;
  }, [morseAlphabet]);

  const getRandomMorse = useCallback(() => {
    const morseCodes = Object.values(morseAlphabet);
    let newMorse;
    
    do {
      newMorse = morseCodes[Math.floor(Math.random() * morseCodes.length)];
    } while (morseCodes.length > 1 && newMorse === previousMorse.current);
    
    previousMorse.current = newMorse;
    return newMorse;
  }, [morseAlphabet]);

  const generateNewExercise = useCallback(() => {
    if (trainingMode === 'letterToMorse') {
      const newLetter = getRandomLetter();
      setCurrentLetter(newLetter);
      setCurrentMorse('');
    } else {
      const newMorse = getRandomMorse();
      setCurrentMorse(newMorse);
      setCurrentLetter('');
    }
    setUserInput('');
    setUserLetterInput('');
    setFeedback(null);
    setIsWaitingForSubmit(true);
  }, [trainingMode, getRandomLetter, getRandomMorse]);

  const checkAnswer = () => {
    if (!isWaitingForSubmit) return;

    if (trainingMode === 'letterToMorse') {
      const correctMorse = morseAlphabet[currentLetter];
      const normalizedUserInput = userInput.trim();
      const normalizedCorrectMorse = correctMorse.trim();
      
      const isCorrect = normalizedUserInput === normalizedCorrectMorse;
      
      setFeedback({
        message: isCorrect 
          ? 'Correct!' 
          : `Incorrect. The correct Morse for ${currentLetter} is: ${correctMorse}`,
        isCorrect
      });
      setScore(prev => ({
        ...prev,
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect
      }));
    } else {
      const correctLetter = morseToLetterMap[currentMorse];
      const normalizedUserInput = userLetterInput.trim().toUpperCase();
      
      const isCorrect = normalizedUserInput === correctLetter;
      
      setFeedback({
        message: isCorrect 
          ? 'Correct!' 
          : `Incorrect. The correct letter for "${currentMorse}" is: ${correctLetter}`,
        isCorrect
      });
      setScore(prev => ({
        ...prev,
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect
      }));
    }
    setIsWaitingForSubmit(false);
  };

  const skipLetter = () => {
    if (!isWaitingForSubmit) return;
    
    if (trainingMode === 'letterToMorse') {
      const correctMorse = morseAlphabet[currentLetter];
      setFeedback({
        message: `Skipped. The correct Morse for ${currentLetter} is: ${correctMorse}`,
        isCorrect: false
      });
    } else {
      const correctLetter = morseToLetterMap[currentMorse];
      setFeedback({
        message: `Skipped. The correct letter for "${currentMorse}" is: ${correctLetter}`,
        isCorrect: false
      });
    }
    
    setScore(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1
    }));
    setIsWaitingForSubmit(false);
  };

  const handleNextLetter = () => {
    generateNewExercise();
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (feedback) {
      if (event.key === 'Enter') {
        handleNextLetter();
      }
      return;
    }

    if (!isWaitingForSubmit) return;

    if (trainingMode === 'letterToMorse') {
      if (event.key === 'j' || event.key === 'J') {
        setUserInput(prev => prev + '.');
      } else if (event.key === 'k' || event.key === 'K') {
        setUserInput(prev => prev + '-');
      } else if (event.key === 'Enter') {
        checkAnswer();
      } else if (event.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
      }
    } else {
      if (event.key === 'Enter') {
        checkAnswer();
      } else if (event.key === 'Backspace') {
        setUserLetterInput(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        setUserLetterInput(prev => prev + event.key.toUpperCase());
      }
    }
  }, [isWaitingForSubmit, feedback, trainingMode, checkAnswer, handleNextLetter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    previousLetter.current = '';
    previousMorse.current = '';
    generateNewExercise();
  }, [trainingMode]);

  return (
    <div className={styles.alphabetTrainingContainer}>
      <div className={styles.fontBackground}></div>
      
      <div className={styles.trainingHeader}>
        <h1 className={styles.trainingTitle}>Alphabet Training</h1>
        <p className={styles.trainingDescription}>
          Practice individual letters - translate letters to Morse code or Morse code to letters.
        </p>
        <div className={styles.instructions}>
          {trainingMode === 'letterToMorse' 
            ? 'Use J for dot (•) and K for dash (–), Enter to submit'
            : 'Type the letter (A-Z), Enter to submit'
          }
        </div>
      </div>

      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeButton} ${trainingMode === 'letterToMorse' ? styles.active : ''}`}
          onClick={() => setTrainingMode('letterToMorse')}
        >
          Letter → Morse
        </button>
        <button
          className={`${styles.modeButton} ${trainingMode === 'morseToLetter' ? styles.active : ''}`}
          onClick={() => setTrainingMode('morseToLetter')}
        >
          Morse → Letter
        </button>
      </div>

      <div className={styles.practiceArea}>
        {trainingMode === 'letterToMorse' ? (
          <>
            <div className={styles.promptSection}>
              <div className={styles.promptLabel}>Translate this letter:</div>
              <div className={styles.letterDisplay}>{currentLetter}</div>
            </div>

            <div className={styles.inputSection}>
              <div className={styles.inputLabel}>Your Morse input:</div>
              <div className={styles.morseDisplay}>
                {userInput || <span className={styles.placeholder}></span>}
              </div>
              <div className={styles.inputHint}>
                Use J for • (dot) and K for – (dash)
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.promptSection}>
              <div className={styles.promptLabel}>Translate this Morse code:</div>
              <div className={styles.morseDisplayLarge}>{currentMorse}</div>
            </div>

            <div className={styles.inputSection}>
              <div className={styles.inputLabel}>Your answer (letter):</div>
              <div className={styles.letterInputDisplay}>
                {userLetterInput || <span className={styles.placeholder}></span>}
              </div>
              <div className={styles.inputHint}>
                Type the letter (A-Z)
              </div>
            </div>
          </>
        )}

        {feedback && (
          <div className={`${styles.feedback} ${feedback.isCorrect ? styles.correct : styles.incorrect}`}>
            {feedback.message}
            <div className={styles.nextHint}>
              Press Enter or click Next to continue
            </div>
          </div>
        )}
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Correct:</span>
            <span className={styles.statValue}>{score.correct}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Incorrect:</span>
            <span className={styles.statValue}>{score.incorrect}</span>
          </div>
        </div>

        <div className={styles.actions}>
          {!feedback ? (
            <>
              <button 
                className={styles.submitButton} 
                onClick={checkAnswer}
                disabled={trainingMode === 'letterToMorse' ? !userInput : !userLetterInput}
              >
                Submit (Enter)
              </button>
              <button 
                className={styles.skipButton} 
                onClick={skipLetter}
              >
                Skip
              </button>
            </>
          ) : (
            <button 
              className={styles.nextButton} 
              onClick={handleNextLetter}
            >
              Next (Enter)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlphabetTraining;