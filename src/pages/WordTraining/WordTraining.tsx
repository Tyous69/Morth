import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WordTraining.module.scss';

const WordTraining = () => {
  const [trainingMode, setTrainingMode] = useState<'wordToMorse' | 'morseToWord'>('wordToMorse');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentMorse, setCurrentMorse] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [userWordInput, setUserWordInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isWaitingForSubmit, setIsWaitingForSubmit] = useState(true);
  const [activeButton, setActiveButton] = useState<'dot' | 'dash' | 'delete' | 'space' | null>(null);
  const navigate = useNavigate();

  const previousWord = useRef<string>('');

  const morseAlphabet: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
    'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..'
  };

  const wordLists = {
    easy: [
      'HELLO', 'WORLD', 'QUICK', 'JAZZY', 'BOXES', 'WHY', 'GYPSY', 'FUZZ', 'JACK', 'LAZY',
      'QUIZ', 'ZEBRA', 'JINX', 'VEX', 'WAX', 'JAZZ', 'PYGMY', 'QUIP', 'ZINC', 'JOKE',
      
      'TREE', 'HOUSE', 'APPLE', 'TABLE', 'CHAIR', 'WATER', 'MONEY', 'PAPER', 'MUSIC', 'PHONE',
      'CLOCK', 'FLOWER', 'BEACH', 'SMOKE', 'DREAM', 'LIGHT', 'NIGHT', 'RIGHT', 'SMILE', 'VOICE',
      
      'BRAVE', 'CLOUD', 'EARTH', 'FIRE', 'GRASS', 'HAPPY', 'OCEAN', 'PEACE', 'QUEEN', 'RIVER',
      'SNAKE', 'TIGER', 'UNION', 'VIDEO', 'WINDY', 'YACHT', 'ZOO', 'AXLE', 'BUZZ', 'CYCLE',
      
      'DJINN', 'ENZYME', 'FAJITA', 'GIZMO', 'HAJJ', 'IBEX', 'JOUST', 'KHAN', 'LYNX', 'MYTH',
      'NYMPH', 'ONYX', 'PHOTO', 'QUARK', 'RHINO', 'SYZYGY', 'TAXI', 'UPEND', 'VORTEX', 'WHIZ',
      
      'XYLEM', 'YOYO', 'ZAP', 'QUAY', 'JUKE', 'FOX', 'GYM', 'HAWK', 'JIVE', 'KAYAK',
      'LAZY', 'MAX', 'NEXT', 'OXY', 'PYX', 'QUIZ', 'RAJ', 'SIX', 'TYX', 'VAJRA'
    ],
    
    medium: [
      'JAZZILY', 'QUICKLY', 'ZYMURGY', 'XYLOPHONE', 'JUKEBOX', 'BAZOOKA', 'FUZZILY', 'PYGMYISH', 'QUARTZY', 'JINXING',
      'VEXEDLY', 'WAXWORK', 'JAZZMAN', 'PYJAMAS', 'QUIXOTIC', 'ZIGZAG', 'JOCKEY', 'KAYAKER', 'LYNXES', 'MYTHIC',
      
      'PROGRAM', 'NETWORK', 'SYSTEM', 'DIGITAL', 'ANALOG', 'COMPUTER', 'SOFTWARE', 'HARDWARE', 'DATABASE', 'PROJECT',
      'RESEARCH', 'ANALYSIS', 'TEACHING', 'LEARNING', 'TRAINING', 'PRACTICE', 'EXERCISE', 'HOMEWORK', 'STUDENT', 'TEACHER',
      
      'SCIENCE', 'TECHNOLOGY', 'ENGINEER', 'MANAGER', 'LEADER', 'DIRECTOR', 'OFFICER', 'ASSISTANT', 'ADVISOR', 'CONSULTANT',
      'SPECIALIST', 'PROBLEM', 'SOLUTION', 'QUESTION', 'ANSWER', 'RESULT', 'SUCCESS', 'FAILURE', 'WEATHER', 'CLIMATE',
      
      'FORECAST', 'QUANTIZE', 'MAXIMIZE', 'JUXTAPOSE', 'ZYGOTENE', 'QUADRANT', 'JACKPOT', 'VEXATION', 'WAXINESS', 'JAZZLIKE',
      'PYROLYZE', 'QUIZZING', 'ZYMOGENE', 'JOCULAR', 'KYANIZE', 'LYRICIZE', 'MYTHIZE', 'NYMPHLY', 'OXYTOCIN', 'PYROXYLE',
      
      'QUAGMIRE', 'RHIZOME', 'SYZYGIAL', 'TAXONOMY', 'UNZIPPED', 'VEXILLUM', 'WHIZZING', 'XYLOIDIN', 'YEASTILY', 'ZABAIONE',
      'ABLAZE', 'BEJEWEL', 'CINQUE', 'DIAZOLE', 'EQUABLE', 'FJORD', 'GAZETTE', 'HAZARD', 'IZARD', 'JAZZBO'
    ],
    
    hard: [
      'QUIZZICALLY', 'JUXTAPOSING', 'ZYGOMORPHIC', 'XYLOGRAPHIC', 'JAZZIFICATION', 'PYCNOGONOID', 'QUIXOTICALLY', 'ZOOGRAPHICAL', 'JACKKNIFING', 'KALEIDOSCOPE',
      'LYMPHOCYTE', 'MYTHOLOGIZE', 'NYCTOPHOBIA', 'OXYGENATING', 'PYROLYZABLE', 'QUADRAPHONY', 'RHIZOPHOROUS', 'SYZYGIOLOGY', 'TAXIDERMIST', 'UNJUSTIFIED',
      
      'COMMUNICATION', 'INFORMATION', 'TECHNOLOGY', 'ENGINEERING', 'DEVELOPMENT', 'MANAGEMENT', 'ORGANIZATION', 'ADMINISTRATION', 'INVESTIGATION', 'EXPERIMENTAL',
      'LABORATORY', 'SCIENTIFIC', 'MATHEMATICS', 'ARCHITECTURE', 'CONSTRUCTION', 'INFRASTRUCTURE', 'TRANSPORTATION', 'NAVIGATION', 'EXPLORATION', 'DISCOVERY',
      
      'INVENTION', 'INNOVATION', 'ENVIRONMENTAL', 'SUSTAINABILITY', 'CONSERVATION', 'PRESERVATION', 'PROTECTION', 'REGULATION', 'LEGISLATION', 'GOVERNMENT',
      'INTERNATIONAL', 'MULTINATIONAL', 'TRANSNATIONAL', 'GLOBALIZATION', 'COLLABORATION', 'COOPERATION', 'PARTNERSHIP', 'PROFESSIONAL', 'SPECIALIZATION', 'QUALIFICATION',
      
      'CERTIFICATION', 'ACCREDITATION', 'VALIDATION', 'VERIFICATION', 'AUTHENTICATION', 'IDENTIFICATION', 'RECOGNITION', 'ENTREPRENEUR', 'BUSINESSMAN', 'INVESTMENT',
      'FINANCIAL', 'ECONOMICS', 'MANUFACTURE', 'DISTRIBUTION', 'EDUCATIONAL', 'INSTRUCTIONAL', 'PEDAGOGICAL', 'CURRICULUM', 'COMPUTATIONAL', 'ALGORITHMIC',
      
      'PROGRAMMING', 'IMPLEMENTATION', 'APPLICATION', 'UTILIZATION', 'OPTIMIZATION', 'MAXIMIZATION', 'EFFICIENCY', 'INFORMATIVE', 'FASCINATING', 'INTERESTING',
      'CAPTIVATING', 'ENGAGING', 'STIMULATING', 'INSPIRING', 'QUADRILLION', 'ZYGOPHYLLUM', 'JUXTAPOSURE', 'KATZENJAMMER', 'LYMPHOGRAPHY', 'MYTHOPOEIC',
      'NYCTALOPIA', 'OXYHEMOGLOBIN', 'PYCNOMETER', 'QUADRIVIUM', 'RHIZOCARPOUS', 'SYNCHRONIZING', 'TAXONOMICAL', 'UNJUSTIFIABLE', 'VEXATIOUSLY', 'WHIZZBANG'
    ]
  };

  const morseToLetterMap: { [key: string]: string } = Object.entries(morseAlphabet).reduce((acc, [letter, morse]) => {
    acc[morse] = letter;
    return acc;
  }, {} as { [key: string]: string });

  const wordToMorse = (word: string): string => {
    return word.split('').map(letter => morseAlphabet[letter] || '').join(' ');
  };

  const morseToWord = (morse: string): string => {
    return morse.split(' ').map(morseChar => morseToLetterMap[morseChar] || '').join('');
  };

  const getRandomWord = useCallback(() => {
    const words = wordLists[difficulty];
    let newWord;
    
    do {
      newWord = words[Math.floor(Math.random() * words.length)];
    } while (words.length > 1 && newWord === previousWord.current);
    
    previousWord.current = newWord;
    return newWord;
  }, [difficulty]);

  const getRandomMorseWord = useCallback(() => {
    const words = wordLists[difficulty];
    let newWord;
    
    do {
      newWord = words[Math.floor(Math.random() * words.length)];
    } while (words.length > 1 && newWord === previousWord.current);
    
    previousWord.current = newWord;
    return wordToMorse(newWord);
  }, [difficulty]);

  const generateNewExercise = useCallback(() => {
    if (trainingMode === 'wordToMorse') {
      const newWord = getRandomWord();
      setCurrentWord(newWord);
      setCurrentMorse('');
    } else {
      const newMorse = getRandomMorseWord();
      setCurrentMorse(newMorse);
      setCurrentWord('');
    }
    setUserInput('');
    setUserWordInput('');
    setFeedback(null);
    setIsWaitingForSubmit(true);
    setActiveButton(null);
  }, [trainingMode, difficulty, getRandomWord, getRandomMorseWord]);

  const checkAnswer = () => {
    if (!isWaitingForSubmit) return;

    if (trainingMode === 'wordToMorse') {
      const correctMorse = wordToMorse(currentWord);
      const normalizedUserInput = userInput.trim();
      const normalizedCorrectMorse = correctMorse.trim();
      
      const isCorrect = normalizedUserInput === normalizedCorrectMorse;
      
      setFeedback({
        message: isCorrect 
          ? 'Correct!' 
          : `Incorrect. The correct Morse for "${currentWord}" is: ${correctMorse}`,
        isCorrect
      });
      setScore(prev => ({
        ...prev,
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect
      }));
    } else {
      const correctWord = morseToWord(currentMorse);
      const normalizedUserInput = userWordInput.trim().toUpperCase();
      
      const isCorrect = normalizedUserInput === correctWord;
      
      setFeedback({
        message: isCorrect 
          ? 'Correct!' 
          : `Incorrect. The correct word for "${currentMorse}" is: ${correctWord}`,
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

  const skipWord = () => {
    if (!isWaitingForSubmit) return;
    
    if (trainingMode === 'wordToMorse') {
      const correctMorse = wordToMorse(currentWord);
      setFeedback({
        message: `Skipped. The correct Morse for "${currentWord}" is: ${correctMorse}`,
        isCorrect: false
      });
    } else {
      const correctWord = morseToWord(currentMorse);
      setFeedback({
        message: `Skipped. The correct word for "${currentMorse}" is: ${correctWord}`,
        isCorrect: false
      });
    }
    
    setScore(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1
    }));
    setIsWaitingForSubmit(false);
  };

  const handleNextWord = () => {
    generateNewExercise();
  };

  const addDot = () => {
    if (trainingMode === 'wordToMorse' && isWaitingForSubmit && !feedback) {
      setUserInput(prev => prev + '.');
      setActiveButton('dot');
      setTimeout(() => setActiveButton(null), 150);
    }
  };

  const addDash = () => {
    if (trainingMode === 'wordToMorse' && isWaitingForSubmit && !feedback) {
      setUserInput(prev => prev + '-');
      setActiveButton('dash');
      setTimeout(() => setActiveButton(null), 150);
    }
  };

  const addSpace = () => {
    if (trainingMode === 'wordToMorse' && isWaitingForSubmit && !feedback) {
      setUserInput(prev => prev + ' ');
      setActiveButton('space');
      setTimeout(() => setActiveButton(null), 150);
    }
  };

  const handleDelete = () => {
    if (trainingMode === 'wordToMorse' && isWaitingForSubmit && !feedback && userInput) {
      setUserInput(prev => prev.slice(0, -1));
      setActiveButton('delete');
      setTimeout(() => setActiveButton(null), 150);
    }
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (feedback) {
      if (event.key === 'Enter') {
        handleNextWord();
      }
      return;
    }

    if (!isWaitingForSubmit) return;

    if (trainingMode === 'wordToMorse') {
      if (event.key === 'j' || event.key === 'J') {
        addDot();
      } else if (event.key === 'k' || event.key === 'K') {
        addDash();
      } else if (event.key === ' ') {
        addSpace();
      } else if (event.key === 'Enter') {
        checkAnswer();
      } else if (event.key === 'Backspace') {
        handleDelete();
      }
    } else {
      if (event.key === 'Enter') {
        checkAnswer();
      } else if (event.key === 'Backspace') {
        setUserWordInput(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        setUserWordInput(prev => prev + event.key.toUpperCase());
      }
    }
  }, [isWaitingForSubmit, feedback, trainingMode, checkAnswer, handleNextWord, userInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    previousWord.current = '';
    generateNewExercise();
  }, [trainingMode, difficulty]);

  return (
    <div className={styles.wordTrainingContainer}>
      <div className={styles.fontBackground}></div>
      <button
        className={styles.backButton}
        onClick={() => navigate('/explore')}
      >
        ← Back to Explore
      </button>
      <div className={styles.trainingHeader}>
        <h1 className={styles.trainingTitle}>Word Training</h1>
        <p className={styles.trainingDescription}>
          Translate entire words with difficulty levels (easy, medium, hard). Choose between text to Morse or Morse to text.
        </p>
        <div className={styles.instructions}>
          {trainingMode === 'wordToMorse' 
            ? 'Use J for dot (•), K for dash (–), Space for space, Enter to submit'
            : 'Type the word (A-Z), Enter to submit'
          }
        </div>
      </div>

      <div className={styles.difficultySelector}>
        <button
          className={`${styles.difficultyButton} ${difficulty === 'easy' ? styles.active : ''}`}
          onClick={() => setDifficulty('easy')}
        >
          Easy
        </button>
        <button
          className={`${styles.difficultyButton} ${difficulty === 'medium' ? styles.active : ''}`}
          onClick={() => setDifficulty('medium')}
        >
          Medium
        </button>
        <button
          className={`${styles.difficultyButton} ${difficulty === 'hard' ? styles.active : ''}`}
          onClick={() => setDifficulty('hard')}
        >
          Hard
        </button>
      </div>

      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeButton} ${trainingMode === 'wordToMorse' ? styles.active : ''}`}
          onClick={() => setTrainingMode('wordToMorse')}
        >
          Word → Morse
        </button>
        <button
          className={`${styles.modeButton} ${trainingMode === 'morseToWord' ? styles.active : ''}`}
          onClick={() => setTrainingMode('morseToWord')}
        >
          Morse → Word
        </button>
      </div>

      <div className={styles.practiceArea}>
        {trainingMode === 'wordToMorse' ? (
          <>
            <div className={styles.promptSection}>
              <div className={styles.promptLabel}>Translate this word:</div>
              <div className={styles.wordDisplay}>{currentWord}</div>
            </div>

            <div className={styles.inputSection}>
              <div className={styles.inputLabel}>Your Morse input:</div>
              <div className={styles.morseDisplay}>
                {userInput || <span className={styles.placeholder}></span>}
              </div>
              <div className={styles.inputButtonCont}>
                <button
                  className={`${styles.inputButton} ${activeButton === 'dot' ? styles.active : ''}`}
                  onClick={addDot}
                >
                  •
                </button>
                <button
                  className={`${styles.inputButton} ${activeButton === 'dash' ? styles.active : ''}`}
                  onClick={addDash}
                >
                  –
                </button>
                <button
                  className={`${styles.inputButton} ${activeButton === 'space' ? styles.active : ''}`}
                  onClick={addSpace}
                >
                  Space
                </button>
                <button
                  className={`${styles.deleteButton} ${activeButton === 'delete' ? styles.active : ''}`}
                  onClick={handleDelete}
                  disabled={!userInput}
                >
                  ⌫
                </button>
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
              <div className={styles.inputLabel}>Your answer (word):</div>
              <div className={styles.wordInputDisplay}>
                {userWordInput || <span className={styles.placeholder}></span>}
              </div>
              <div className={styles.inputHint}>
                Type the word (A-Z)
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
                disabled={trainingMode === 'wordToMorse' ? !userInput : !userWordInput}
              >
                Submit (Enter)
              </button>
              <button 
                className={styles.skipButton} 
                onClick={skipWord}
              >
                Skip
              </button>
            </>
          ) : (
            <button 
              className={styles.nextButton} 
              onClick={handleNextWord}
            >
              Next (Enter)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordTraining;