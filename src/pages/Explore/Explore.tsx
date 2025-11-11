import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Explore.module.scss';

const Explore = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const navigate = useNavigate();

  const trainingModes = [
    {
      id: 1,
      title: "Alphabet Training",
      description: "Practice individual letters - translate letters to Morse code or Morse code to letters.",
      topContent: "A B C",
      bottomContent: "·− −··· −·−·",
      path: "/alphabet-training"
    },
    {
      id: 2,
      title: "Word Training",
      description: "Translate entire words with difficulty levels (easy, medium, hard). Choose between text to Morse or Morse to text.",
      topContent: "Hello",
      bottomContent: "···· · ·−·· ·−·· −−−",
      path: "/word-training"
    },
    {
      id: 3,
      title: "Sound Training",
      description: "Listen to Morse code audio and identify letters or words. Perfect for developing your listening skills.",
      topContent: <img src="/assets/SpeakerIcon.png" alt="Speaker" className={styles.speakerIcon} />,
      bottomContent: "",
      path: "/sound-training"
    }
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.fontBackground}></div>
      
      <div className={styles.exploreTitle}>
        Explore Training Modes
      </div>

      <div className={styles.exploreText}>
        Explore the <span className={styles.coloredText}>3</span> Different Training Modes: <span className={styles.coloredText}>Alphabet</span> Training, <span className={styles.coloredText}>Word</span> Training, and <span className={styles.coloredText}>Sound</span> Training
      </div>
      
      <div className={styles.cardsContainer}>
        {trainingModes.map((mode) => (
          <div
            key={mode.id}
            className={`${styles.cardWrapper} ${activeCard === mode.id ? styles.active : ''}`}
            onMouseEnter={() => setActiveCard(mode.id)}
            onMouseLeave={() => setActiveCard(null)}
            onClick={() => handleCardClick(mode.path)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.neonCard}>
              <div className={styles.cardMainContent}>
                {mode.id === 3 ? (
                  <div className={styles.speakerIcon}>{mode.topContent}</div>
                ) : (
                  <>
                    <div className={styles.cardTop}>{mode.topContent}</div>
                    {mode.bottomContent && (
                      <div className={styles.cardBottom}>{mode.bottomContent}</div>
                    )}
                  </>
                )}
              </div>
              
              <div className={styles.cardHoverContent}>
                <div className={styles.hoverTitle}>{mode.title}</div>
                <div className={styles.hoverDescription}>{mode.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;