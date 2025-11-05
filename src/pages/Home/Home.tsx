import styles from './Home.module.scss';
import { Button } from '../../components/Button/Button';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.fontBackground}></div>
        <div className={styles.welcome}>
          Welcome To
        </div>
        <div className={styles.title}>
          Morth
        </div>
        <div className={styles.info}>
          The Number <span className={styles.numerouno}>1</span> (self-proclaimed) Morse Code Training Platform
        </div>
        <div className={styles.buttons}>
          <Button 
          variant="primary" 
          size="small" 
          onClick={() => console.log('redirection explore')}
          >
          Explore →
          </Button>

          <Button 
          variant="secondary" 
          size="small" 
          onClick={() => console.log('redirection learn more')}
          >
          Learn More
          </Button>
        </div>
      </div>
  );
};

export default Home;