// 缩短函数类字符串，移除其中的空白
export const shortenFunc = (s: string): string => s.replace(/\s*([,()])\s*/g, '$1');
