import { NodeType } from '../node/index';
import { Node } from './node';

import { REG_XML_DECL, REG_CDATA_SECT, REG_OTHER_SECT, REG_DOCTYPE, REG_OTHER_DECL, REG_COMMENTS, REG_START_TAG, REG_END_TAG, REG_ATTR } from './regs';

import { collapseQuot } from './utils';
import { mixWhiteSpace } from '../slimming/utils/mix-white-space';

interface IStatus {
	line: number;
	pos: number;
	lastpos: number;
}

interface ICurrent {
	node: Node;
	lastIndex: number;
}

const configs: Array<[number, string, RegExp, number] | [number, RegExp, number]> = [
	[1, 'xml-decl', REG_XML_DECL, NodeType.XMLDecl],
	[1, 'cdata', REG_CDATA_SECT, NodeType.CDATA],
	[2, REG_OTHER_SECT, NodeType.OtherSect],
	[1, 'doctype', REG_DOCTYPE, NodeType.DocType],
	[2, REG_OTHER_DECL, NodeType.OtherDecl],
	[1, 'comments', REG_COMMENTS, NodeType.Comments],
];

const updStatus = (pos: number, str: string, status: IStatus) => {
	for (; status.lastpos < pos; status.lastpos++) {
		if (str[status.lastpos] === '\r' || str[status.lastpos] === '\n') {
			// 换行判断，\r 直接换行，\n 判断一下是不是紧跟在 \r 后面
			if (str[status.lastpos] === '\r' || str[status.lastpos - 1] !== '\r') {
				status.line++;
				status.pos = 0;
			}
		} else {
			status.pos++;
		}
	}
};

// 应对一个捕获组的状况
const Process1 = (conf: [number, string, RegExp, number], str: string, lastIndex: number): ICurrent | null => {
	const reg = conf[2];
	reg.lastIndex = lastIndex;
	const execResult = reg.exec(str);
	if (execResult && execResult.index === lastIndex) {
		return {
			node: new Node({
				nodeType: conf[3],
				nodeName: `#${conf[1]}`,
				textContent: execResult[1],
			}),
			lastIndex: reg.lastIndex,
		};
	}
	return null;
};


// 应对两个捕获组的状况
const Process2 = (conf: [number, RegExp, number], str: string, lastIndex: number): ICurrent | null => {
	const reg = conf[1];
	reg.lastIndex = lastIndex;
	const execResult = reg.exec(str);
	if (execResult && execResult.index === lastIndex) {
		return {
			node: new Node({
				nodeType: conf[2],
				nodeName: `#${execResult[1].toLowerCase()}`,
				textContent: execResult[2],
			}),
			lastIndex: reg.lastIndex,
		};
	}
	return null;
};

// 处理标签
const ProcessTag = (str: string, status: IStatus, lastIndex: number): ICurrent | null => {
	REG_START_TAG.lastIndex = lastIndex;
	const execResult = REG_START_TAG.exec(str);
	if (execResult && execResult.index === lastIndex) {
		const tempStatus: IStatus = { line: status.line, pos: status.pos, lastpos: 0 };
		const result = {
			node: new Node({
				nodeType: NodeType.Tag,
				nodeName: execResult[1],
				namespace: '',
				selfClose: execResult[3] === '/',
			}),
			lastIndex: REG_START_TAG.lastIndex,
		};

		// 标签的 namespace
		if (execResult[1].includes(':')) {
			const tagName = execResult[1].split(':');
			if (tagName.length !== 2 || !tagName[0] || !tagName[1]) {
				throw new Error(`Wrong start tag! at ${status.line}:${status.pos}`);
			} else {
				result.node.nodeName = tagName[1];
				result.node.namespace = tagName[0];
			}
		}

		updStatus(execResult[1].length + 1, execResult[0], tempStatus);

		// ** 重要 ** 重置匹配位置！
		REG_ATTR.lastIndex = 0;

		let attrExec = REG_ATTR.exec(execResult[2]);
		const attrUnique: TUnique = {};
		while (attrExec) {
			updStatus(attrExec.index + execResult[1].length + 1, execResult[0], tempStatus);

			// 属性名排重
			if (attrUnique[attrExec[1]]) {
				throw new Error(`Duplicate property names! at ${tempStatus.line}:${tempStatus.pos}`);
			}
			attrUnique[attrExec[1]] = true;

			if (attrExec[1].includes(':')) {
				const attrName = attrExec[1].split(':');
				if (attrName.length === 2 && attrName[0] && attrName[1]) {
					result.node.setAttribute(attrName[1], collapseQuot(attrExec[2]).trim(), attrName[0]);
				} else {
					throw new Error(`Wrong attribute name! at ${tempStatus.line + status.line - 1}:${tempStatus.line > 1 ? tempStatus.pos : status.pos + tempStatus.pos}`);
				}
			} else {
				result.node.setAttribute(attrExec[1], collapseQuot(attrExec[2]).trim());
			}
			attrExec = REG_ATTR.exec(execResult[2]);
		}

		return result;
	}
	return null;
};


const ProcessEndTag = (str: string, status: IStatus, lastIndex: number): ICurrent | null => {
	REG_END_TAG.lastIndex = lastIndex;
	const execResult = REG_END_TAG.exec(str);
	if (execResult && execResult.index === lastIndex) {
		const result = {
			node: new Node({
				nodeType: NodeType.EndTag,
				nodeName: execResult[1],
				namespace: '',
			}),
			lastIndex: REG_END_TAG.lastIndex,
		};
		if (execResult[1].includes(':')) {
			const tagName = execResult[1].split(':');
			if (tagName.length !== 2 || !tagName[1] || !tagName[0]) {
				throw new Error(`Wrong end tag! at ${status.line}:${status.pos}`);
			} else {
				result.node.nodeName = tagName[1];
				result.node.namespace = tagName[0];
			}
		}
		return result;
	}
	return null;
};


