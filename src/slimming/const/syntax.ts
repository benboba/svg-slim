import { eventAttributes } from './definitions';

// 符合官方定义的 token
// https://drafts.csswg.org/css-syntax-3

// 是否支持 unicode
let support_unicode = true;
try {
	support_unicode = /\u{20BB7}/u.test('𠮷');
} catch (e) {
	support_unicode = false;
}

const uModifier = support_unicode ? 'u' : '';

// definition
const commaWsp = '(?:\\s*,\\s*|\\s*)';
const semi = '\\s*;\\s*';
const paren = '\\s*\\(\\s*';
const rParen = '\\s*\\)';

// name token
// https://www.w3.org/TR/xml/#NT-Name
const NameStartChar = `:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD${support_unicode ? '\\u{10000}-\\u{EFFFF}' : ''}`;
const NameChar = `${NameStartChar}\\-\\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040`;
const Name = `[${NameStartChar}][${NameChar}]*`;

// css syntax
// https://drafts.csswg.org/css-syntax-3/#non-ascii-code-point
const cssNameStartChar = `A-Za-z_\\u0080-\\uFFFF${support_unicode ? '\\u{10000}-\\u{EFFFF}' : ''}`;
const cssNameChar = `${cssNameStartChar}\\-0-9`;
const cssName = `[${cssNameStartChar}][${cssNameChar}]*`;

export const nameFullMatch = new RegExp(`^${Name}$`, uModifier);
export const cssNameFullMatch = new RegExp(`^${cssName}$`, uModifier);
export const cssNameSpaceSeparatedFullMatch = new RegExp(`^${cssName}(?:\\s+${cssName})*$`, uModifier);

// number token
// https://www.w3.org/TR/css3-values/#length-value
// https://www.w3.org/TR/css-syntax-3/#number-token-diagram
// https://www.w3.org/TR/css-syntax-3/#percentage-token-diagram
export const numberPattern = '[+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?';
const numberSequence = `${numberPattern}(?:${commaWsp}${numberPattern})*`;
const numberPair = `${numberPattern}${commaWsp}${numberPattern}`;
const numberPairSequence = `${numberPair}(?:${commaWsp}${numberPair})*`;
const numberPairDouble = `${numberPair}${commaWsp}${numberPair}`;
const numberPairTriplet = `${numberPair}${commaWsp}${numberPair}${commaWsp}${numberPair}`;
export const numberGlobal = new RegExp(numberPattern, 'g');
export const numberFullMatch = new RegExp(`^${numberPattern}$`);
export const numberOptionalFullMatch = new RegExp(`^${numberPattern}(?:\\s*${numberPattern})?$`);
export const numberListFullMatch = new RegExp(`^${numberSequence}$`);
export const numberSemiSepatatedFullMatch = new RegExp(`^${numberPattern}(?:${semi}${numberPattern})*(?:${semi})?$`);
export const integerFullMatch = /^[+-]?(?:\d+|(?:\d*\.)?\d+[eE][+-]?\d+)$/;

// https://www.w3.org/TR/css-values-3/#angle-value
export const angelFullMatch = new RegExp(`^${numberPattern}(?:deg|grad|rad|turn)$`);

const controlPoint = `${numberPattern}${commaWsp}${numberPattern}${commaWsp}${numberPattern}${commaWsp}${numberPattern}`;
export const controlPointsFullMatch = new RegExp(`^${controlPoint}(?:${semi}${controlPoint})*(?:${semi})?$`);

const Units = '(?:em|ex|ch|rem|vx|vw|vmin|vmax|cm|mm|Q|in|pt|pc|px)';
export const percentageFullMatch = new RegExp(`^${numberPattern}%$`);
export const lengthFullMatch = new RegExp(`^${numberPattern}${Units}?$`);

export const viewBoxFullMatch = new RegExp(`^${controlPoint}$`);

// time token
// https://svgwg.org/specs/animations/#BeginValueListSyntax
const timeCountValue = '\\d+(?:\\.\\d+)?(?:h|min|s|ms)?';
const timeValue = '(?:\\d+:)?[0-5]\\d:[0-5]\\d(?:\\.\\d+)?';
const clockValue = `(?:${timeCountValue}|${timeValue})`;

