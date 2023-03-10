import styles from './styles.module.css';
import { useToastPortal, useToastAutoClose } from 'hooks';
import * as ReactDOM from 'react-dom';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Toast } from 'components';
import { uuid } from 'shared/helpers';

export const ToastPortal = forwardRef(
  ({ autoClose, autoCloseTime = 5000 }, ref) => {
    const [toasts, setToasts] = useState([]);
    const { loaded, portalId } = useToastPortal();

    useToastAutoClose({
      toasts,
      setToasts,
      autoClose,
      autoCloseTime,
    });

    const removeToast = id => {
      setToasts(toasts.filter(t => t.id !== id));
    };

    useImperativeHandle(ref, () => ({
      addMessage(toast) {
        setToasts([...toasts, { ...toast, id: uuid() }]);
      },
    }));

    return loaded ? (
      ReactDOM.createPortal(
        <div className={styles.toastContainer}>
          {toasts.map(t => (
            <Toast
              key={t.id}
              onClose={() => removeToast(t.id)}
              mode={t.mode}
              message={t.message}
            />
          ))}
        </div>,
        document.getElementById(portalId),
      )
    ) : (
      <></>
    );
  },
);
