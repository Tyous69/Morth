import styles from './Header.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();

  const [isWhiteMode, setIsWhiteMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    setIsWhiteMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsWhiteMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const logoSrc = isWhiteMode 
    ? "/assets/MorthLogo.png"
    : "/assets/MorthLogo_White.png";

  const headerClass = `${styles.header} ${isWhiteMode ? styles.light : ''}`;

  return (
    <header className={headerClass}>
      <img 
        className={styles.logo}
        src={logoSrc}
        alt="Morth"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      />
    </header>
  );
};

export default Header;