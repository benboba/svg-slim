(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['xml-parser'] = {}));
}(this, (function (exports) { 'use strict';

	/*
	 * 除了 EndTag ，其它值都来自标准：
	 * https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
	 */
	(function (NodeType) {
	    NodeType[NodeType["EndTag"] = -1] = "EndTag";
	    NodeType[NodeType["Tag"] = 1] = "Tag";
	    NodeType[NodeType["Text"] = 3] = "Text";
	    NodeType[NodeType["CDATA"] = 4] = "CDATA";
	    NodeType[NodeType["OtherSect"] = 5] = "OtherSect";
	    NodeType[NodeType["OtherDecl"] = 6] = "OtherDecl";
	    NodeType[NodeType["XMLDecl"] = 7] = "XMLDecl";
	    NodeType[NodeType["Comments"] = 8] = "Comments";
	    NodeType[NodeType["Document"] = 9] = "Document";
	    NodeType[NodeType["DocType"] = 10] = "DocType";
	})(exports.NodeType || (exports.NodeType = {}));

	const mixWhiteSpace = (str) => str.replace(/\s+/g, ' ');

	class Node {
	    constructor(option) {
	        this.nodeName = option.nodeName;
	        this.nodeType = option.nodeType;
	        this.namespace = option.namespace;
	        this.selfClose = option.selfClose;
	        this.textContent = option.textContent;
	        if (this.nodeType === exports.NodeType.Tag || this.nodeType === exports.NodeType.Document) {
	            this.attributes = [];
	            this.childNodes = [];
	        }
	    }
	    // 复制自身，但是不复制节点树关系链
	    cloneNode() {
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
	    appendChild(childNode) {
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
	    insertBefore(childNode, previousTarget) {
	        if (this.childNodes) {
	            // 如果子节点原本有父节点，则先从原本的父节点中移除
	            if (childNode.parentNode) {
	                childNode.parentNode.removeChild(childNode);
	            }
	            // 判断目标节点是否在自己的子节点列表中，如果不在，直接插入
	            const pindex = this.childNodes.indexOf(previousTarget);
	            if (pindex !== -1) {
	                this.childNodes.splice(pindex, 0, childNode);
	            }
	            else {
	                this.childNodes.push(childNode);
	            }
	            childNode.parentNode = this;
	        }
	    }
	    // 替换子节点
	    replaceChild(childNode, ...children) {
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
	    removeChild(childNode) {
	        if (this.childNodes) {
	            const index = this.childNodes.indexOf(childNode);
	            if (index !== -1) {
	                this.childNodes.splice(index, 1);
	                delete childNode.parentNode;
	            }
	        }
	    }
	    // 是否存在属性
	    hasAttribute(name, namespace) {
	        if (this.attributes) {
	            for (const attr of this.attributes) {
	                if (!namespace) {
	                    if (attr.fullname === name) {
	                        return true;
	                    }
	                }
	                else {
	                    if (attr.name === name && attr.namespace === namespace) {
	                        return true;
	                    }
	                }
	            }
	        }
	        return false;
	    }
	    getAttribute(name, namespace) {
	        if (this.attributes) {
	            for (const attr of this.attributes) {
	                if (!namespace) {
	                    if (attr.fullname === name) {
	                        return attr.value;
	                    }
	                }
	                else {
	                    if (attr.name === name && attr.namespace === namespace) {
	                        return attr.value;
	                    }
	                }
	            }
	        }
	        return null;
	    }
	    setAttribute(name, value, namespace) {
	        if (this.attributes) {
	            for (const attr of this.attributes) {
	                if (!namespace) {
	                    if (attr.fullname === name) {
	                        attr.value = value;
	                        return;
	                    }
	                }
	                else {
	                    if (attr.name === name && attr.namespace === namespace) {
	                        attr.value = value;
	                        return;
	                    }
	                }
	            }
	            const newAttr = {
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
	    removeAttribute(name, namespace) {
	        if (this.attributes) {
	            for (let i = this.attributes.length; i--;) {
	                const attr = this.attributes[i];
	                if (!namespace) {
	                    if (attr.fullname === name) {
	                        this.attributes.splice(i, 1);
	                        return;
	                    }
	                }
	                else {
	                    if (attr.name === name && attr.namespace === namespace) {
	                        this.attributes.splice(i, 1);
	                        return;
	                    }
	                }
	            }
	        }
	    }
	}

	let supportUnicode = true;
	try {
	    supportUnicode = /\u{20BB7}/u.test('𠮷');
	}
	catch (e) {
	    supportUnicode = false;
	}
	const NameStartChar = `:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD${supportUnicode ? '\\u{10000}-\\u{EFFFF}' : ''}`;
	const NameChar = `${NameStartChar}\\-\\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040`;
	const Name = `[${NameStartChar}][${NameChar}]*`;
	const Eq = '\\s*=\\s*';
	const VersionNum = '1\\.[0-9]+';
	const EncName = '[A-Za-z](?:[A-Za-z0-9\\._]|-)*';
	const VersionInfo = `\\s+version${Eq}(?:'${VersionNum}'|"${VersionNum}")`;
	const EncodingDecl = `\\s+encoding${Eq}(?:'${EncName}'|"${EncName}")`;
	const SDDecl = `\\s+standalone${Eq}(?:'(?:yes|no)'|"(?:yes|no)")`;
	const Reference = `(?:&${Name};|&#[0-9]+;|&#x[0-9a-fA-F]+;)`;
	const AttrVal = `"(?:[^<&"]|${Reference})*"|'(?:[^<&']|${Reference})*'`;
	const DeclContent = '(?:[^<>\'"]+|[^<>\']*\'[^\']*\'[^<>\']*|[^<>"]*"[^"]*"[^<>"]*|[^<>\'"]*<[^<>]*>[^<>\'"]*)+?';
	const REG_XML_DECL = new RegExp(`<\\?xml(${VersionInfo}(?:${EncodingDecl})?(?:${SDDecl})?\\s*)\\?>`, 'g');
	const REG_CDATA_SECT = /<!\[CDATA\[([\d\D]*?)\]\]>/g;
	const REG_OTHER_SECT = /<!\[\s?([A-Z]+)\s?\[([\d\D]*?)\]\]>/g;
	const REG_DOCTYPE = new RegExp(`<!DOCTYPE\\s+(${DeclContent})>`, 'g');
	const REG_OTHER_DECL = new RegExp(`<!([A-Z]+)\\s+(${DeclContent})>`, 'g');
	const REG_COMMENTS = /<!--([\d\D]*?)-->/g;
	const REG_START_TAG = new RegExp(`<(${Name})((?:\\s+${Name}${Eq}(?:${AttrVal}))*)\\s*(\\/?)>`, supportUnicode ? 'gu' : 'g');
	const REG_END_TAG = new RegExp(`</(${Name})\\s*>`, supportUnicode ? 'gu' : 'g');
	const REG_ATTR = new RegExp(`(?:^|\\s)(${Name})${Eq}(${AttrVal})`, supportUnicode ? 'gu' : 'g');

	const collapseQuot = (str) => str.slice(1, -1);

	const configs = [
	    [1, 'xml-decl', REG_XML_DECL, exports.NodeType.XMLDecl],
	    [1, 'cdata', REG_CDATA_SECT, exports.NodeType.CDATA],
	    [2, REG_OTHER_SECT, exports.NodeType.OtherSect],
	    [1, 'doctype', REG_DOCTYPE, exports.NodeType.DocType],
	    [2, REG_OTHER_DECL, exports.NodeType.OtherDecl],
	    [1, 'comments', REG_COMMENTS, exports.NodeType.Comments],
	];
	const updStatus = (pos, str, status) => {
	    for (; status.lastpos < pos; status.lastpos++) {
	        if (str[status.lastpos] === '\r' || str[status.lastpos] === '\n') {
	            // 换行判断，\r 直接换行，\n 判断一下是不是紧跟在 \r 后面
	            if (str[status.lastpos] === '\r' || str[status.lastpos - 1] !== '\r') {
	                status.line++;
	                status.pos = 0;
	            }
	        }
	        else {
	            status.pos++;
	        }
	    }
	};
	// 应对一个捕获组的状况
	const Process1 = (conf, str, lastIndex) => {
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
	const Process2 = (conf, str, lastIndex) => {
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
	const ProcessTag = (str, status, lastIndex) => {
	    REG_START_TAG.lastIndex = lastIndex;
	    const execResult = REG_START_TAG.exec(str);
	    if (execResult && execResult.index === lastIndex) {
	        const tempStatus = { line: status.line, pos: status.pos, lastpos: 0 };
	        const result = {
	            node: new Node({
	                nodeType: exports.NodeType.Tag,
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
	            }
	            else {
	                result.node.nodeName = tagName[1];
	                result.node.namespace = tagName[0];
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
	                throw new Error(`Duplicate property names! at ${tempStatus.line}:${tempStatus.pos}`);
	            }
	            attrUnique[attrExec[1]] = true;
	            if (attrExec[1].includes(':')) {
	                const attrName = attrExec[1].split(':');
	                if (attrName.length === 2 && attrName[0] && attrName[1]) {
	                    result.node.setAttribute(attrName[1], collapseQuot(attrExec[2]).trim(), attrName[0]);
	                }
	                else {
	                    throw new Error(`Wrong attribute name! at ${tempStatus.line + status.line - 1}:${tempStatus.line > 1 ? tempStatus.pos : status.pos + tempStatus.pos}`);
	                }
	            }
	            else {
	                result.node.setAttribute(attrExec[1], collapseQuot(attrExec[2]).trim());
	            }
	            attrExec = REG_ATTR.exec(execResult[2]);
	        }
	        return result;
	    }
	    return null;
	};
	const ProcessEndTag = (str, status, lastIndex) => {
	    REG_END_TAG.lastIndex = lastIndex;
	    const execResult = REG_END_TAG.exec(str);
	    if (execResult && execResult.index === lastIndex) {
	        const result = {
	            node: new Node({
	                nodeType: exports.NodeType.EndTag,
	                nodeName: execResult[1],
	                namespace: '',
	            }),
	            lastIndex: REG_END_TAG.lastIndex,
	        };
	        if (execResult[1].includes(':')) {
	            const tagName = execResult[1].split(':');
	            if (tagName.length !== 2 || !tagName[1] || !tagName[0]) {
	                throw new Error(`Wrong end tag! at ${status.line}:${status.pos}`);
	            }
	            else {
	                result.node.nodeName = tagName[1];
	                result.node.namespace = tagName[0];
	            }
	        }
	        return result;
	    }
	    return null;
	};
	const parse = (str, status, lastIndex) => {
	    const REG_LT = /</g;
	    REG_LT.lastIndex = lastIndex;
	    const ltExec = REG_LT.exec(str);
	    if (ltExec) {
	        if (ltExec.index === lastIndex) { // 以 < 开始的情况都按节点处理
	            for (const cfg of configs) {
	                if (cfg[0] === 1) {
	                    const processResult1 = Process1(cfg, str, lastIndex);
	                    if (processResult1) {
	                        return processResult1;
	                    }
	                }
	                else {
	                    const processResult2 = Process2(cfg, str, lastIndex);
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
	        }
	        else { // 非 < 开始的都按文本处理
	            return {
	                node: new Node({
	                    nodeType: exports.NodeType.Text,
	                    nodeName: '#text',
	                    textContent: mixWhiteSpace(str.slice(lastIndex, ltExec.index)),
	                }),
	                lastIndex: ltExec.index,
	            };
	        }
	    }
	    else {
	        return {
	            node: new Node({
	                nodeType: exports.NodeType.Text,
	                nodeName: '#text',
	                textContent: mixWhiteSpace(str.slice(lastIndex)),
	            }),
	            lastIndex: str.length,
	        };
	    }
	};
	const Parser = async (str) => {
	    return new Promise((resolve, reject) => {
	        const doc = new Node({
	            nodeType: exports.NodeType.Document,
	            nodeName: '#document',
	        });
	        const stack = [];
	        const status = {
	            line: 1,
	            pos: 0,
	            lastpos: 0,
	        };
	        const len = str.length;
	        let current;
	        let hasRoot = false;
	        const firstIndex = str.indexOf('<');
	        if (firstIndex > 0 && !/^\s+</.test(str)) {
	            reject(new Error(`Unexpected text node! at ${status.line}:${status.pos}`));
	            return;
	        }
	        try {
	            current = parse(str, status, firstIndex); // 第一个 < 之前的全部字符都忽略掉
	        }
	        catch (e) {
	            reject(e);
	            return;
	        }
	        if (current.node.nodeType === exports.NodeType.XMLDecl && firstIndex > 0) {
	            reject(new Error(`The xml declaration must be at the front of the document! at ${status.line}:${status.pos}`));
	            return;
	        }
	        doc.appendChild(current.node);
	        if (current.node.nodeType === exports.NodeType.Tag) {
	            hasRoot = true;
	            if (!current.node.selfClose) {
	                stack.push(current.node);
	            }
	        }
	        while (current.lastIndex < len) {
	            updStatus(current.lastIndex, str, status);
	            try {
	                current = parse(str, status, current.lastIndex); // 第一个 < 之前的全部字符都忽略掉
	            }
	            catch (e) {
	                reject(e);
	                return;
	            }
	            const stackLen = stack.length;
	            if (current.node.nodeType === exports.NodeType.EndTag) {
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
	                    }
	                    else {
	                        reject(new Error(`The start and end tags cannot match! at ${status.line}:${status.pos}`));
	                        return;
	                    }
	                }
	                else {
	                    // 没有开始标签而出现了结束标签
	                    reject(new Error(`Unexpected end tag! at ${status.line}:${status.pos}`));
	                    return;
	                }
	            }
	            else {
	                if (stackLen) {
	                    // 插入子节点
	                    stack[stackLen - 1].appendChild(current.node);
	                }
	                else if (current.node.nodeType === exports.NodeType.Text || current.node.nodeType === exports.NodeType.CDATA) {
	                    // 没有节点而出现了非空文本节点
	                    if (current.node.textContent.replace(/\s/g, '')) {
	                        reject(new Error(`Unexpected text node! at ${status.line}:${status.pos}`));
	                        return;
	                    }
	                }
	                else {
	                    // 直接扔到根下
	                    doc.appendChild(current.node);
	                }
	                // 遇到未闭合的节点，扔到stack内
	                if (current.node.nodeType === exports.NodeType.Tag) {
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

	exports.parse = Parser;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
