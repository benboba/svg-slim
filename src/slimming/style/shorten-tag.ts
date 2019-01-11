// 去除 style 标签最后的分号

export const shortenTag = (s:string): string => s.replace(/;}/g, '}');
