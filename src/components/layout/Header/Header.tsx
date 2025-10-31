import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <img className={styles.logo}
          src="/assets/MorthLogo2.png" 
          alt="Morth"
      />
    </header>
  );
};

export default Header;