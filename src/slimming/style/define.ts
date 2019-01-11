// 选择器混合字符，不含后代选择器（空格）
export enum selectorUnitCombinator {
    '>' = 1,
    '+',
    '~'
}

// 属性选择器等号修饰符
export enum attrModifier {
    '^' = 1,
    '$',
    '~',
    '|',
    '*'
}

// 属性选择器接口定义
export interface IAttrSelector {
    key: string;
    modifier?: attrModifier;
    value?: string;
}

// 伪类选择器接口定义
export interface IPseudo {
    func: string;
    value?: string;
}

// 选择器接口定义
export interface ISelector {
    universal?: boolean;
    type?: string;
    id: string[];
    class: string[];
    attr: IAttrSelector[];
    pseudo: IPseudo[];
    combinator?: selectorUnitCombinator;
}

export interface ISeletorPriority {
    id: number;
    class: number;
    tag: number;
}
