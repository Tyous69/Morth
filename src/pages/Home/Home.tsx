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
      </div>
    </div>
  );
};

export default Home;