const parse = (str: string, status: IStatus, lastIndex: number): ICurrent => {
	const REG_LT = /</g;
	REG_LT.lastIndex = lastIndex;
	const ltExec = REG_LT.exec(str);
	if (ltExec) {
		if (ltExec.index === lastIndex) { // 以 < 开始的情况都按节点处理

			for (const cfg of configs) {
				if (cfg[0] === 1) {
					const processResult1 = Process1(cfg as [number, string, RegExp, number], str, lastIndex);
					if (processResult1) {
						return processResult1;
					}
				} else {
					const processResult2 = Process2(cfg as [number, RegExp, number], str, lastIndex);
					if (processResult2) {
						return processResult2;
					}
				}
			}

			const processTag = ProcessTag(str, status, lastIndex);
			if (processTag) {
				return processTag;
			}

			const processEndTag = ProcessEndTag(str, status, lastIndex);
			if (processEndTag) {
				return processEndTag;
			}
			throw new Error(`Failed to parse tags! at ${status.line}:${status.pos}`);

		} else { // 非 < 开始的都按文本处理

			return {
				node: new Node({
					nodeType: NodeType.Text,
					nodeName: '#text',
					textContent: mixWhiteSpace(str.slice(lastIndex, ltExec.index)),
				}),
				lastIndex: ltExec.index,
			};
		}
	} else {
		return {
			node: new Node({
				nodeType: NodeType.Text,
				nodeName: '#text',
				textContent: mixWhiteSpace(str.slice(lastIndex)),
			}),
			lastIndex: str.length,
		};
	}
};

export const Parser = async (str: string): Promise<IDomNode> => {

	return new Promise((resolve, reject) => {
		const doc = new Node({
			nodeType: NodeType.Document,
			nodeName: '#document',
		}) as IDomNode;
		const stack: Node[] = [];
		const status: IStatus = {
			line: 1,
			pos: 0,
			lastpos: 0,
		};
		const len = str.length;

		let current: { node: Node; lastIndex: number };
		let hasRoot = false;
		const firstIndex = str.indexOf('<');
		if (firstIndex > 0 && !/^\s+</.test(str)) {
			reject(new Error(`Unexpected text node! at ${status.line}:${status.pos}`));
			return;
		}
		try {
			current = parse(str, status, firstIndex); // 第一个 < 之前的全部字符都忽略掉
		} catch (e) {
			reject(e);
			return;
		}
		if (current.node.nodeType === NodeType.XMLDecl && firstIndex > 0) {
			reject(new Error(`The xml declaration must be at the front of the document! at ${status.line}:${status.pos}`));
			return;
		}
		doc.appendChild(current.node);
		if (current.node.nodeType === NodeType.Tag) {
			hasRoot = true;
			if (!current.node.selfClose) {
				stack.push(current.node);
			}
		}

		while (current.lastIndex < len) {

			updStatus(current.lastIndex, str, status);
			try {
				current = parse(str, status, current.lastIndex); // 第一个 < 之前的全部字符都忽略掉
			} catch (e) {
				reject(e);
				return;
			}

			const stackLen = stack.length;

			if (current.node.nodeType === NodeType.EndTag) {

				// 遇到结束标签的处理逻辑
				if (stackLen) {
					// 结束标签和开始标签匹配
					if (stack[stackLen - 1].nodeName === current.node.nodeName && stack[stackLen - 1].namespace === current.node.namespace) {
						// 无子节点，则转为自闭合节点
						const childNodes = stack[stackLen - 1].childNodes;
						if (!childNodes || !childNodes.length) {
							stack[stackLen - 1].selfClose = true;
						}
						stack.pop();
					} else {
						reject(new Error(`The start and end tags cannot match! at ${status.line}:${status.pos}`));
						return;
					}
				} else {
					// 没有开始标签而出现了结束标签
					reject(new Error(`Unexpected end tag! at ${status.line}:${status.pos}`));
					return;
				}


			} else {


				if (stackLen) {
					// 插入子节点
					stack[stackLen - 1].appendChild(current.node);
				} else if (current.node.nodeType === NodeType.Text || current.node.nodeType === NodeType.CDATA) {
					// 没有节点而出现了非空文本节点
					if ((current.node.textContent as string).replace(/\s/g, '')) {
						reject(new Error(`Unexpected text node! at ${status.line}:${status.pos}`));
						return;
					}
				} else {
					// 直接扔到根下
					doc.appendChild(current.node);
				}
				// 遇到未闭合的节点，扔到stack内
				if (current.node.nodeType === NodeType.Tag) {
					if (!stackLen) {
						if (hasRoot) {
							reject(new Error(`Only one root element node is allowed! at ${status.line}:${status.pos}`));
							return;
						}
						hasRoot = true;
					}
					if (!current.node.selfClose) {
						stack.push(current.node);
					}
				}
			}

			if (current.lastIndex === len) {
				updStatus(len, str, status);
			}

		}

		if (stack.length) {
			reject(new Error(`Document structure is wrong! at ${status.line}:${status.pos}`));
			return;
		}

		if (!hasRoot) {
			reject(new Error(`No root element node! at ${status.line}:${status.pos}`));
			return;
		}

		resolve(doc);
	});
};

export { REG_XML_DECL, REG_CDATA_SECT, REG_OTHER_SECT, REG_DOCTYPE, REG_OTHER_DECL, REG_COMMENTS, REG_START_TAG, REG_END_TAG, REG_ATTR };
