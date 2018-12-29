import { INode } from 'src/node/';
import { ISeletorPriority } from '../style/define';

export interface IStyleObj {
    [propName: string]: {
        value: string,
        from: 'attr' | 'styletag' | 'inline' | 'inherit',
        selectorPriority?: ISeletorPriority
    };
}

export interface IStyleNode extends INode {
    styles?: IStyleObj;
	readonly childNodes: ReadonlyArray<IStyleNode>;
	parentNode?: IStyleNode;
}
