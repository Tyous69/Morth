import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.specialFontBackground}></div>
      <div className={styles.title}>
        Morth
      <div className={styles.info}>
        Number 1 (self-proclaimed) Morse Code Training Website
      </div>
        <div className={styles.mothContainer}>
          <img className={styles.moth}
          src="/assets/Moth_White.png" 
          alt="Morth"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;