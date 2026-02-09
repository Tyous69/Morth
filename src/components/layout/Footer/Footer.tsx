import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <img className={styles.logo}
          src="/assets/MorthLogo_White.png" 
          alt="Morth"
      />
      |
      2026 Morth
      |
      · ·−·· ·−−· ··· −·−− −·− −−− −· −−· ·−· −−− −−−
    </div>
  );
};

export default Footer;