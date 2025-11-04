import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  size?: string;
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${size ? styles[size] : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;