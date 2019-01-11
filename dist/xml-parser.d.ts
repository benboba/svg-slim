export declare enum NodeType {
    EndTag = -1,
    Tag = 1,
    Text = 3,
    CDATA = 4,
    OtherSect = 5,
    OtherDecl = 6,
    XMLDecl = 7,
    Comments = 8,
    Document = 9,
    DocType = 10
}

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

export interface INodeOption {
    nodeName: string;
    nodeType: NodeType;
    namespace?: string;
    selfClose?: boolean;
    textContent?: string;
}

export declare class Node implements INode {
    constructor(option: INodeOption);
    nodeName: string;
    nodeType: NodeType;
    namespace?: string;
    selfClose?: boolean;
    textContent?: string;
    private _attributes?;
    readonly attributes: ReadonlyArray<IAttr> | null;
    private _childNodes?;
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

export declare function Parser(str: string): Promise<Node>;