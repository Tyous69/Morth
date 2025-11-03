import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.specialFontBackground}></div>
      <div className={styles.mainContent}>
        MORTH
      </div>
    </div>
  );
};

export default Home;