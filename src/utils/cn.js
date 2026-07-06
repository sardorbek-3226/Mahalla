// Minimal classnames joiner (no dependency). Filters falsy values.
export const cn = (...classes) => classes.filter(Boolean).join(' ');
