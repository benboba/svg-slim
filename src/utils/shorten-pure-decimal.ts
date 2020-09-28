// 移除纯小数的前导 0
export const shortenPureDecimal = (s: string) => s.replace(/^(-?)0\./, '$1.');
