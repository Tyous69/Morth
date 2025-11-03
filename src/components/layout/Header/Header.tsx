import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <img className={styles.logo}
          src="/assets/MorthLogo.png" 
          alt="Morth"
      />
    </header>
  );
};

export default Header;