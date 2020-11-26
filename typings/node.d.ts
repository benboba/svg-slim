import { Stylesheet } from 'css';
import { IDocument, ITagNode } from 'svg-vdom';
import { IStyleObj } from './style';

export interface ITag extends ITagNode {
	styles?: IStyleObj;
	cloneNode(): ITag;
}

export interface IDom extends IDocument {
	stylesheet?: Stylesheet;
	styletag?: ITagNode;
	cloneNode(): IDom;
}
