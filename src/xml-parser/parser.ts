import { NodeType } from '../node/index';
import { Node } from './node';

import { REG_XML_DECL, REG_CDATA_SECT, REG_OTHER_SECT, REG_DOCTYPE, REG_OTHER_DECL, REG_COMMENTS, REG_START_TAG, REG_END_TAG, REG_ATTR } from './regs';

import { collapseQuot } from './utils';
import { mixWhiteSpace } from '../slimming/utils/mix-white-space';

const configs = [
	[1, 'xml-decl', REG_XML_DECL, NodeType.XMLDecl],
	[1, 'cdata', REG_CDATA_SECT, NodeType.CDATA],
	[2, REG_OTHER_SECT, NodeType.OtherSect],
	[1, 'doctype', REG_DOCTYPE, NodeType.DocType],
	[2, REG_OTHER_DECL, NodeType.OtherDecl],
	[1, 'comments', REG_COMMENTS, NodeType.Comments],
];

const updStatus = (pos: number, str: string, status) => {
	for (; status.lastpos < pos; status.lastpos++) {
		if (str[status.lastpos] === '\n') {
			status.line++;
			status.pos = 0;
		} else {
			status.pos++;
		}
	}
};

// 应对一个捕获组的状况
const Process1 = (conf, str): { node:Node, str: string } => {
	const reg = conf[2] as RegExp;
	if (reg.test(str)) {
		const execResult = reg.exec(str);
		return {
			node: new Node({
				nodeType: conf[3],
				nodeName: `#${conf[1]}`,
				textContent: execResult[1]
			}),
			str: str.slice(execResult[0].length)
		};
	}
	return null;
};


// 应对两个捕获组的状况
const Process2 = (conf, str): { node:Node, str: string } => {
	const reg = conf[1];
	if (reg.test(str)) {
		const execResult = reg.exec(str);
		return {
			node: new Node({
				nodeType: conf[2],
				nodeName: `#${execResult[1].toLowerCase()}`,
				textContent: execResult[2]
			}),
			str: str.slice(execResult[0].length)
		};
	}
	return null;
};

interface IStatus {
	line: number;
	pos: number;
	lastpos: number;
}


