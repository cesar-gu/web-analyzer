export function formatFetchTime(
  fetchTime: string | number | undefined
): string {
  const time = parseFloat((fetchTime ?? '').toString());

  if (isNaN(time)) return (fetchTime as string) || '—';
  if (time < 1000) return `${Math.round(time)} ms`;
  return `${(time / 1000).toFixed(2)} s`;
}

export default formatFetchTime;
