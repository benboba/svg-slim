const HEX = 16;
const TEN = 10;

export const toHex = (s: number | string): string => parseInt(`${s}`, TEN).toString(HEX);
