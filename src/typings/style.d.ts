import { Rule } from 'css';
import { attrModifier, selectorUnitCombinator } from '../slimming/style/define';

declare global {
    // 属性选择器接口定义
    interface IAttrSelector {
        key: string;
        modifier?: attrModifier;
        value?: string;
    }

    // 伪类选择器接口定义
    interface IPseudo {
        func: string;
        isClass: boolean;
        value?: string;
    }

    // 选择器接口定义
    interface ISelector {
        universal?: boolean;
        type?: string;
        id: string[];
        class: string[];
        attr: IAttrSelector[];
        pseudo: IPseudo[];
        combinator?: selectorUnitCombinator;
    }

    // 选择器权重
    interface ISeletorPriority {
        id: number;
        class: number;
        tag: number;
    }

    // 在 shorten-class 和 shorten-id 中会用到，通过设置 ruleId 属性来排重
    interface IExtendRule extends Rule {
        ruleId?: number;
    }
}
