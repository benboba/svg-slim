export enum selectorUnitCombinator {
    '>' = 1,
    '+',
    '~'
}

export enum attrModifier {
    '^' = 1,
    '$',
    '~',
    '|',
    '*'
}

export interface IAttrSelector {
    key: string;
    modifier?: attrModifier;
    value?: string;
}

export interface IPseudo {
    func: string;
    value?: string;
}

export interface ISelector {
    universal?: boolean;
    type?: string;
    id: string[];
    class: string[];
    attr: IAttrSelector[];
    pseudo: IPseudo[];
    combinator?: selectorUnitCombinator;
}
