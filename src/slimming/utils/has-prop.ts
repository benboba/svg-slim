export const hasProp = <T extends TBaseObj>(obj: T, key: string | number | symbol): key is keyof T => Object.prototype.hasOwnProperty.call(obj, key);
