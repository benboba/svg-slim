import { NodeType } from '../node/index';
import { IAttr, INode } from '../../typings/node';

interface INodeOption {
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
			this.attributes = [];
			this.childNodes = [];
		}
	}

	nodeName: string;
	nodeType: NodeType;
	namespace?: string;
	selfClose?: boolean;
	textContent?: string;

	attributes?: IAttr[];
	childNodes?: INode[];

	parentNode?: INode;

	// 复制自身，但是不复制节点树关系链
	cloneNode(): INode {
		const cloneNode = new Node({
			nodeName: this.nodeName,
			nodeType: this.nodeType,
			namespace: this.namespace,
			textContent: this.textContent,
		});

		if (this.attributes) {
			// 属性需要深拷贝
			cloneNode.attributes = this.attributes.map(attr => {
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
	appendChild(childNode: INode): void {
		if (this.childNodes) {
			// 如果子节点原本有父节点，则先从原本的父节点中移除
			if (childNode.parentNode) {
				childNode.parentNode.removeChild(childNode);
			}
			this.childNodes.push(childNode);
			childNode.parentNode = this;
		}
	}

	// 插入到子节点之前
	insertBefore(childNode: INode, previousTarget: INode): void {
		if (this.childNodes) {
			// 如果子节点原本有父节点，则先从原本的父节点中移除
			if (childNode.parentNode) {
				childNode.parentNode.removeChild(childNode);
			}
			// 判断目标节点是否在自己的子节点列表中，如果不在，直接插入
			const pindex = this.childNodes.indexOf(previousTarget);
			if (pindex !== -1) {
				this.childNodes.splice(pindex, 0, childNode);
			} else {
				this.childNodes.push(childNode);
			}
			childNode.parentNode = this;
		}
	}

	// 替换子节点
	replaceChild(childNode: INode, ...children: INode[]): void {
		if (this.childNodes) {
			const index = this.childNodes.indexOf(childNode);
			if (index !== -1) {
				children.forEach(child => {
					// 先把要插入的子节点从原有父节点移除
					if (child.parentNode) {
						child.parentNode.removeChild(child);
					}
					// 指定父节点到自身
					child.parentNode = this;
				});
				this.childNodes.splice(index, 1, ...children);
				// 清理被替换掉的子节点的钩子
				delete childNode.parentNode;
			}
		}
	}

	// 移除子节点
	removeChild(childNode: INode): void {
		if (this.childNodes) {
			const index = this.childNodes.indexOf(childNode);
			if (index !== -1) {
				this.childNodes.splice(index, 1);
				delete childNode.parentNode;
			}
		}
	}

	// 是否存在属性
	hasAttribute(name: string, namespace?: string): boolean {
		if (this.attributes) {
			for (const attr of this.attributes) {
				if (!namespace) {
					if (attr.fullname === name) {
						return true;
					}
				} else {
					if (attr.name === name && attr.namespace === namespace) {
						return true;
					}
				}
			}
		}
		return false;
	}

	getAttribute(name: string, namespace?: string): string | null {
		if (this.attributes) {
			for (const attr of this.attributes) {
				if (!namespace) {
					if (attr.fullname === name) {
						return attr.value;
					}
				} else {
					if (attr.name === name && attr.namespace === namespace) {
						return attr.value;
					}
				}
			}
		}
		return null;
	}

	setAttribute(name: string, value: string, namespace?: string): void {
		if (this.attributes) {
			for (const attr of this.attributes) {
				if (!namespace) {
					if (attr.fullname === name) {
						attr.value = value;
						return;
					}
				} else {
					if (attr.name === name && attr.namespace === namespace) {
						attr.value = value;
						return;
					}
				}
			}

			const newAttr: IAttr = {
				name,
				value,
				fullname: name,
			};
			if (namespace) {
				newAttr.fullname = `${namespace}:${name}`;
				newAttr.namespace = namespace;
			}
			this.attributes.push(newAttr);
		}
	}

	removeAttribute(name: string, namespace?: string): void {
		if (this.attributes) {
			for (let i = this.attributes.length; i--;) {
				const attr = this.attributes[i];
				if (!namespace) {
					if (attr.fullname === name) {
						this.attributes.splice(i, 1);
						return;
					}
				} else {
					if (attr.name === name && attr.namespace === namespace) {
						this.attributes.splice(i, 1);
						return;
					}
				}
			}
		}
	}

	// previousSibling?: INode;
	// nextSibling?: INode;
}
