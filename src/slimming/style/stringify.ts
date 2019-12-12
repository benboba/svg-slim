export const stringifyStyle = (style: IAttr[]) => style.map(attr => `${attr.name}:${attr.value}`).join(';');
