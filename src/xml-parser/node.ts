import { NodeType, IAttr, INode } from '../node/index';

export interface INodeOption {
	nodeName: string;
	nodeType: NodeType;
	namespace?: string;
	selfClose?: boolean;
	textContent?: string;
}

export class Node implements INode {
	constructor(option: INodeOption) {
		this.nodeName = option.nodeName;
		this.nodeType = option.nodeType;
		this.namespace = option.namespace;
		this.selfClose = option.selfClose;
		this.textContent = option.textContent;

		if (this.nodeType === NodeType.Tag || this.nodeType === NodeType.Document) {
			this._attributes = [];
			this._childNodes = [];
		}
	}

	public nodeName: string;
	public nodeType: NodeType;
	public namespace?: string;
	public selfClose?: boolean;
	public textContent?: string;

	private _attributes?: IAttr[];
	public get attributes(): ReadonlyArray<IAttr> {
		return this._attributes ? Object.freeze(this._attributes.slice()) : null;
	}

	private _childNodes?: INode[];
	public get childNodes() : ReadonlyArray<INode> {
		return this._childNodes ? Object.freeze(this._childNodes.slice()) : null;
	}

	public parentNode?: INode;

	// 复制自身，但是不复制节点树关系链
	public cloneNode(): INode {
		const cloneNode = new Node({
			nodeName: this.nodeName,
			nodeType: this.nodeType,
			namespace: this.namespace,
			textContent: this.textContent
		});

		if (this._attributes) {
			// 属性需要深拷贝
			cloneNode._attributes = this._attributes.map(attr => {
				return {
					name: attr.name,
					value: attr.value,
					fullname: attr.fullname,
					namespace: attr.namespace,
				};
			});
		}

		return cloneNode;
	}

	// 追加子节点
	public appendChild(childNode: INode): void {
		if (this._childNodes) {
			// 如果子节点原本有父节点，则先从原本的父节点中移除
			if (childNode.parentNode && childNode.parentNode !== this) {
				const pindex = childNode.parentNode.childNodes.indexOf(childNode);
				if (pindex !== -1) {
					childNode.parentNode.removeChild(childNode);
				}
			}

			// 如果已在自己的子节点列表中，则先移除再追加到末尾
			const index = this._childNodes.indexOf(childNode);
			if (index !== -1) {
				this._childNodes.splice(index, 1);
			}

			this._childNodes.push(childNode);
			childNode.parentNode = this;
		}
	}

	// 插入到子节点之前
	public insertBefore(childNode: INode, previousTarget: INode): void {
		if (this._childNodes) {
			// 首先判断目标节点是否在自己的子节点列表中
			let pindex = this._childNodes.indexOf(previousTarget);
			if (pindex !== -1) {
				// 首先判断子节点是否在自己的子节点列表中，如果在，则先移除
				const index = this._childNodes.indexOf(childNode);
				if (index !== -1) {
					this._childNodes.splice(index, 1);
				}
				childNode.parentNode = null;
			}
		}
	}

	// 替换子节点
	public replaceChild(childNode: INode, ...children: INode[]): void {
		if (this._childNodes) {
			const index = this._childNodes.indexOf(childNode);
			if (index !== -1) {
				this._childNodes.splice(index, 1, ...children);
				childNode.parentNode = null;
				children.forEach(child => {
					child.parentNode = this;
				});
			}
		}
	}

	// 移除子节点
	public removeChild(childNode: INode): void {
		if (this._childNodes) {
			const index = this._childNodes.indexOf(childNode);
			if (index !== -1) {
				this._childNodes.splice(index, 1);
				childNode.parentNode = null;
			}
		}
	}

	// 是否存在属性
	public hasAttribute(name: string, namespace?: string): boolean {
		if (this._attributes) {
			for (const attr of this._attributes) {
				if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {
					return true;
				}
			}
		}
		return false;
	}

	public getAttribute(name: string, namespace?: string): string {
		if (this._attributes) {
			for (const attr of this._attributes) {
				if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {
					return attr.value;
				}
			}
		}
		return null;
	}

	public setAttribute(name: string, value: string, namespace?: string): void {
		if (this._attributes) {
			for (const attr of this._attributes) {
				if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {
					attr.value = value;
					return;
				}
			}

			const newAttr:IAttr = {
				name,
				value,
				fullname: name
			};
			if (namespace) {
				newAttr.fullname = `${namespace}:${name}`;
				newAttr.namespace = namespace;
			}
			this._attributes.push(newAttr);
		}
	}

	public removeAttribute(name: string, namespace?: string): void {
		if (this._attributes) {
			for (let i = this._attributes.length; i--; ) {
				const attr = this._attributes[i];
				if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {
					this._attributes.splice(i, 1);
					break;
				}
			}
		}
	}

	// previousSibling?: INode;
	// nextSibling?: INode;
}
