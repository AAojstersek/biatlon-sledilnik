import { format, parseISO } from 'date-fns';

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'd. M. yyyy');
  } catch {
    return iso;
  }
}

export function formatDateShort(iso: string): string {
  try {
    return format(parseISO(iso), 'd.M.');
  } catch {
    return iso;
  }
}

export function formatPct(pct: number): string {
  return `${pct.toFixed(0)}%`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
