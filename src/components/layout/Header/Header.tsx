import styles from './Header.module.scss';

const Header = () => {
  const handleLogoClick = () => {
    console.log("Logo clicked - redirecting to homepage"); // change with redirection
    // router
  };

  return (
    <header className={styles.header}>
      <img 
        className={styles.logo}
        src="/assets/MorthLogo.png" 
        alt="Morth"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
    </header>
  );
};

export default Header;