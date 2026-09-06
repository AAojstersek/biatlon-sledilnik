import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendPoint } from '../../utils/stats';
import { formatDateShort } from '../../utils/format';
import { EmptyState } from '../common/EmptyState';
import { IconTrendUp } from '../common/Icon';

interface TrendChartProps {
  points: TrendPoint[];
}

export function TrendChart({ points }: TrendChartProps) {
  if (points.length === 0) {
    return <EmptyState icon={<IconTrendUp size={30} />} title="Še ni podatkov za graf trenda" />;
  }

  const data = points.map((p) => ({
    date: formatDateShort(p.date),
    Skupaj: Math.round(p.overall.pct),
    Leže: Math.round(p.L.pct),
    Stoje: Math.round(p.S.pct),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
        <Tooltip
          contentStyle={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="Skupaj" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Leže" stroke="var(--color-success)" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="Stoje" stroke="var(--color-danger)" strokeWidth={2} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
