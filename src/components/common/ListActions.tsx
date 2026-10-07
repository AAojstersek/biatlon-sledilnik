import { useEffect, useState, type ButtonHTMLAttributes } from 'react';
import styles from './ListActions.module.css';

/** GO-style "add" link: link-blue text after a green round plus. */
export function AddButton({ className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`${styles.add} ${className}`} {...rest} />;
}

interface DeleteButtonProps {
  label: string;
  onDelete: () => void;
  /** Ask for a second tap on a red "Izbriši" pill before deleting (for saved data). */
  confirm?: boolean;
}

/** GO-style delete: red round minus; with `confirm`, the first tap arms it. */
export function DeleteButton({ label, onDelete, confirm = false }: DeleteButtonProps) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <button
      type="button"
      className={`${styles.del} ${armed ? styles.armed : ''}`}
      aria-label={armed ? `Potrdi: ${label}` : label}
      onClick={() => {
        if (confirm && !armed) setArmed(true);
        else onDelete();
      }}
    >
      {armed ? 'Izbriši' : <span />}
    </button>
  );
}
