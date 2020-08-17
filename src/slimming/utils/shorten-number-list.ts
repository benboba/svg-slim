export const shortenNumberList = (s: string): string => s.trim().replace(/\s*,\s*|\s+/g, ',').replace(/,(?=[+-]\.?\d+)/g, '').replace(/([.eE]\d+),(?=\.\d+)/g, '$1');
