// eslint-disable-next-line @typescript-eslint/no-var-requires
const properties = require('known-css-properties').all as string[];

export const knownCSS = (propName: string) => properties.includes(propName);
