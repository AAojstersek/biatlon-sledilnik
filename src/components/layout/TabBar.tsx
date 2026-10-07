import { NavLink } from 'react-router-dom';
import { IconChartBar, IconGear, IconTarget, IconTrophy } from '../common/Icon';
import styles from './TabBar.module.css';

const TABS = [
  { to: '/competitions', label: 'Tekma', Icon: IconTarget },
  { to: '/settings', label: 'Nastavitve', Icon: IconGear },
  { to: '/analysis', label: 'Analiza', Icon: IconChartBar },
  { to: '/standings', label: 'Lestvica', Icon: IconTrophy },
];

export function TabBar() {
  return (
    <nav className={styles.bar}>
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
        >
          <Icon size={25} strokeWidth={1.7} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
