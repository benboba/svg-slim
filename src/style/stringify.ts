import { IStyleAttr } from '../../typings/style';

export const stringifyStyle = (style: IStyleAttr[]) => style.map(attr => `${attr.name}:${attr.value}${attr.important ? '!important' : ''}`).join(';');
