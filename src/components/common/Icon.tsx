import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

export function IconTarget({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGear({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.1 5.9l-1.7 1.7M7.6 16.5l-1.7 1.7M18.1 18.1l-1.7-1.7M7.6 7.6L5.9 5.9" />
    </svg>
  );
}

export function IconChartBar({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="12" width="4" height="8" rx="1.2" />
      <rect x="10" y="7" width="4" height="13" rx="1.2" />
      <rect x="16" y="3.5" width="4" height="16.5" rx="1.2" />
    </svg>
  );
}

export function IconChevronLeft({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M15 4.5 7.5 12l7.5 7.5" />
    </svg>
  );
}

export function IconChevronRight({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M9 4.5 16.5 12 9 19.5" />
    </svg>
  );
}

export function IconPencil({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 20l.9-3.9L15.6 5.4a1.8 1.8 0 0 1 2.5 0l.5.5a1.8 1.8 0 0 1 0 2.5L8 19.1 4 20Z" />
      <path d="M13.9 6.9l3.2 3.2" />
    </svg>
  );
}

export function IconTrash({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V5.2c0-.7.6-1.2 1.2-1.2h2.6c.7 0 1.2.6 1.2 1.2V7" />
      <path d="M6.3 7l.7 11.6c0 .8.7 1.4 1.5 1.4h6.9c.8 0 1.4-.6 1.5-1.4L17.7 7" />
      <path d="M10.2 11v6M13.8 11v6" />
    </svg>
  );
}

export function IconPlus({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 4.5v15M4.5 12h15" />
    </svg>
  );
}

export function IconX({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </svg>
  );
}

export function IconCheckCircle({ size = 24, filled = false, ...rest }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
        <circle cx="12" cy="12" r="9.2" fill="currentColor" />
        <path
          d="M8 12.3l2.6 2.6 5.4-5.8"
          stroke="var(--color-accent-contrast)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="9.2" />
    </svg>
  );
}

export function IconArchive({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="3.5" y="4.5" width="17" height="4" rx="1.1" />
      <path d="M5 8.5v9.3c0 .9.7 1.7 1.7 1.7h10.6c1 0 1.7-.8 1.7-1.7V8.5" />
      <path d="M10 12.5h4" />
    </svg>
  );
}

export function IconRestore({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4.5 9.5A7.6 7.6 0 1 1 5 15" />
      <path d="M4.2 5.5v4.2h4.2" />
    </svg>
  );
}

export function IconUpload({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 15.5V4.2M8 8l4-4 4 4" />
      <path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function IconDownload({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 4.2v11.3M8 12l4 4 4-4" />
      <path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function IconPerson({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 19.5c.7-3.6 3.4-5.5 7-5.5s6.3 1.9 7 5.5" />
    </svg>
  );
}

export function IconUsers({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="9" cy="8.2" r="3.1" />
      <path d="M3.3 19c.6-3.2 2.9-4.9 5.7-4.9s5.1 1.7 5.7 4.9" />
      <path d="M15.5 5.3a3 3 0 0 1 0 5.8" />
      <path d="M17.3 14.4c2.2.5 3.7 2 4.2 4.6" />
    </svg>
  );
}

export function IconTrendUp({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 16.5 9.5 11l3.5 3.5L20 7" />
      <path d="M14.5 7H20v5.5" />
    </svg>
  );
}
