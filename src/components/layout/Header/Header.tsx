import styles from './Header.module.scss';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <img 
        className={styles.logo}
        src="/assets/MorthLogo.png" 
        alt="Morth"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      />
    </header>
  );
};

export default Header;