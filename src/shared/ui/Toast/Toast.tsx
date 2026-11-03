import { IconButton } from '../IconButton';

import Idea from '../../assets/icons/idea.svg?react'
import Cross from '../../assets/icons/cross.svg?react'

import styles from './Toast.module.css';

export interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
  return (
    <div className={styles.toast}>
      <Idea className={styles.toastIcon}/>
      <span>{message}</span>
      <span className={styles.closeBtn}>
        <IconButton
          ariaLabel="Закрыть"
          onClick={onClose}
          icon={<Cross className={styles.toastIcon}/>}
        />
      </span>
    </div>
  );
};
