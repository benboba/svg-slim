// 用于验证的正则表达式

// style 属性中是否包含 important
export const importantReg = /!important$/;

// css 选择器相关字符
export const idChar = '#[^#\\.\\[\\*:\\s]+';
export const classChar = '\\.[^#\\.\\[\\*:\\s]+';
export const attrChar = '\\[[a-zA-Z][a-zA-Z0-9\\-]*(?:[\\|\\^\\$\\*~]?=(?:\'[^\']*\'|"[^"]*"|[^\'"\\]]+))?\\]';
export const pseudoChar = '\\:{1,2}[a-zA-Z-]+(?:\\((?:[^\\)]+|[^\\(]+\\([^\\)]+\\))\\))?';
