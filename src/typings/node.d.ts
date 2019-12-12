import { Stylesheet } from 'css';
import { NodeType } from '../node';


declare global {
	interface IAttr {
		name: string;
		value: string;
		fullname: string;
		namespace?: string;
	}
	
	interface INode {
		nodeName: string;
		nodeType: NodeType;
		namespace?: string;
		selfClose?: boolean;
		textContent?: string;
	
		readonly attributes: ReadonlyArray<IAttr> | null;
		readonly childNodes: ReadonlyArray<INode> | null;
	
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
	
	interface IStyleObj {
		[propName: string]: {
			value: string;
			from: 'attr' | 'styletag' | 'inline' | 'inherit';
			selectorPriority?: ISeletorPriority;
		};
	}
	
	interface ITagNode extends INode {
		readonly childNodes: INode[];
		readonly attributes: IAttr[];
		cloneNode(): ITagNode;
		styles?: IStyleObj;
	}

	interface IDomNode extends ITagNode {
		stylesheet?: Stylesheet;
		styletag?: ITagNode;
	}

	interface ITextNode extends INode {
		readonly childNodes: null;
		readonly attributes: null;
		textContent: string;
	}
}
