import { IRegularTag } from '../../typings';

// 一些元素的某些属性不能被转为 style
export const cantTrans = (define: IRegularTag, attrName: string) => define.onlyAttr && define.onlyAttr.includes(attrName);
