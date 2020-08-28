import { Stylesheet } from 'css';
import { NodeType } from '../src/node';

export interface IAttr {
	name: string;
	value: string;
	fullname: string;
	namespace?: string;
}

export interface INode {
	nodeName: string;
	nodeType: NodeType;
	namespace?: string;
	selfClose?: boolean;
	textContent?: string;

	attributes?: Array<IAttr>;
	childNodes?: Array<INode>;

	parentNode?: INode;

	cloneNode(): INode;

	appendChild(childNode: INode): void;
	insertBefore(childNode: INode, previousTarget: INode): void;
	replaceChild(childNode: INode, ...children: INode[]): void;
	removeChild(childNode: INode): void;

	hasAttribute(name: string, namespace?: string): boolean;
	getAttribute(name: string, namespace?: string): string | null;
	setAttribute(name: string, value: string, namespace?: string): void;
	removeAttribute(name: string, namespace?: string): void;
}

export interface IStyleObj {
	[propName: string]: {
		value: string;
		from: 'attr' | 'styletag' | 'inline' | 'inherit';
		selectorPriority?: ISeletorPriority;
	};
}

export interface ITagNode extends INode {
	childNodes: INode[];
	attributes: IAttr[];
	cloneNode(): ITagNode;
	styles?: IStyleObj;
}

export interface IDomNode extends ITagNode {
	stylesheet?: Stylesheet;
	styletag?: ITagNode;
}

export interface ITextNode extends INode {
	childNodes: undefined;
	attributes: undefined;
	textContent: string;
}

export interface IPathNode extends ITagNode {
	nodeName: 'path';
	attributes: [{
		name: 'd';
		value: string;
		fullname: 'd';
		namespace: '';
	}, ...IAttr[]];
}
