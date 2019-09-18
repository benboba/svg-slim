import { Stylesheet } from 'css';
import { IAttr, INode } from '../../node/';
import { ISeletorPriority } from '../style/define';

export interface IStyleObj {
	[propName: string]: {
		value: string;
		from: 'attr' | 'styletag' | 'inline' | 'inherit';
		selectorPriority?: ISeletorPriority;
	};
}

export interface ITagNode extends INode {
	readonly childNodes: INode[];
	readonly attributes: IAttr[];
	cloneNode(): ITagNode;
	styles?: IStyleObj;
}

export interface IDomNode extends ITagNode {
	stylesheet?: Stylesheet;
	styletag?: ITagNode;
}

export interface ITextNode extends INode {
	readonly childNodes: null;
	readonly attributes: null;
	textContent: string;
}
