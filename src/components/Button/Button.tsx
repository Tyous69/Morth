import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'active' | 'danger' | 'icon';
  size?: 'small' | 'medium' | 'large';
  className?: string; // Pour permettre le positionnement depuis le parent
}

export const Button = ({ 
  children, 
  variant = 'primary',
  size,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${size ? styles[size] : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;