export const hasProp = <T extends Record<string, unknown>>(obj: T, key: string | number | symbol): key is keyof T => Object.prototype.hasOwnProperty.call(obj, key);
