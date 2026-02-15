import { useEffect, useRef, useState } from 'react';
import styles from './LearnMore.module.scss';

const LearnMore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.learnMoreContainer} id="learn-more" ref={containerRef}>
      <div className={styles.neonContainer}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.logoSection}>
            <img 
              className={styles.logo}
              src="/assets/MorthLogo2.png" 
              alt="Morth"
            />
          </div>
          <div className={styles.textContent}>
            <h1 className={styles.title}>About Morth</h1>
            
            <p className={styles.description}>
              <span className={styles.coloredText}>Morth</span> (a blend of "Morse" and "Moth") is a Morse code training platform built with <span className={styles.coloredText}>Typescript</span>. 
              I created this website because I was bored and couldn't find good resources to practice my 
              beginner-level Morse code skills.
            </p>
            <br></br>
            <p className={styles.description}>
              As a computer science student passionate about web development, I wanted to build something 
              useful while improving my skills. This is my <span className={styles.coloredText}>first</span> complete website project.
            </p>

            <h2 className={styles.subtitle}>Training Modes</h2>
            
            <div className={styles.featureList}>
              <div className={styles.feature}>
                <h3>Alphabet Training</h3>
                <p>Practice individual letters - translate letters to Morse code or Morse code to letters. 
                Use <span className={styles.coloredText}>J</span> key for dots and <span className={styles.coloredText}>K</span> key for dashes.</p>
              </div>
              <br></br>
              <div className={styles.feature}>
                <h3>Word Training</h3>
                <p>Translate entire words with difficulty levels (<span className={styles.coloredText}>easy, medium, hard</span>). 
                Choose between text to Morse or Morse to text.</p>
              </div>
              <br></br>
              <div className={styles.feature}>
                <h3>Sound Training</h3>
                <p>Listen to Morse code <span className={styles.coloredText}>audio</span> and identify letters or words. 
                Perfect for developing your listening skills.</p>
              </div>
            </div>

            <h2 className={styles.subtitle}>Future Plans</h2>
            <p className={styles.description}>
              I'm considering adding a <span className={styles.coloredText}>learning</span> section where you can interactively learn Morse code 
              from scratch. But first, I want to make sure the training platform works well and is helpful.
            </p>
            <br></br>
            <p className={styles.description}>
              This project started from boredom but became a passion project. 
              I hope it helps others who want to <span className={styles.coloredText}>train</span> Morse code as much as it helped me <span className={styles.coloredText}>train</span> web development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;