const offsetValue = `(?:\\s*[+-]\\s*)?${clockValue}`;
const syncbaseValue = `${Name}\\.(?:begin|end)(?:${offsetValue})?`;
const eventValue = `(?:${Name}\\.)?(?:${eventAttributes.join('|')})(?:${offsetValue})?`;
const repeatValue = `(?:${Name}\\.)?repeat\\(\\d+\\)(?:${offsetValue})?`;
const accessKeyValue = `accessKey\\(.\\)(?:${offsetValue})?`;
const wallclockSyncValue = 'wallclock\\(\\d+\\)';

const timePattern = `(?:${offsetValue}|${syncbaseValue}|${eventValue}|${repeatValue}|${accessKeyValue}|${wallclockSyncValue}|indefinite)`;
export const clockFullMatch = new RegExp(`^${clockValue}$`);
export const timeListFullMatch = new RegExp(`^${timePattern}(\\s*;\\s*${timePattern})*$`, uModifier);

// transform token
// https://drafts.csswg.org/css-transforms/#svg-comma
const translate = `translate${paren}${numberPattern}(?:(?:${commaWsp})?${numberPattern})?${rParen}`;
const scale = `scale${paren}${numberPattern}(?:(?:${commaWsp})?${numberPattern})?${rParen}`;
const rotate = `rotate${paren}${numberPattern}(?:(?:(?:${commaWsp})?${numberPattern}){2})?${rParen}`;
const skewX = `skewX${paren}${numberPattern}${rParen}`;
const skewY = `skewY${paren}${numberPattern}${rParen}`;
const matrix = `matrix${paren}${numberPattern}(?:(?:(?:${commaWsp})?${numberPattern}){5})?${rParen}`;
export const transformListFullMatch = new RegExp(`^(?:\\s*(?:${translate}|${scale}|${rotate}|${skewX}|${skewY}|${matrix})\\s*)*$`);

// uri token
// http://www.ietf.org/rfc/rfc3986.txt
export const URIFullMatch = /^(?:[^:/?#]+\:)?(?:\/\/[^/?#]*)?(?:[^?#]*)(?:\?[^#]*)?(?:#.*)?$/;

// https://tools.ietf.org/html/bcp47#section-2.1
export const langFullMatch = /^[a-zA-Z]{2,}(?:-[a-zA-Z0-9%]+)*$/;

// https://drafts.csswg.org/css-syntax-3/#typedef-ident-token
const hexDigit = '0-9a-fA-F';
const newLine = '\\r\\n';
const escape = `\\\\(?:[^${hexDigit}${newLine}]|[${hexDigit}]{1,6}\\s?)`;
const indentToken = `(?:--|-?(?:[${cssNameStartChar}]|${escape}))(?:[${cssNameChar}]|${escape})*`;
export const indentFullMatch = new RegExp(`^${indentToken}$`, uModifier);

// https://svgwg.org/svg2-draft/paths.html#PathDataBNF
const path_z = '[zZ]';
const path_mto = `[mM]\\s*${numberPairSequence}${path_z}?`;
const path_lto = `[lL]\\s*(?:${numberPairSequence}|${path_z})`;
const path_hvto = `[hHvV]\\s*${numberSequence}`;
const path_cto = `[cC]\\s*(?:${numberPairTriplet}(?:${commaWsp}${numberPairTriplet})*|(?:${numberPairSequence})?${path_z})`;
const path_sqto = `[cCqQ]\\s*(?:${numberPairDouble}(?:${commaWsp}${numberPairDouble})*|(?:${numberPairSequence})?${path_z})`;
const path_tto = `[tT]\\s*(?:${numberPairSequence}|${path_z})`;
const path_a = `${numberPattern}${commaWsp}${numberPattern}${commaWsp}${numberPattern}${commaWsp}[01]${commaWsp}[01]${commaWsp}`;
const path_a_sequence = `${path_a}${numberPair}(?:${commaWsp}${path_a}${numberPair})*`;
const path_ato = `[aA]\\s*(?:${path_a_sequence}|(?:${path_a_sequence})?${path_a}${path_z})`;
const pathPattern = `(?:${path_mto}|${path_z}|${path_lto}|${path_hvto}|${path_cto}|${path_sqto}|${path_tto}|${path_ato})`;
export const pathFullMatch = new RegExp(`^${path_mto}(?:${commaWsp}${pathPattern})*$`);

export const preservAspectRatioFullMatch = /^(?:none|xMinYMin|xMidYMin|xMaxYMin|xMinYMid|xMidYMid|xMaxYMid|xMinYMax|xMidYMax|xMaxYMax)(?:\s+(?:meet|slice))?$/;