// 处理标签
const ProcessTag = (str: string, status: IStatus):  { node:Node, str: string } => {
	if (REG_START_TAG.test(str)) {

		const tempStatus: IStatus = { line: status.line, pos: status.pos, lastpos: 0 };

		const execResult = REG_START_TAG.exec(str);
		const result = {
			node: new Node({
				nodeType: NodeType.Tag,
				nodeName: execResult[1],
				namespace: '',
				selfClose: execResult[3] === '/'
			}),
			str: str.slice(execResult[0].length)
		};

		// 标签的 namespace
		if (execResult[1].indexOf(':') !== -1) {
			const tagName = execResult[1].split(':');
			if (!tagName[1]) {
				throw new Error(`错误的开始标签！ 在第 ${status.line} 行第 ${status.pos} 位`);
			} else {
				result.node.nodeName = tagName[1];
				if (tagName[0]) {
					result.node.namespace = tagName[0];
				}
			}
		}

		updStatus(execResult[1].length + 1, execResult[0], tempStatus);

		// ** 重要 ** 重置匹配位置！
		REG_ATTR.lastIndex = 0;

		let attrExec = REG_ATTR.exec(execResult[2]);
		const attrUnique = {};
		while (attrExec) {
			updStatus(attrExec.index + execResult[1].length + 1, execResult[0], tempStatus);

			// 属性名排重
			if (attrUnique[attrExec[1]]) {
				throw new Error(`属性名重复！ 在第 ${tempStatus.line} 行第 ${tempStatus.pos} 位`);
			}
			attrUnique[attrExec[1]] = true;

			if (attrExec[1].indexOf(':') !== -1) {
				const attrName = attrExec[1].split(':');
				if (attrName[1]) {
					result.node.setAttribute(attrName[1], collapseQuot(attrExec[2]).trim(), attrName[0]);
				} else {
					throw new Error(`错误的属性名！ 在第 ${tempStatus.line + status.line - 1} 行第 ${tempStatus.line > 1 ? tempStatus.pos : status.pos + tempStatus.pos} 位`);
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


const ProcessEndTag = (str: string, status: IStatus):  { node:Node, str: string } => {
	if (REG_END_TAG.test(str)) {
		const execResult = REG_END_TAG.exec(str);
		const result = {
			node: new Node({
				nodeType: NodeType.EndTag,
				nodeName: execResult[1],
				namespace: '',
			}),
			str: str.slice(execResult[0].length)
		};
		if (execResult[1].indexOf(':') !== -1) {
			const tagName = execResult[1].split(':');
			if (!tagName[1]) {
				throw new Error(`错误的结束标签！ 在第 ${status.line} 行第 ${status.pos} 位`);
			} else {
				result.node.nodeName = tagName[1];
				if (tagName[0]) {
					result.node.namespace = tagName[0];
				}
			}
		}
		return result;
	}
	return null;
};


const parse = (str: string, status: IStatus): { node:Node, str: string } => {
	const startCharPos = str.indexOf('<');
	if (startCharPos === 0) { // 以 < 开始的情况都按节点处理

		for (const cfg of configs) {
			if (cfg[0] === 1) {
				const processResult1 = Process1(cfg, str);
				if (processResult1) {
					return processResult1;
				}
			} else {
				const processResult2 = Process2(cfg, str);
				if (processResult2) {
					return processResult2;
				}
			}
		}

		const processTag = ProcessTag(str, status);
		if (processTag) {
			return processTag;
		}

		const processEndTag = ProcessEndTag(str, status);
		if (processEndTag) {
			return processEndTag;
		}
		throw new Error(`解析标签失败！ 在第 ${status.line} 行第 ${status.pos} 位`);

	} else { // 非 < 开始的都按文本处理

		return {
			node: new Node({
				nodeType: NodeType.Text,
				nodeName: '#text',
				textContent: mixWhiteSpace(str.slice(0, startCharPos)),
			}),
			str: startCharPos === -1 ? '' : str.slice(startCharPos)
		};


	}
};

export function Parser(str: string): Promise<Node> {

	return new Promise((resolve, reject) => {
		const doc = new Node({
			nodeType: NodeType.Document,
			nodeName: '#document'
		});
		const stack: Node[] = [];
		const status: IStatus = {
			line: 1,
			pos: 0,
			lastpos: 0
		};

		let current;
		try {
			current = parse(str.slice(str.indexOf('<')), status); // 第一个 < 之前的全部字符都忽略掉
		} catch (e) {
			reject(e);
		}
		doc.appendChild(current.node);
		if (current.node.nodeType === NodeType.Tag && !current.node.selfClose) {
			stack.push(current.node);
		}

		while (current.str) {

			updStatus(str.indexOf(current.str), str, status);
			try {
				current = parse(current.str, status); // 第一个 < 之前的全部字符都忽略掉
			} catch (e) {
				reject(e);
				break;
			}

			const stackLen = stack.length;

			if (current.node.nodeType === NodeType.EndTag) {

				// 遇到结束标签的处理逻辑
				if (stackLen) {
					// 结束标签和开始标签匹配
					if (stack[stackLen - 1].nodeName === current.node.nodeName && stack[stackLen - 1].namespace === current.node.namespace) {
						// 无子节点，则转为自闭合节点
						if (!stack[stackLen - 1].childNodes.length) {
							stack[stackLen - 1].selfClose = true;
						}
						stack.pop();
					} else {
						reject(new Error(`开始和结束标签无法匹配！ 在第 ${status.line} 行第 ${status.pos} 位`));
					}
				} else {
					// 没有开始标签而出现了结束标签
					reject(new Error(`意外的结束标签！ 在第 ${status.line} 行第 ${status.pos} 位`));
				}


			} else {


				if (stackLen) {
					// 插入子节点
					stack[stackLen - 1].appendChild(current.node);
				} else if (current.node.nodeType === NodeType.Text || current.node.nodeType === NodeType.CDATA) {
					// 没有节点而出现了非空文本节点
					if (current.node.textContent.replace(/\s/g, '')) {
						reject(new Error(`意外的文本节点！ 在第 ${status.line} 行第 ${status.pos} 位`));
					}
				} else {
					// 直接扔到根下
					doc.appendChild(current.node);
				}
				// 遇到未闭合的节点，扔到stack内
				if (current.node.nodeType === NodeType.Tag && !current.node.selfClose) {
					stack.push(current.node);
				}


			}

			if (!current.str) {
				updStatus(str.length, str, status);
			}

		}

		if (stack.length) {
			reject(new Error(`文档结构错误！ 在第 ${status.line} 行第 ${status.pos} 位`));
		}

		resolve(doc);
	});
}

export { REG_XML_DECL, REG_CDATA_SECT, REG_OTHER_SECT, REG_DOCTYPE, REG_OTHER_DECL, REG_COMMENTS, REG_START_TAG, REG_END_TAG, REG_ATTR };