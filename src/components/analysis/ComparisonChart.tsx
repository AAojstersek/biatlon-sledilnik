import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ComparisonRow } from '../../utils/stats';
import { EmptyState } from '../common/EmptyState';
import { IconUsers } from '../common/Icon';

interface ComparisonChartProps {
  rows: ComparisonRow[];
  highlightId?: string;
}

export function ComparisonChart({ rows, highlightId }: ComparisonChartProps) {
  if (rows.length === 0) {
    return <EmptyState icon={<IconUsers size={30} />} title="Ni podatkov za primerjavo" />;
  }

  const data = rows
    .map((r) => ({ name: r.name, pct: Math.round(r.stats.pct), id: r.competitorId }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
        <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
        <Tooltip
          contentStyle={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.id}
              fill={entry.id === highlightId ? 'var(--color-accent)' : 'var(--color-empty)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
