let supportUnicode = true;
try {
	supportUnicode = /\u{20BB7}/u.test('𠮷');
} catch (e) {
	supportUnicode = false;
}

const NameStartChar = `:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD${supportUnicode ? '\\u{10000}-\\u{EFFFF}' : ''}`;
const NameChar = `${NameStartChar}\\-\\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040`;
const Name = `[${NameStartChar}][${NameChar}]*`;

const Eq = '\\s*=\\s*';
const VersionNum = '1\\.[0-9]+';
const EncName = '[A-Za-z](?:[A-Za-z0-9\\._]|-)*';

const VersionInfo = `\\s+version${Eq}(?:'${VersionNum}'|"${VersionNum}")`;
const EncodingDecl = `\\s+encoding${Eq}(?:'${EncName}'|"${EncName}")`;
const SDDecl = `\\s+standalone${Eq}(?:'(?:yes|no)'|"(?:yes|no)")`;

const Reference = `(?:&${Name};|&#[0-9]+;|&#x[0-9a-fA-F]+;)`;
const AttrVal = `"(?:[^<&"]|${Reference})*"|'(?:[^<&']|${Reference})*'`;

const DeclContent = '(?:[^<>\'"]+|[^<>\']*\'[^\']*\'[^<>\']*|[^<>"]*"[^"]*"[^<>"]*|[^<>\'"]*<[^<>]*>[^<>\'"]*)+?';

export const REG_XML_DECL = new RegExp(`<\\?xml(${VersionInfo}(?:${EncodingDecl})?(?:${SDDecl})?\\s*)\\?>`, 'g');
export const REG_CDATA_SECT = /<!\[CDATA\[([\d\D]*?)\]\]>/g;
export const REG_OTHER_SECT = /<!\[\s?([A-Z]+)\s?\[([\d\D]*?)\]\]>/g;
export const REG_DOCTYPE = new RegExp(`<!DOCTYPE\\s+(${DeclContent})>`, 'g');
export const REG_OTHER_DECL = new RegExp(`<!([A-Z]+)\\s+(${DeclContent})>`, 'g');
export const REG_COMMENTS = /<!--([\d\D]*?)-->/g;
export const REG_START_TAG = new RegExp(`<(${Name})((?:\\s+${Name}${Eq}(?:${AttrVal}))*)\\s*(\\/?)>`, supportUnicode ? 'gu' : 'g');
export const REG_END_TAG = new RegExp(`</(${Name})\\s*>`, supportUnicode ? 'gu' : 'g');
export const REG_ATTR = new RegExp(`(?:^|\\s)(${Name})${Eq}(${AttrVal})`, supportUnicode ? 'gu' : 'g');
