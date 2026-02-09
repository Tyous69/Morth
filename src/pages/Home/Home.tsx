import styles from './Home.module.scss';
import { Button } from '../../components/Button/Button';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExplore = () => {
    window.scrollTo(0, 0);
    navigate('/explore');
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.fontBackground}></div>
      
      <div className={styles.welcome}>Welcome To</div>
      <div className={styles.title}>Morth</div>
      
      <div className={styles.info}>
        The Number <span className={styles.numerouno}>1</span> (self-proclaimed) Morse Code Training Platform
      </div>
      
      <div className={styles.buttons}>
        <Button 
          variant="active" 
          size="large" 
          onClick={handleExplore}
        >
          Explore →
        </Button>

        <HashLink to="#learn-more" smooth>
          <Button 
            variant="primary" 
            size="large"
          >
            Learn More
          </Button>
        </HashLink>
      </div>
    </div>
  );
};

export default Home;