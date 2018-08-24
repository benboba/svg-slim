export const toArray = <T>(item: T) => Array.isArray(item) ? item as Array<{}> : [item];
