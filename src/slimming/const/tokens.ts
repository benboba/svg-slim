// 符合官方定义的 token
// https://drafts.csswg.org/css-syntax-3

// number token
export const numberPattern = '[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:e[+-]?\\d+)?';
export const numberRegGlobal = new RegExp(numberPattern, 'gi');
export const numberRegFullMatch = new RegExp(`^${numberPattern}$`, 'i');
