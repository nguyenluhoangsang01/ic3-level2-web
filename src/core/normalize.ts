export function normalizeBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'y'].includes(value.trim().toLowerCase());
  }
  return Boolean(value);
}

export function normalizeAnswerValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/\u00a0/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isImageFile(value: unknown): boolean {
  if (!value) return false;
  const clean = String(value).split('?')[0].toLowerCase().trim();
  return /\.(png|jpe?g|gif|webp|svg)$/.test(clean);
}

export function stripHtml(value: unknown): string {
  return normalizeAnswerValue(String(value ?? '').replace(/<[^>]+>/g, ''));
}

export function naturalSort(a: string, b: string): number {
  const rx = /(\d+)|(\D+)/g;
  const ax = String(a).match(rx) || [];
  const bx = String(b).match(rx) || [];
  const len = Math.max(ax.length, bx.length);

  for (let i = 0; i < len; i += 1) {
    const av = ax[i] || '';
    const bv = bx[i] || '';
    const an = Number(av);
    const bn = Number(bv);

    if (!Number.isNaN(an) && !Number.isNaN(bn)) {
      if (an !== bn) return an - bn;
    } else {
      const cmp = av.localeCompare(bv, 'vi');
      if (cmp !== 0) return cmp;
    }
  }

  return 0;
}
