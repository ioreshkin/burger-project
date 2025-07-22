import styles from './modal-overlay.module.css';
import React from 'react';

interface MyComponentProps {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
}

const ModalOverlay = ({ onClick, children }: MyComponentProps) => {
  return (
    <div className={styles.container} onClick={onClick} id="modal-overlay">
      {children}
    </div>
  );
};

export default ModalOverlay;
