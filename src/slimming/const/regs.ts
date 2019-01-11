// 用于验证的正则表达式

// css 选择器相关字符
export const idChar = '#[^#\\.\\[\\*:]+';
export const classChar = '\\.[^#\\.\\[\\*:]+';
// tslint:disable-next-line
export const attrChar = `\\[(?:[a-zA-Z][a-zA-Z0-9\\-]*\\|)?[a-zA-Z][a-zA-Z0-9\\-]*(?:[\\|\\^\\$\\*~]?=(?:'[^']*'|"[^"]*"|[^'"\\]]+))?\\]`;
export const pseudoChar = '\\:{1,2}[a-zA-Z-]+(?:\\((?:[^\\)]+|[^\\(]+\\([^\\)]+\\))\\))?';
