import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SoundTraining.module.scss';
import { Button } from '../../components/Button/Button';

// Sound configuration constants
const FREQUENCY = 600; // 600Hz tone
const BASE_VOLUME = 0.1; // The reference "100%" volume

const SoundTraining = () => {
  const [trainingMode, setTrainingMode] = useState<'letters' | 'words'>('letters');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [volume, setVolume] = useState<number>(100); // 0 to 200
  
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isWaitingForSubmit, setIsWaitingForSubmit] = useState(true);
  
  const navigate = useNavigate();
  const previousTarget = useRef<string>('');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const ignoreEnterRef = useRef(false);
  const hasPlayedSoundRef = useRef(false);

  const morseAlphabet: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
    'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..'
  };

  const wordLists = {
    easy: [
      'HELLO', 'WORLD', 'QUICK', 'BOXES', 'WHY', 'BYE', 'JACK', 'LAZY', 'QUIZ', 'ZEBRA',
      'TREE', 'HOUSE', 'APPLE', 'WATER', 'MONEY', 'MUSIC', 'CLOCK', 'BEACH', 'NIGHT', 'SMILE',
      'HAPPY', 'OCEAN', 'PEACE', 'QUEEN', 'RIVER', 'TIGER', 'YACHT', 'ZOO', 'BUZZ', 'FOX'
    ],
    medium: [
      'STANDARD', 'QUICKLY', 'JUKEBOX', 'BAZOOKA', 'JIGSAW', 'VEXED', 'WIZARD', 'JOCKEY', 'KAYAK', 'MYTHIC',
      'PROGRAM', 'SYSTEM', 'DIGITAL', 'ANALOG', 'PROJECT', 'STUDENT', 'TEACHER', 'WEATHER', 'FORECAST', 'CLIMATE',
      'PROBLEM', 'SOLUTION', 'ANSWER', 'SUCCESS', 'FAILURE', 'JACKPOT', 'GAZETTE', 'HAZARD', 'EQUABLE', 'DEFAULT'
    ],
    hard: [
      'QUIZZICALLY', 'JUXTAPOSING', 'KALEIDOSCOPE', 'COMMUNICATION', 'TECHNOLOGY', 'ENGINEERING', 'DEVELOPMENT', 
      'ADMINISTRATION', 'INVESTIGATION', 'EXPERIMENTAL', 'LABORATORY', 'SCIENTIFIC', 'INFRASTRUCTURE', 'TRANSPORTATION', 
      'EXPLORATION', 'ENVIRONMENTAL', 'SUSTAINABILITY', 'GLOBALIZATION', 'COLLABORATION', 'PARTNERSHIP'
    ]
  };

  const getWPM = () => {
    switch(speed) {
      case 'slow': return 10;
      case 'normal': return 15;
      case 'fast': return 20;
    }
  };

  // --- Audio Engine ---
  const playMorseSound = useCallback((text: string) => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    setIsPlaying(false);

    if (!text) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    setIsPlaying(true);

    const wpm = getWPM();
    const dotDuration = 1.2 / wpm; 
    const attackTime = 0.005; 
    
    const effectiveVolume = BASE_VOLUME * (volume / 100);

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = FREQUENCY;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();

    let currentTime = ctx.currentTime + 0.1;

    text.toUpperCase().split('').forEach((char) => {
      const morse = morseAlphabet[char];
      if (morse) {
        morse.split('').forEach((symbol) => {
          const duration = symbol === '.' ? dotDuration : dotDuration * 3;

          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(effectiveVolume, currentTime + attackTime);
          gainNode.gain.setValueAtTime(effectiveVolume, currentTime + duration - attackTime);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

          currentTime += duration;
          currentTime += dotDuration; 
        });
        currentTime += dotDuration * 2; 
      } else if (char === ' ') {
        currentTime += dotDuration * 4; 
      }
    });

    const totalTime = (currentTime - ctx.currentTime) * 1000;
    const timeoutId = window.setTimeout(() => {
      setIsPlaying(false);
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    }, totalTime + 100);
    
    timeoutsRef.current.push(timeoutId);

  }, [speed, volume]); 

  // --- Game Logic ---

  const getRandomTarget = useCallback(() => {
    let newTarget;
    
    if (trainingMode === 'words') {
      const words = wordLists[difficulty];
      do {
        newTarget = words[Math.floor(Math.random() * words.length)];
      } while (words.length > 1 && newTarget === previousTarget.current);
    } else {
      const letters = Object.keys(morseAlphabet);
      do {
        newTarget = letters[Math.floor(Math.random() * letters.length)];
      } while (letters.length > 1 && newTarget === previousTarget.current);
    }
    
    previousTarget.current = newTarget;
    return newTarget;
  }, [difficulty, trainingMode]);

  const generateNewExercise = useCallback(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      setIsPlaying(false);
    }
    timeoutsRef.current.forEach(t => clearTimeout(t));

    const newTarget = getRandomTarget();
    setCurrentTarget(newTarget.trim());
    
    setUserInput('');
    setFeedback(null);
    setIsWaitingForSubmit(true);
    
    hasPlayedSoundRef.current = false;

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

  }, [getRandomTarget]); 

  useEffect(() => {
    if (currentTarget && isWaitingForSubmit && !hasPlayedSoundRef.current) {
      hasPlayedSoundRef.current = true;
      const timer = setTimeout(() => {
        playMorseSound(currentTarget);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [currentTarget, isWaitingForSubmit, playMorseSound]);

  const checkAnswer = () => {
    if (!isWaitingForSubmit) return;
    if (!userInput.trim()) return; 
    if (!currentTarget) return;

    ignoreEnterRef.current = true;
    setTimeout(() => { ignoreEnterRef.current = false; }, 500);

    const normalizedInput = userInput.trim().toUpperCase();
    const target = currentTarget.trim().toUpperCase();
    
    const isCorrect = normalizedInput === target;
    
    setFeedback({
      message: isCorrect 
        ? 'Correct!' 
        : `Incorrect. The answer was: ${currentTarget}`,
      isCorrect
    });
    setScore(prev => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect
    }));
    setIsWaitingForSubmit(false);
  };

  const skipTarget = () => {
    if (!isWaitingForSubmit) return;
    
    setFeedback({
      message: `Skipped. The answer was: ${currentTarget}`,
      isCorrect: false
    });
    setScore(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1
    }));
    setIsWaitingForSubmit(false);
  };

  const handleNext = () => {
    generateNewExercise();
  };

  const handleGlobalKeyPress = useCallback((event: KeyboardEvent) => {
    if (feedback) {
      if (event.key === 'Enter' && !ignoreEnterRef.current) {
        handleNext();
      }
      return;
    }
  }, [feedback, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [handleGlobalKeyPress]);

  useEffect(() => {
    previousTarget.current = '';
    generateNewExercise();
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
        if (audioCtxRef.current) audioCtxRef.current.close();
        timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, [difficulty, trainingMode]);

  const sliderBackgroundStyle = {
    background: `linear-gradient(to right, #018682 ${(volume / 200) * 100}%, #333 ${(volume / 200) * 100}%)`
  };

  return (
    <div className={styles.soundTrainingContainer}>
      <div className={styles.fontBackground}></div>
      
      <Button
        className={styles.backButton}
        onClick={() => navigate('/explore')}
        variant="primary"
      >
        ← Back to Explore
      </Button>

      <div className={styles.trainingHeader}>
        <h1 className={styles.trainingTitle}>Sound Training</h1>
        <p className={styles.trainingDescription}>
          Listen to the Morse code audio and identify the {trainingMode}.
        </p>
        <div className={styles.instructions}>
          Type the {trainingMode.slice(0, -1)} you hear (A-Z), Enter to submit
        </div>
      </div>

      <div className={styles.selectorsContainer}>

        {trainingMode === 'words' && (
          <div className={styles.buttonGroup}>
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <Button
                key={level}
                className={styles.selectorButton}
                variant={difficulty === level ? 'active' : 'primary'}
                onClick={() => setDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        )}

        <div className={styles.buttonGroup}>
          {(['slow', 'normal', 'fast'] as const).map((s) => (
            <Button
              key={s}
              className={styles.speedButton}
              variant={speed === s ? 'active' : 'primary'}
              onClick={() => setSpeed(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <Button
            className={styles.selectorButton}
            variant={trainingMode === 'letters' ? 'active' : 'primary'}
            onClick={() => setTrainingMode('letters')}
          >
            Letters
          </Button>
          <Button
            className={styles.selectorButton}
            variant={trainingMode === 'words' ? 'active' : 'primary'}
            onClick={() => setTrainingMode('words')}
          >
            Words
          </Button>
        </div>
      </div>

      <div className={styles.practiceArea}>
        <div className={styles.promptSection}>
          <div className={styles.promptLabel}>
            {isPlaying ? 'Listening...' : 'Click to Listen'}
          </div>
          
          <div className={styles.soundControlsContainer}>
            <button 
                className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
                onClick={() => playMorseSound(currentTarget)}
                disabled={isPlaying}
                title="Play Morse Code"
            >
                <svg viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
            </button>

            <div className={styles.volumeWrapper}>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className={styles.volumeSlider}
                style={sliderBackgroundStyle}
                title={`Volume: ${volume}%`}
              />
            </div>
          </div>
        </div>

        <div className={styles.inputSection}>
          <div className={styles.inputLabel}>Your Answer:</div>
          <div className={styles.wordInputDisplay}>
            <input
              ref={inputRef}
              type="text"
              className={styles.nativeInput}
              value={userInput}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                if (trainingMode === 'letters') {
                  if (val.length <= 1 && /^[A-Z]*$/.test(val)) setUserInput(val);
                } else {
                  if (/^[A-Z]*$/.test(val)) setUserInput(val);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  checkAnswer();
                }
              }}
              disabled={!isWaitingForSubmit}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              autoFocus
            />
          </div>
          <div className={styles.inputHint}>
            Type on your keyboard
          </div>
        </div>

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
              <Button 
                className={styles.submitButton} 
                onClick={checkAnswer}
                disabled={!userInput}
              >
                Submit (Enter)
              </Button>
              <Button 
                variant="danger"
                className={styles.skipButton} 
                onClick={skipTarget}
              >
                Skip
              </Button>
            </>
          ) : (
            <Button 
              variant="active"
              className={styles.nextButton} 
              onClick={handleNext}
            >
              Next (Enter)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoundTraining;