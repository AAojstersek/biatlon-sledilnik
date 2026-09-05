import { NavLink } from 'react-router-dom';
import styles from './TabBar.module.css';

const TABS = [
  { to: '/competitions', label: 'Tekma', icon: '🎯' },
  { to: '/settings', label: 'Nastavitve', icon: '⚙️' },
  { to: '/analysis', label: 'Analiza', icon: '📊' },
];

export function TabBar() {
  return (
    <nav className={styles.bar}>
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
