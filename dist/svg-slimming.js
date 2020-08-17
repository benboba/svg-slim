(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ramda'), require('css'), require('he')) :
	typeof define === 'function' && define.amd ? define(['ramda', 'css', 'he'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['svg-slimming'] = factory(global.ramda, global.css, global.he));
}(this, (function (ramda, css, he) { 'use strict';

	/*
	 * 除了 EndTag ，其它值都来自标准：
	 * https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
	 */
	var NodeType;
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
	})(NodeType || (NodeType = {}));

	class Node {
	    constructor(option) {
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
	                if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {
	                    return true;
	                }
	            }
	        }
	        return false;
	    }
	    getAttribute(name, namespace) {
	        if (this.attributes) {
	            for (const attr of this.attributes) {
	                if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {
	                    return attr.value;
	                }
	            }
	        }
	        return null;
	    }
	    setAttribute(name, value, namespace) {
	        if (this.attributes) {
	            for (const attr of this.attributes) {
	                if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {
	                    attr.value = value;
	                    return;
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
	                if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {
	                    this.attributes.splice(i, 1);
	                    break;
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
	// tslint:disable-next-line
	const DeclContent = `(?:[^<>'"]+|[^<>']*'[^']*'[^<>']*|[^<>"]*"[^"]*"[^<>"]*|[^<>'"]*<[^<>]*>[^<>'"]*)+?`;
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

	const mixWhiteSpace = (str) => str.replace(/\s+/g, ' ');

	const configs = [
	    [1, 'xml-decl', REG_XML_DECL, NodeType.XMLDecl],
	    [1, 'cdata', REG_CDATA_SECT, NodeType.CDATA],
	    [2, REG_OTHER_SECT, NodeType.OtherSect],
	    [1, 'doctype', REG_DOCTYPE, NodeType.DocType],
	    [2, REG_OTHER_DECL, NodeType.OtherDecl],
	    [1, 'comments', REG_COMMENTS, NodeType.Comments],
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
	                    nodeType: NodeType.Text,
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
	                nodeType: NodeType.Text,
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
	            nodeType: NodeType.Document,
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
	            }
	            catch (e) {
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
	                else if (current.node.nodeType === NodeType.Text || current.node.nodeType === NodeType.CDATA) {
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

	const rmNode = (node) => {
	    if (node.parentNode) {
	        node.parentNode.removeChild(node);
	    }
	};

	/*
	 * 遍历所有的 Node 节点，并对符合条件的节点执行操作
	 * @param { function } 条件
	 * @param { function } 回调
	 * @param { Node } 目标节点
	 */
	const traversal = (condition, cb, node, breakImmediate) => {
	    // 此处不能用 forEach ，for 循环可以避免当前节点被移除导致下一个节点不会被遍历到的问题
	    if (node.childNodes) {
	        for (let i = 0; i < node.childNodes.length;) {
	            const childNode = node.childNodes[i];
	            if (condition(childNode)) {
	                cb(childNode);
	                if (childNode === node.childNodes[i]) {
	                    traversal(condition, cb, childNode, breakImmediate);
	                    i++;
	                }
	            }
	            else {
	                if (!breakImmediate) {
	                    traversal(condition, cb, childNode, breakImmediate);
	                }
	                i++;
	            }
	        }
	    }
	};
	const traversalNode = (condition, cb, dom, breakImmediate = false) => {
	    traversal(condition, cb, dom, breakImmediate);
	};

	// 合并多个 script 标签，并将内容合并为一个子节点
	const combineScript = async (dom) => new Promise((resolve, reject) => {
	    let firstScript;
	    let lastChildNode;
	    const checkCNode = (node) => {
	        for (let i = 0; i < node.childNodes.length; i++) {
	            const cNode = node.childNodes[i];
	            if (cNode.nodeType !== NodeType.Text && cNode.nodeType !== NodeType.CDATA) {
	                rmNode(cNode);
	                i--;
	            }
	            else {
	                cNode.textContent = mixWhiteSpace(cNode.textContent.trim());
	                if (cNode.nodeType === NodeType.Text) {
	                    cNode.nodeType = NodeType.CDATA;
	                }
	                if (!lastChildNode) {
	                    lastChildNode = cNode;
	                }
	                else {
	                    if (lastChildNode.textContent.slice(-1) !== ';') {
	                        lastChildNode.textContent += ';';
	                    }
	                    lastChildNode.textContent += cNode.textContent;
	                    rmNode(cNode);
	                    i--;
	                }
	            }
	        }
	    };
	    traversalNode(ramda.propEq('nodeName', 'script'), node => {
	        const type = node.getAttribute('type');
	        if (type && !/^(?:application|text)\/(?:javascript|ecmascript)$/.test(type)) {
	            rmNode(node);
	            return;
	        }
	        if (firstScript) {
	            checkCNode(node);
	            rmNode(node);
	        }
	        else {
	            firstScript = node;
	            checkCNode(node);
	        }
	    }, dom);
	    if (firstScript) {
	        const childNodes = firstScript.childNodes;
	        if (childNodes.length === 0 || !childNodes[0].textContent || !childNodes[0].textContent.replace(/\s/g, '')) {
	            // 如果内容为空，则移除 script 节点
	            rmNode(firstScript);
	        }
	        else {
	            const textContent = childNodes[0].textContent;
	            if (!textContent.includes('<')) {
	                // 如果没有危险代码，则由 CDATA 转为普通文本类型
	                childNodes[0].nodeType = NodeType.Text;
	            }
	            if (textContent.slice(-1) === ';') {
	                // 移除尾分号
	                childNodes[0].textContent = childNodes[0].textContent.slice(0, -1);
	            }
	            // 把 script 标签插入到最后
	            traversalNode(ramda.propEq('nodeName', 'svg'), node => {
	                node.appendChild(firstScript);
	            }, dom);
	        }
	    }
	    resolve();
	});

	/*
	 * 深度遍历所有的 Object 属性
	 * @param { function } 条件
	 * @param { function } 回调
	 * @param { object } 目标对象
	 * @param { object[] } 避免对象调用自身造成死循环
	 * @param { boolean } 是否深度优先，是的话会先遍历子元素
	 */
	const traversal$1 = (condition, cb, obj, path, visited, deep) => {
	    if (visited.includes(obj)) {
	        return;
	    }
	    visited.push(obj);
	    if (!deep) {
	        if (condition(obj)) {
	            cb(obj, path);
	            return;
	        }
	    }
	    path.push(obj);
	    if (Array.isArray(obj)) {
	        for (let i = 0; i < obj.length;) {
	            const item = obj[i];
	            traversal$1(condition, cb, item, path, visited, deep);
	            if (item === obj[i]) {
	                i++;
	            }
	        }
	    }
	    else {
	        for (const key in obj) {
	            if (typeof obj[key] === 'object') { // tslint:disable-line strict-type-predicates
	                traversal$1(condition, cb, obj[key], path, visited, deep);
	            }
	        }
	    }
	    path.pop();
	    if (deep) {
	        if (condition(obj)) {
	            cb(obj, path);
	        }
	    }
	};
	const traversalObj = (condition, cb, obj, deep = false) => {
	    traversal$1(condition, cb, obj, [], [], deep);
	};

	// elements group
	const animationElements = ['animate', 'animateMotion', 'animateTransform', 'discard', 'set'];
	const animationAttrElements = ['animate', 'animateTransform', 'set'];
	const descriptiveElements = ['desc', 'metadata', 'title'];
	const gradientElements = ['linearGradient', 'radialGradient'];
	const filterPrimitiveElements = ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence'];
	const transferFunctionElements = ['feFuncR', 'feFuncG', 'feFuncB', 'feFuncA'];
	const lightSourceElements = ['feDistantLight', 'fePointLight', 'feSpotLight'];
	const paintServerElements = ['solidcolor', 'linearGradient', 'radialGradient', 'meshgradient', 'pattern', 'hatch'];
	const shapeElements = ['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'];
	const structuralElements = ['defs', 'g', 'svg', 'symbol', 'use'];
	const textContentChildElements = ['tspan', 'textPath'];
	const textContentElements = ['text'].concat(textContentChildElements);
	const graphicsElements = ['audio', 'canvas', 'circle', 'ellipse', 'foreignObject', 'iframe', 'image', 'line', 'mesh', 'path', 'polygon', 'polyline', 'rect', 'text', 'textPath', 'tspan', 'video'];
	const containerElements = ['a', 'clipPath', 'defs', 'g', 'marker', 'mask', 'pattern', 'svg', 'switch', 'symbol', 'unknown'];
	const newViewportsElements = ['svg', 'symbol', 'foreignObject', 'video', 'audio', 'canvas', 'image', 'iframe'];
	const unnecessaryElements = ['desc', 'discard', 'foreignObject', 'video', 'audio', 'iframe', 'canvas', 'metadata', 'script', 'style', 'title', 'unknown', 'image'];
	// attributes group
	// https://www.w3.org/TR/SVG2/interact.html#EventAttributes
	const eventAttributes = ['onabort', 'onafterprint', 'onbeforeprint', 'onbegin', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onend', 'onended', 'onerror', 'onerror', 'onfocus', 'onfocusin', 'onfocusout', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmessage', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpause', 'onplay', 'onplaying', 'onpopstate', 'onprogress', 'onratechange', 'onrepeat', 'onreset', 'onresize', 'onresize', 'onscroll', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onunload', 'onunload', 'onvolumechange', 'onwaiting'];
	// https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant
	const ariaAttributes = ['aria-activedescendant', 'aria-atomic', 'aria-busy', 'aria-checked', 'aria-colcount', 'aria-colindex', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-modal', 'aria-multiline', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowcount', 'aria-rowindex', 'aria-rowspan', 'aria-selected', 'aria-setsize', 'aria-sort', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext', 'role'];
	const animationAttributes = ['from', 'to', 'by', 'values'];
	const transformAttributes = ['gradientTransform', 'patternTransform', 'transform'];
	const cantCollapseAttributes = ['id', 'class', 'mask', 'style'];
	const conditionalProcessingAttributes = ['requiredExtensions', 'systemLanguage'];
	const coreAttributes = ['id', 'tabindex', 'lang', 'xml:space', 'class', 'style', 'transform'];
	const deprecatedXlinkAttributes = ['xlink:href', 'xlink:title'];
	const animationAdditionAttributes = ['additive', 'accumulate'];
	const animationTimingAttributes = ['begin', 'dur', 'end', 'min', 'max', 'restart', 'repeatCount', 'repeatDur', 'fill'];
	const animationValueAttributes = ['calcMode', 'values', 'keyTimes', 'keySplines', 'from', 'to', 'by'];
	const rectAttributes = ['x', 'y', 'width', 'height'];
	const transferFunctionElementAttributes = ['type', 'tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset'];
	const validPseudoClass = ['hover', 'link', 'active', 'visited', 'focus', 'first-child', 'lang', 'not'];
	const validPseudoElement = ['first-letter', 'first-line'];

	// 用于属性合法性验证的枚举类型（此处存储方便直接转换为正则的字符串形式）
	const calcMode = 'discrete|linear|paced|spline';
	const units = 'userSpaceOnUse|objectBoundingBox';
	const crossOrigin = 'anonymous|use-credentials';
	const dur = 'media|indefinite';
	const edgeMode = 'duplicate|wrap|none';
	const inVal = 'SourceGraphic|SourceAlpha|BackgroundImage|BackgroundAlpha|FillPaint|StrokePaint';
	const lengthAdjust = 'spacing|spacingAndGlyphs';
	const markerUnit = 'strokeWidth|userSpaceOnUse';
	const method = 'align|stretch';
	const blendMode = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity';
	const operater = 'over|in|out|atop|xor|lighter|arithmetic';
	const operater1 = 'erode|dilate';
	const orient = 'auto|auto-start-reverse';
	const alignX = 'left|center|right';
	const alignY = 'top|center|bottom';
	const referrer = 'no-referrer|no-referrer-when-downgrade|same-origin|origin|strict-origin|origin-when-cross-origin|strict-origin-when-cross-origin|unsafe-url';
	const restart = 'always|whenNotActive|never';
	const spreadMethod = 'pad|reflect|repeat';
	const target = '_self|_parent|_top|_blank';
	const animateTransformType = 'translate|scale|rotate|skewX|skewY';
	const feColorMatrixType = 'matrix|saturate|hueRotate|luminanceToAlpha';
	const feFuncType = 'identity|table|discrete|linear|gamma';
	const feTurbulenceType = 'fractalNoise|turbulence';
	const channel = 'R|G|B|A';
	const isolationMode = 'auto|isolate';

	// 符合官方定义的 token
	// https://drafts.csswg.org/css-syntax-3
	// 是否支持 unicode
	let supportUnicode$1 = true;
	try {
	    supportUnicode$1 = /\u{20BB7}/u.test('𠮷');
	}
	catch (e) {
	    supportUnicode$1 = false;
	}
	const uModifier = supportUnicode$1 ? 'u' : '';
	// definition
	const commaWsp = '(?:\\s*,\\s*|\\s*)';
	const semi = '\\s*;\\s*';
	const paren = '\\s*\\(\\s*';
	const rParen = '\\s*\\)';
	// name token
	// https://www.w3.org/TR/xml/#NT-Name
	const NameStartChar$1 = `:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD${supportUnicode$1 ? '\\u{10000}-\\u{EFFFF}' : ''}`;
	const NameChar$1 = `${NameStartChar$1}\\-\\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040`;
	const Name$1 = `[${NameStartChar$1}][${NameChar$1}]*`;
	// css syntax
	// https://drafts.csswg.org/css-syntax-3/#non-ascii-code-point
	const cssNameStartChar = `A-Za-z_\\u0080-\\uFFFF${supportUnicode$1 ? '\\u{10000}-\\u{EFFFF}' : ''}`;
	const cssNameChar = `${cssNameStartChar}\\-0-9`;
	const cssName = `[${cssNameStartChar}][${cssNameChar}]*`;
	const nameFullMatch = new RegExp(`^${Name$1}$`, uModifier);
	const cssNameFullMatch = new RegExp(`^${cssName}$`, uModifier);
	const cssNameSpaceSeparatedFullMatch = new RegExp(`^${cssName}(?:\\s+${cssName})*$`, uModifier);
	// number token
	// https://www.w3.org/TR/css3-values/#length-value
	// https://www.w3.org/TR/css-syntax-3/#number-token-diagram
	// https://www.w3.org/TR/css-syntax-3/#percentage-token-diagram
	const numberPattern = '[+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?';
	const numberSequence = `${numberPattern}(?:${commaWsp}${numberPattern})*`;
	const numberGlobal = new RegExp(numberPattern, 'g');
	const numberFullMatch = new RegExp(`^${numberPattern}$`);
	const numberOptionalFullMatch = new RegExp(`^${numberPattern}(?:\\s*${numberPattern})?$`);
	const numberListFullMatch = new RegExp(`^${numberSequence}$`);
	const numberSemiSepatatedFullMatch = new RegExp(`^${numberPattern}(?:${semi}${numberPattern})*(?:${semi})?$`);
	const integerFullMatch = /^[+-]?(?:\d+|(?:\d*\.)?\d+[eE][+-]?\d+)$/;
	const pureNumOrWithPx = new RegExp(`^${numberPattern}(?:px)?$`);
	const pureNumOrWithPxList = new RegExp(`^${numberPattern}(?:px)?(?:${commaWsp}${numberPattern}(?:px)?)*$`);
	// https://www.w3.org/TR/css-values-3/#angle-value
	const angel = 'deg|grad|rad|turn';
	const angelFullMatch = new RegExp(`^${numberPattern}(?:${angel})?$`);
	const controlPoint = `${numberPattern}${commaWsp}${numberPattern}${commaWsp}${numberPattern}${commaWsp}${numberPattern}`;
	const controlPointsFullMatch = new RegExp(`^${controlPoint}(?:${semi}${controlPoint})*(?:${semi})?$`);
	const Units = '(?:em|ex|ch|rem|vx|vw|vmin|vmax|cm|mm|Q|in|pt|pc|px)';
	const percentageFullMatch = new RegExp(`^${numberPattern}%$`);
	const length = `${numberPattern}${Units}?`;
	const lengthPercentage = `(?:${length}|${numberPattern}%)`;
	const lengthPair = `${length}${commaWsp}${length}`;
	const lengthPairFullMatch = new RegExp(`^${lengthPair}$`);
	const lengthPairListFullMatch = new RegExp(`^${lengthPair}(?:${semi}${lengthPair})*$`);
	const lengthPercentageFullMatch = new RegExp(`^${lengthPercentage}$`);
	const lengthPercentageListFullMatch = new RegExp(`^${lengthPercentage}(?:${commaWsp}${lengthPercentage})*$`);
	const viewBoxFullMatch = new RegExp(`^${controlPoint}$`);
	// time token
	// https://svgwg.org/specs/animations/#BeginValueListSyntax
	const timeCountValue = '\\d+(?:\\.\\d+)?(?:h|min|s|ms)?';
	const timeValue = '(?:\\d+:)?[0-5]\\d:[0-5]\\d(?:\\.\\d+)?';
	const clockValue = `(?:${timeCountValue}|${timeValue})`;
	const offsetValue = `(?:\\s*[+-]\\s*)?${clockValue}`;
	const syncbaseValue = `${Name$1}\\.(?:begin|end)(?:${offsetValue})?`;
	const eventValue = `(?:${Name$1}\\.)?(?:${eventAttributes.join('|')})(?:${offsetValue})?`;
	const repeatValue = `(?:${Name$1}\\.)?repeat\\(\\d+\\)(?:${offsetValue})?`;
	const accessKeyValue = `accessKey\\(.\\)(?:${offsetValue})?`;
	const wallclockSyncValue = 'wallclock\\(\\d+\\)';
	const timePattern = `(?:${offsetValue}|${syncbaseValue}|${eventValue}|${repeatValue}|${accessKeyValue}|${wallclockSyncValue}|indefinite)`;
	const clockFullMatch = new RegExp(`^${clockValue}$`);
	const timeListFullMatch = new RegExp(`^${timePattern}(\\s*;\\s*${timePattern})*$`, uModifier);
	// transform token
	// https://drafts.csswg.org/css-transforms/#svg-comma
	const translate = `translate${paren}${numberPattern}(?:${commaWsp}?${numberPattern})?${rParen}`;
	const scale = `scale${paren}${numberPattern}(?:${commaWsp}?${numberPattern})?${rParen}`;
	const rotate = `rotate${paren}${numberPattern}(?:${commaWsp}?${numberPattern}${commaWsp}?${numberPattern})?${rParen}`;
	const skewX = `skewX${paren}${numberPattern}${rParen}`;
	const skewY = `skewY${paren}${numberPattern}${rParen}`;
	const matrix = `matrix${paren}${numberPattern}(?:${commaWsp}?${numberPattern}){5}${rParen}`;
	const transformListFullMatch = new RegExp(`^(?:\\s*(?:${translate}|${scale}|${rotate}|${skewX}|${skewY}|${matrix})\\s*)*$`);
	// uri token
	// http://www.ietf.org/rfc/rfc3986.txt
	const URIFullMatch = /^(?:[^:/?#]+\:)?(?:\/\/[^/?#]*)?(?:[^?#]*)(?:\?[^#]*)?(?:#.*)?$/;
	// https://tools.ietf.org/html/bcp47#section-2.1
	const langFullMatch = /^[a-zA-Z]{2,}(?:-[a-zA-Z0-9%]+)*$/;
	// https://drafts.csswg.org/css-syntax-3/#typedef-ident-token
	const hexDigit = '0-9a-fA-F';
	const newLine = '\\r\\n';
	const escape = `\\\\(?:[^${hexDigit}${newLine}]|[${hexDigit}]{1,6}\\s?)`;
	const indentToken = `(?:--|-?(?:[${cssNameStartChar}]|${escape}))(?:[${cssNameChar}]|${escape})*`;
	const indentFullMatch = new RegExp(`^${indentToken}$`, uModifier);
	// https://svgwg.org/svg2-draft/paths.html#PathDataBNF
	const pathZ = '[zZ]';
	const pathMTo = `[mM]\\s*${numberSequence}`;
	const pathTo = `[lLhHvVcCsSqQtTaA]\\s*${numberSequence}`;
	const pathPattern = `(?:${pathMTo}|${pathZ}|${pathTo})`;
	const pathFullMatch = new RegExp(`^${pathMTo}(?:${commaWsp}${pathPattern})*$`);
	const preservAspectRatioFullMatch = /^(?:none|xMinYMin|xMidYMin|xMaxYMin|xMinYMid|xMidYMid|xMaxYMid|xMinYMax|xMidYMax|xMaxYMax)(?:\s+(?:meet|slice))?$/;
	// IRI
	const funcIRIToID = /^url\((["']?)#(.+)\1\)$/;
	const IRIFullMatch = /^#(.+)$/;
	const mediaTypeFullMatch = /^(?:image|audio|video|application|text|multipart|message)\/[^\/]+$/;

	const shapeAndText = shapeElements.concat(textContentElements);
	const viewport = ['pattern', 'marker'].concat(newViewportsElements);
	const useContainerGraphics = ['use'].concat(containerElements, graphicsElements);
	const colorApply = ['animate'].concat(useContainerGraphics, gradientElements);
	// tslint:disable:max-file-line-count
	const _regularAttr = {
	    'accumulate': {
	        name: 'accumulate',
	        legalValues: [{
	                type: 'string',
	                value: 'none',
	            }, {
	                type: 'string',
	                value: 'sum',
	            }],
	        initValue: 'none',
	        applyTo: [],
	    },
	    'additive': {
	        name: 'additive',
	        legalValues: [{
	                type: 'string',
	                value: 'replace',
	            }, {
	                type: 'string',
	                value: 'sum',
	            }],
	        initValue: 'replace',
	        applyTo: [],
	    },
	    'amplitude': {
	        name: 'amplitude',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '1',
	        applyTo: [],
	    },
	    'attributeName': {
	        name: 'attributeName',
	        legalValues: [{
	                type: 'attr',
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'azimuth': {
	        name: 'azimuth',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'baseFrequency': {
	        name: 'baseFrequency',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberOptionalFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'begin': {
	        name: 'begin',
	        legalValues: [{
	                type: 'reg',
	                value: timeListFullMatch,
	            }],
	        initValue: '0s',
	        applyTo: [],
	    },
	    'bias': {
	        name: 'bias',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'by': {
	        name: 'by',
	        legalValues: [{
	                type: 'reg',
	                value: lengthPairFullMatch,
	                tag: ['animateMotion'],
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'calcMode': {
	        name: 'calcMode',
	        legalValues: [{
	                type: 'enum',
	                value: calcMode,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'class': {
	        name: 'class',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: cssNameSpaceSeparatedFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'clipPathUnits': {
	        name: 'clipPathUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: units,
	            }],
	        initValue: 'userSpaceOnUse',
	        applyTo: [],
	    },
	    'crossorigin': {
	        name: 'crossorigin',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: crossOrigin,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'cx': {
	        name: 'cx',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: [{
	                val: '50%',
	                tag: ['radialGradient'],
	            }, {
	                val: '0',
	                tag: ['circle', 'ellipse'],
	            }],
	        applyTo: ['circle', 'ellipse'],
	    },
	    'cy': {
	        name: 'cy',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: [{
	                val: '50%',
	                tag: ['radialGradient'],
	            }, {
	                val: '0',
	                tag: ['circle', 'ellipse'],
	            }],
	        applyTo: ['circle', 'ellipse'],
	    },
	    'd': {
	        name: 'd',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: pathFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'diffuseConstant': {
	        name: 'diffuseConstant',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '1',
	        applyTo: [],
	    },
	    'divisor': {
	        name: 'divisor',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'download': {
	        name: 'download',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: nameFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'dur': {
	        name: 'dur',
	        legalValues: [{
	                type: 'reg',
	                value: clockFullMatch,
	            }, {
	                type: 'enum',
	                value: dur,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'dx': {
	        name: 'dx',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	                tag: ['feOffset', 'feDropShadow'],
	            }, {
	                type: 'reg',
	                value: lengthPercentageListFullMatch,
	                tag: ['text', 'tspan'],
	            }],
	        initValue: [{
	                val: '2',
	                tag: ['feOffset', 'feDropShadow'],
	            }, {
	                val: '',
	                tag: ['tspan', 'text'],
	            }],
	        applyTo: [],
	    },
	    'dy': {
	        name: 'dy',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	                tag: ['feOffset', 'feDropShadow'],
	            }, {
	                type: 'reg',
	                value: lengthPercentageListFullMatch,
	                tag: ['text', 'tspan'],
	            }],
	        initValue: [{
	                val: '2',
	                tag: ['feOffset', 'feDropShadow'],
	            }, {
	                val: '',
	                tag: ['tspan', 'text'],
	            }],
	        applyTo: [],
	    },
	    'edgeMode': {
	        name: 'edgeMode',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: edgeMode,
	            }],
	        initValue: [{
	                val: 'duplicate',
	                tag: ['feConvolveMatrix'],
	            }, {
	                val: 'none',
	                tag: ['feGaussianBlur'],
	            }],
	        applyTo: [],
	    },
	    'elevation': {
	        name: 'elevation',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'end': {
	        name: 'end',
	        legalValues: [{
	                type: 'reg',
	                value: timeListFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'exponent': {
	        name: 'exponent',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '1',
	        applyTo: [],
	    },
	    'filterUnits': {
	        name: 'filterUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: units,
	            }],
	        initValue: 'objectBoundingBox',
	        applyTo: [],
	    },
	    'fr': {
	        name: 'fr',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: '0%',
	        applyTo: [],
	    },
	    'from': {
	        name: 'from',
	        legalValues: [{
	                type: 'reg',
	                value: lengthPairFullMatch,
	                tag: ['animateMotion'],
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'fx': {
	        name: 'fx',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'fy': {
	        name: 'fy',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'gradientTransform': {
	        name: 'gradientTransform',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: transformListFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'gradientUnits': {
	        name: 'gradientUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: units,
	            }],
	        initValue: 'objectBoundingBox',
	        applyTo: [],
	    },
	    'height': {
	        name: 'height',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: [{
	                val: '100%',
	                tag: filterPrimitiveElements.concat(['svg']),
	            }, {
	                val: '120%',
	                tag: ['filter', 'mask'],
	            }, {
	                val: '0',
	                tag: ['pattern', 'rect', 'foreignObject'],
	            }, {
	                val: 'auto',
	                tag: ['svg', 'image', 'rect', 'foreignObject'],
	            }],
	        applyTo: filterPrimitiveElements.concat(['filter', 'mask', 'pattern', 'svg', 'image', 'rect', 'foreignObject']),
	    },
	    'href': {
	        name: 'href',
	        animatable: true,
	        maybeIRI: true,
	        legalValues: [{
	                type: 'reg',
	                value: URIFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'hreflang': {
	        name: 'hreflang',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: langFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'id': {
	        name: 'id',
	        legalValues: [{
	                type: 'reg',
	                value: nameFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'in': {
	        name: 'in',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: inVal,
	            }, {
	                type: 'reg',
	                value: indentFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'in2': {
	        name: 'in2',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: inVal,
	            }, {
	                type: 'reg',
	                value: indentFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'intercept': {
	        name: 'intercept',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'isolation': {
	        name: 'isolation',
	        legalValues: [{
	                type: 'enum',
	                value: isolationMode,
	            }],
	        initValue: 'auto',
	        applyTo: [],
	    },
	    'k1': {
	        name: 'k1',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'k2': {
	        name: 'k2',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'k3': {
	        name: 'k3',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'k4': {
	        name: 'k4',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'kernelMatrix': {
	        name: 'kernelMatrix',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberListFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'kernelUnitLength': {
	        name: 'kernelUnitLength',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberOptionalFullMatch,
	            }],
	        initValue: '2 2',
	        applyTo: [],
	    },
	    'keyPoints': {
	        name: 'keyPoints',
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberSemiSepatatedFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'keySplines': {
	        name: 'keySplines',
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: controlPointsFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'keyTimes': {
	        name: 'keyTimes',
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberSemiSepatatedFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'lang': {
	        name: 'lang',
	        legalValues: [{
	                type: 'reg',
	                value: langFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'lengthAdjust': {
	        name: 'lengthAdjust',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: lengthAdjust,
	            }],
	        initValue: 'spacing',
	        applyTo: [],
	    },
	    'limitingConeAngle': {
	        name: 'limitingConeAngle',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'markerHeight': {
	        name: 'markerHeight',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: '3',
	        applyTo: [],
	    },
	    'markerUnits': {
	        name: 'markerUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: markerUnit,
	            }],
	        initValue: 'strokeWidth',
	        applyTo: [],
	    },
	    'markerWidth': {
	        name: 'markerWidth',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: '3',
	        applyTo: [],
	    },
	    'maskContentUnits': {
	        name: 'maskContentUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: units,
	            }],
	        initValue: 'userSpaceOnUse',
	        applyTo: [],
	    },
	    'maskUnits': {
	        name: 'maskUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: units,
	            }],
	        initValue: 'objectBoundingBox',
	        applyTo: [],
	    },
	    'max': {
	        name: 'max',
	        legalValues: [{
	                type: 'reg',
	                value: clockFullMatch,
	            }, {
	                type: 'string',
	                value: 'media',
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'media': {
	        name: 'media',
	        legalValues: [],
	        initValue: [{
	                val: 'all',
	                tag: ['css'],
	            }],
	        applyTo: [],
	    },
	    'method': {
	        name: 'method',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: method,
	            }],
	        initValue: 'align',
	        applyTo: [],
	    },
	    'min': {
	        name: 'min',
	        legalValues: [{
	                type: 'reg',
	                value: clockFullMatch,
	            }, {
	                type: 'string',
	                value: 'media',
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'mode': {
	        name: 'mode',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: blendMode,
	            }],
	        initValue: 'normal',
	        applyTo: [],
	    },
	    'numOctaves': {
	        name: 'numOctaves',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: integerFullMatch,
	            }],
	        initValue: '1',
	        applyTo: [],
	    },
	    'offset': {
	        name: 'offset',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }, {
	                type: 'reg',
	                value: percentageFullMatch,
	                tag: ['stop'],
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'operator': {
	        name: 'operator',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: operater,
	                tag: ['feComposite'],
	            }, {
	                type: 'enum',
	                value: operater1,
	                tag: ['feMorphology'],
	            }],
	        initValue: [{
	                val: 'over',
	                tag: ['feComposite'],
	            }, {
	                val: 'erode',
	                tag: ['feMorphology'],
	            }],
	        applyTo: [],
	    },
	    'order': {
	        name: 'order',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberOptionalFullMatch,
	            }],
	        initValue: '3',
	        applyTo: [],
	    },
	    'orient': {
	        name: 'orient',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }, {
	                type: 'reg',
	                value: angelFullMatch,
	            }, {
	                type: 'enum',
	                value: orient,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'path': {
	        name: 'path',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: pathFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'pathLength': {
	        name: 'pathLength',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'patternContentUnits': {
	        name: 'patternContentUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: units,
	            }],
	        initValue: 'userSpaceOnUse',
	        applyTo: [],
	    },
	    'patternTransform': {
	        name: 'patternTransform',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: transformListFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'patternUnits': {
	        name: 'patternUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: units,
	            }],
	        initValue: 'objectBoundingBox',
	        applyTo: [],
	    },
	    'ping': {
	        name: 'ping',
	        legalValues: [],
	        initValue: '',
	        applyTo: [],
	    },
	    'playbackorder': {
	        name: 'playbackorder',
	        legalValues: [{
	                type: 'string',
	                value: 'forwardonly',
	            }, {
	                type: 'string',
	                value: 'all',
	            }],
	        initValue: 'all',
	        applyTo: [],
	    },
	    'points': {
	        name: 'points',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberListFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'pointsAtX': {
	        name: 'pointsAtX',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'pointsAtY': {
	        name: 'pointsAtY',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'pointsAtZ': {
	        name: 'pointsAtZ',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'preserveAlpha': {
	        name: 'preserveAlpha',
	        animatable: true,
	        legalValues: [{
	                type: 'string',
	                value: 'false',
	            }, {
	                type: 'string',
	                value: 'true',
	            }],
	        initValue: 'false',
	        applyTo: [],
	    },
	    'preserveAspectRatio': {
	        name: 'preserveAspectRatio',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: preservAspectRatioFullMatch,
	            }],
	        initValue: [{
	                val: 'xMidYMid',
	                tag: ['canvas', 'feImage', 'image', 'marker', 'pattern', 'svg', 'symbol', 'view'],
	            }, {
	                val: 'xMidYMid meet',
	                tag: ['canvas', 'feImage', 'image', 'marker', 'pattern', 'svg', 'symbol', 'view'],
	            }],
	        applyTo: [],
	    },
	    'primitiveUnits': {
	        name: 'primitiveUnits',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: units,
	            }],
	        initValue: 'userSpaceOnUse.',
	        applyTo: [],
	    },
	    'r': {
	        name: 'r',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: [{
	                val: '50%',
	                tag: ['radialGradient'],
	            }, {
	                val: '0',
	                tag: ['circle'],
	            }],
	        applyTo: ['circle'],
	    },
	    'radius': {
	        name: 'radius',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberOptionalFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'refX': {
	        name: 'refX',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'enum',
	                value: alignX,
	            }],
	        initValue: [{
	                val: '0',
	                tag: ['marker'],
	            }],
	        applyTo: [],
	    },
	    'refY': {
	        name: 'refY',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'enum',
	                value: alignY,
	            }],
	        initValue: [{
	                val: '0',
	                tag: ['marker'],
	            }],
	        applyTo: [],
	    },
	    'referrerpolicy': {
	        name: 'referrerpolicy',
	        legalValues: [{
	                type: 'enum',
	                value: referrer,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'rel': {
	        name: 'rel',
	        animatable: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: [],
	    },
	    'repeatCount': {
	        name: 'repeatCount',
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }, {
	                type: 'string',
	                value: 'indefinite',
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'repeatDur': {
	        name: 'repeatDur',
	        legalValues: [{
	                type: 'reg',
	                value: clockFullMatch,
	            }, {
	                type: 'string',
	                value: 'indefinite',
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'requiredExtensions': {
	        name: 'requiredExtensions',
	        legalValues: [],
	        initValue: '',
	        applyTo: [],
	    },
	    'restart': {
	        name: 'restart',
	        legalValues: [{
	                type: 'enum',
	                value: restart,
	            }],
	        initValue: 'always',
	        applyTo: [],
	    },
	    'result': {
	        name: 'result',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: cssNameFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'rotate': {
	        name: 'rotate',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberListFullMatch,
	                tag: ['text', 'tspan'],
	            }, {
	                type: 'reg',
	                value: numberFullMatch,
	                tag: ['animateMotion'],
	            }, {
	                type: 'string',
	                value: 'auto',
	                tag: ['animateMotion'],
	            }, {
	                type: 'string',
	                value: 'auto-reverse',
	                tag: ['animateMotion'],
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'rx': {
	        name: 'rx',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: 'auto',
	        applyTo: ['ellipse', 'rect'],
	    },
	    'ry': {
	        name: 'ry',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: 'auto',
	        applyTo: ['ellipse', 'rect'],
	    },
	    'scale': {
	        name: 'scale',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'seed': {
	        name: 'seed',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'side': {
	        name: 'side',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'string',
	                value: 'left',
	            }, {
	                type: 'string',
	                value: 'right',
	            }],
	        initValue: 'left',
	        applyTo: [],
	    },
	    'slope': {
	        name: 'slope',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '1',
	        applyTo: [],
	    },
	    'spacing': {
	        name: 'spacing',
	        animatable: true,
	        legalValues: [{
	                type: 'string',
	                value: 'auto',
	            }, {
	                type: 'string',
	                value: 'exact',
	            }],
	        initValue: 'exact',
	        applyTo: [],
	    },
	    'specularConstant': {
	        name: 'specularConstant',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '1',
	        applyTo: [],
	    },
	    'specularExponent': {
	        name: 'specularExponent',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '1',
	        applyTo: [],
	    },
	    'spreadMethod': {
	        name: 'spreadMethod',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: spreadMethod,
	            }],
	        initValue: 'pad',
	        applyTo: [],
	    },
	    'startOffset': {
	        name: 'startOffset',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'stdDeviation': {
	        name: 'stdDeviation',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberOptionalFullMatch,
	            }],
	        initValue: [{
	                val: '2',
	                tag: ['feDropShadow'],
	            }, {
	                val: '0',
	                tag: ['feGaussianBlur'],
	            }],
	        applyTo: [],
	    },
	    'stitchTiles': {
	        name: 'stitchTiles',
	        animatable: true,
	        legalValues: [{
	                type: 'string',
	                value: 'stitch',
	            }, {
	                type: 'string',
	                value: 'noStitch',
	            }],
	        initValue: 'noStitch',
	        applyTo: [],
	    },
	    'style': {
	        name: 'style',
	        legalValues: [],
	        initValue: '',
	        applyTo: [],
	    },
	    'surfaceScale': {
	        name: 'surfaceScale',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '1',
	        applyTo: [],
	    },
	    'systemLanguage': {
	        name: 'systemLanguage',
	        legalValues: [],
	        initValue: '',
	        applyTo: [],
	    },
	    'tabindex': {
	        name: 'tabindex',
	        legalValues: [{
	                type: 'reg',
	                value: integerFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'tableValues': {
	        name: 'tableValues',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberListFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'target': {
	        name: 'target',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: nameFullMatch,
	            }, {
	                type: 'enum',
	                value: target,
	            }],
	        initValue: '_self',
	        applyTo: [],
	    },
	    'targetX': {
	        name: 'targetX',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: integerFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'targetY': {
	        name: 'targetY',
	        animatable: true,
	        legalValues: [{
	                type: 'reg',
	                value: integerFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'textLength': {
	        name: 'textLength',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'timelinebegin': {
	        name: 'timelinebegin',
	        legalValues: [{
	                type: 'string',
	                value: 'loadend',
	            }, {
	                type: 'string',
	                value: 'loadbegin',
	            }],
	        initValue: 'loadend',
	        applyTo: [],
	    },
	    'title': {
	        name: 'title',
	        legalValues: [],
	        initValue: '',
	        applyTo: [],
	    },
	    'to': {
	        name: 'to',
	        legalValues: [{
	                type: 'reg',
	                value: lengthPairFullMatch,
	                tag: ['animateMotion'],
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'type': {
	        name: 'type',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: animateTransformType,
	                tag: ['animateTransform'],
	            }, {
	                type: 'enum',
	                value: feColorMatrixType,
	                tag: ['feColorMatrix'],
	            }, {
	                type: 'enum',
	                value: feFuncType,
	                tag: ['feFuncA', 'feFuncB', 'feFuncG', 'feFuncR'],
	            }, {
	                type: 'enum',
	                value: feTurbulenceType,
	                tag: ['feTurbulence'],
	            }, {
	                type: 'reg',
	                value: mediaTypeFullMatch,
	                tag: ['script'],
	            }, {
	                type: 'reg',
	                value: mediaTypeFullMatch,
	                tag: ['style'],
	            }],
	        initValue: [{
	                val: 'translate',
	                tag: ['animateTransform'],
	            }, {
	                val: 'matrix',
	                tag: ['feColorMatrix'],
	            }, {
	                val: 'identity',
	                tag: ['feFuncA', 'feFuncB', 'feFuncG', 'feFuncR'],
	            }, {
	                val: 'turbulence',
	                tag: ['feTurbulence'],
	            }, {
	                val: 'application/ecmascript',
	                tag: ['script'],
	            }, {
	                val: 'text/css',
	                tag: ['style'],
	            }],
	        applyTo: [],
	    },
	    'values': {
	        name: 'values',
	        animatable: true,
	        maybeAccurateNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberListFullMatch,
	                tag: ['feColorMatrix'],
	            }, {
	                type: 'reg',
	                value: lengthPairListFullMatch,
	                tag: ['animateMotion'],
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'viewBox': {
	        name: 'viewBox',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: viewBoxFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'width': {
	        name: 'width',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: [{
	                val: '100%',
	                tag: filterPrimitiveElements.concat(['svg']),
	            }, {
	                val: '120%',
	                tag: ['filter', 'mask'],
	            }, {
	                val: '0',
	                tag: ['pattern', 'rect', 'foreignObject'],
	            }, {
	                val: 'auto',
	                tag: ['svg', 'image', 'rect', 'foreignObject'],
	            }],
	        applyTo: filterPrimitiveElements.concat(['filter', 'mask', 'pattern', 'svg', 'image', 'rect', 'foreignObject']),
	    },
	    'x': {
	        name: 'x',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	                tag: filterPrimitiveElements.concat(['filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject']),
	            }, {
	                type: 'reg',
	                value: numberFullMatch,
	                tag: ['fePointLight', 'feSpotLight'],
	            }, {
	                type: 'reg',
	                value: lengthPercentageListFullMatch,
	                tag: ['text', 'tspan'],
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: [{
	                val: '0%',
	                tag: filterPrimitiveElements,
	            }, {
	                val: '0',
	                tag: ['fePointLight', 'feSpotLight', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text'],
	            }, {
	                val: '-10%',
	                tag: ['filter', 'mask'],
	            }, {
	                val: '',
	                tag: ['tspan'],
	            }],
	        applyTo: filterPrimitiveElements.concat(['fePointLight', 'feSpotLight', 'filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text']),
	    },
	    'x1': {
	        name: 'x1',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: [{
	                val: '0',
	                tag: ['line'],
	            }, {
	                val: '0%',
	                tag: ['linearGradient'],
	            }],
	        applyTo: [],
	    },
	    'x2': {
	        name: 'x2',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: [{
	                val: '0',
	                tag: ['line'],
	            }, {
	                val: '100%',
	                tag: ['linearGradient'],
	            }],
	        applyTo: [],
	    },
	    'xChannelSelector': {
	        name: 'xChannelSelector',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: channel,
	            }],
	        initValue: 'A',
	        applyTo: [],
	    },
	    'xlink:href': {
	        name: 'xlink:href',
	        animatable: true,
	        maybeIRI: true,
	        legalValues: [{
	                type: 'reg',
	                value: URIFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'xlink:title': {
	        name: 'xlink:title',
	        legalValues: [],
	        initValue: '',
	        applyTo: [],
	    },
	    'xml:space': {
	        name: 'xml:space',
	        isUndef: true,
	        legalValues: [{
	                type: 'string',
	                value: 'default',
	            }, {
	                type: 'string',
	                value: 'preserve',
	            }],
	        initValue: 'default',
	        applyTo: [],
	    },
	    'xmlns': {
	        name: 'xmlns',
	        legalValues: [{
	                type: 'reg',
	                value: URIFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'xmlns:xlink': {
	        name: 'xmlns:xlink',
	        legalValues: [{
	                type: 'reg',
	                value: URIFullMatch,
	            }],
	        initValue: '',
	        applyTo: [],
	    },
	    'y': {
	        name: 'y',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	                tag: filterPrimitiveElements.concat(['filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject']),
	            }, {
	                type: 'reg',
	                value: lengthPercentageListFullMatch,
	                tag: ['text', 'tspan'],
	            }, {
	                type: 'reg',
	                value: numberFullMatch,
	                tag: ['fePointLight', 'feSpotLight'],
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: [{
	                val: '0%',
	                tag: filterPrimitiveElements,
	            }, {
	                val: '0',
	                tag: ['fePointLight', 'feSpotLight', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text'],
	            }, {
	                val: '-10%',
	                tag: ['filter', 'mask'],
	            }, {
	                val: '',
	                tag: ['tspan'],
	            }],
	        applyTo: filterPrimitiveElements.concat(['fePointLight', 'feSpotLight', 'filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text']),
	    },
	    'y1': {
	        name: 'y1',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: [{
	                val: '0',
	                tag: ['line'],
	            }, {
	                val: '0%',
	                tag: ['linearGradient'],
	            }],
	        applyTo: [],
	    },
	    'y2': {
	        name: 'y2',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: lengthPercentageFullMatch,
	            }, {
	                type: 'string',
	                value: 'auto',
	            }],
	        initValue: [{
	                val: '0',
	                tag: ['line'],
	            }, {
	                val: '0%',
	                tag: ['linearGradient'],
	            }],
	        applyTo: [],
	    },
	    'yChannelSelector': {
	        name: 'yChannelSelector',
	        animatable: true,
	        legalValues: [{
	                type: 'enum',
	                value: channel,
	            }],
	        initValue: 'A',
	        applyTo: [],
	    },
	    'z': {
	        name: 'z',
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [{
	                type: 'reg',
	                value: numberFullMatch,
	            }],
	        initValue: '0',
	        applyTo: [],
	    },
	    'zoomAndPan': {
	        name: 'zoomAndPan',
	        animatable: true,
	        legalValues: [{
	                type: 'string',
	                value: 'disable',
	            }, {
	                type: 'string',
	                value: 'magnify',
	            }],
	        initValue: 'disable',
	        applyTo: [],
	    },
	    // 下面是 property
	    'alignment-baseline': {
	        name: 'alignment-baseline',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'baseline',
	        applyTo: ['tspan', 'textPath'],
	    },
	    'all': {
	        name: 'all',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: useContainerGraphics,
	    },
	    'animation-name': {
	        name: 'animation-name',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: useContainerGraphics,
	    },
	    'animation-duration': {
	        name: 'animation-duration',
	        maybeAccurateNumber: true,
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: '0',
	        applyTo: useContainerGraphics,
	    },
	    'animation-timing-function': {
	        name: 'animation-timing-function',
	        maybeAccurateNumber: true,
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: 'ease',
	        applyTo: useContainerGraphics,
	    },
	    'animation-iteration-count': {
	        name: 'animation-iteration-count',
	        maybeSizeNumber: true,
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: '1',
	        applyTo: useContainerGraphics,
	    },
	    'animation-direction': {
	        name: 'animation-direction',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: useContainerGraphics,
	    },
	    'animation-play-state': {
	        name: 'animation-play-state',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: useContainerGraphics,
	    },
	    'animation-delay': {
	        name: 'animation-delay',
	        maybeAccurateNumber: true,
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: '0',
	        applyTo: useContainerGraphics,
	    },
	    'animation-fill-mode': {
	        name: 'animation-fill-mode',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: useContainerGraphics,
	    },
	    'animation': {
	        name: 'animation',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: useContainerGraphics,
	    },
	    'baseline-shift': {
	        name: 'baseline-shift',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: '0',
	        applyTo: ['tspan', 'textPath'],
	    },
	    'clip': {
	        name: 'clip',
	        couldBeStyle: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: viewport,
	    },
	    'clip-path': {
	        name: 'clip-path',
	        couldBeStyle: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: useContainerGraphics,
	    },
	    'clip-rule': {
	        name: 'clip-rule',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'nonzero',
	        applyTo: ['use'].concat(graphicsElements),
	    },
	    'color': {
	        name: 'color',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeColor: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: ['feFlood', 'feDiffuseLighting', 'feSpecularLighting', 'stop'].concat(shapeAndText),
	    },
	    'color-interpolation': {
	        name: 'color-interpolation',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'sRGB',
	        applyTo: colorApply,
	    },
	    'color-interpolation-filters': {
	        name: 'color-interpolation-filters',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: ['feSpotLight'].concat(filterPrimitiveElements),
	    },
	    'color-rendering': {
	        name: 'color-rendering',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: colorApply,
	    },
	    'cursor': {
	        name: 'cursor',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: useContainerGraphics,
	    },
	    'direction': {
	        name: 'direction',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'ltr',
	        applyTo: textContentElements,
	    },
	    'display': {
	        name: 'display',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'inline',
	        applyTo: ['svg', 'g', 'switch', 'a', 'foreignObject', 'use'].concat(graphicsElements),
	    },
	    'dominant-baseline': {
	        name: 'dominant-baseline',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: textContentElements,
	    },
	    'fill': {
	        name: 'fill',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeColor: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: [{
	                val: 'black',
	                tag: useContainerGraphics,
	            }, {
	                val: 'remove',
	                tag: ['animate', 'animateMotion', 'animateTransform', 'set'],
	            }],
	        applyTo: ['animate', 'animateMotion', 'animateTransform', 'set'].concat(shapeAndText),
	    },
	    'fill-opacity': {
	        name: 'fill-opacity',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeAlpha: true,
	        legalValues: [],
	        initValue: '1',
	        applyTo: shapeAndText,
	    },
	    'fill-rule': {
	        name: 'fill-rule',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'nonzero',
	        applyTo: shapeAndText,
	    },
	    'filter': {
	        name: 'filter',
	        couldBeStyle: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: useContainerGraphics,
	    },
	    'flood-color': {
	        name: 'flood-color',
	        couldBeStyle: true,
	        animatable: true,
	        maybeColor: true,
	        legalValues: [],
	        initValue: 'black',
	        applyTo: ['feFlood'],
	    },
	    'flood-opacity': {
	        name: 'flood-opacity',
	        couldBeStyle: true,
	        maybeAlpha: true,
	        legalValues: [],
	        initValue: '1',
	        applyTo: ['feFlood'],
	    },
	    'font': {
	        name: 'font',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: textContentElements,
	    },
	    'font-family': {
	        name: 'font-family',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: textContentElements,
	    },
	    'font-feature-settings': {
	        name: 'font-feature-settings',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-kerning': {
	        name: 'font-kerning',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: textContentElements,
	    },
	    'font-size': {
	        name: 'font-size',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: 'medium',
	        applyTo: textContentElements,
	    },
	    'font-size-adjust': {
	        name: 'font-size-adjust',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: textContentElements,
	    },
	    'font-stretch': {
	        name: 'font-stretch',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-style': {
	        name: 'font-style',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-variant': {
	        name: 'font-variant',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-variant-ligatures': {
	        name: 'font-variant-ligatures',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-variant-position': {
	        name: 'font-variant-position',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-variant-caps': {
	        name: 'font-variant-caps',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-variant-numeric': {
	        name: 'font-variant-numeric',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-variant-east-asian': {
	        name: 'font-variant-east-asian',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'font-weight': {
	        name: 'font-weight',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'image-rendering': {
	        name: 'image-rendering',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: ['image'],
	    },
	    'inline-size': {
	        name: 'inline-size',
	        couldBeStyle: true,
	        maybeSizeNumber: true,
	        animatable: true,
	        legalValues: [],
	        initValue: '0',
	        applyTo: ['text'],
	    },
	    'letter-spacing': {
	        name: 'letter-spacing',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'lighting-color': {
	        name: 'lighting-color',
	        couldBeStyle: true,
	        animatable: true,
	        maybeColor: true,
	        legalValues: [],
	        initValue: 'white',
	        applyTo: ['feDiffuseLighting', 'feSpecularLighting'],
	    },
	    'line-height': {
	        name: 'line-height',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeColor: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: ['text'],
	    },
	    'marker': {
	        name: 'marker',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: shapeElements,
	    },
	    'marker-end': {
	        name: 'marker-end',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: shapeElements,
	    },
	    'marker-mid': {
	        name: 'marker-mid',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: shapeElements,
	    },
	    'marker-start': {
	        name: 'marker-start',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: shapeElements,
	    },
	    'mask': {
	        name: 'mask',
	        couldBeStyle: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: useContainerGraphics,
	    },
	    'mask-image': {
	        name: 'mask-image',
	        couldBeStyle: true,
	        animatable: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: useContainerGraphics,
	    },
	    'mask-mode': {
	        name: 'mask-mode',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'match-source',
	        applyTo: useContainerGraphics,
	    },
	    'mask-repeat': {
	        name: 'mask-repeat',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'repeat',
	        applyTo: useContainerGraphics,
	    },
	    'mask-position': {
	        name: 'mask-position',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: '0% 0%',
	        applyTo: useContainerGraphics,
	    },
	    'mask-clip': {
	        name: 'mask-clip',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'border-box',
	        applyTo: useContainerGraphics,
	    },
	    'mask-origin': {
	        name: 'mask-origin',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'border-box',
	        applyTo: useContainerGraphics,
	    },
	    'mask-size': {
	        name: 'mask-size',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: useContainerGraphics,
	    },
	    'mask-composite': {
	        name: 'mask-composite',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'add',
	        applyTo: useContainerGraphics,
	    },
	    'mix-blend-mode': {
	        name: 'mix-blend-mode',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: useContainerGraphics,
	    },
	    'opacity': {
	        name: 'opacity',
	        couldBeStyle: true,
	        animatable: true,
	        maybeAlpha: true,
	        legalValues: [],
	        initValue: '1',
	        applyTo: ['svg', 'g', 'symbol', 'marker', 'a', 'switch', 'use', 'unknown'].concat(graphicsElements),
	    },
	    'overflow': {
	        name: 'overflow',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'visible',
	        applyTo: viewport,
	    },
	    'paint-order': {
	        name: 'paint-order',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: shapeAndText,
	    },
	    'pointer-events': {
	        name: 'pointer-events',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'visiblePainted',
	        applyTo: useContainerGraphics,
	    },
	    'shape-image-threshold': {
	        name: 'shape-image-threshold',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: '0',
	        applyTo: ['text'],
	    },
	    'shape-inside': {
	        name: 'shape-inside',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: ['text'],
	    },
	    'shape-margin': {
	        name: 'shape-margin',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: '0',
	        applyTo: ['text'],
	    },
	    'shape-padding': {
	        name: 'shape-padding',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: ['text'],
	    },
	    'shape-rendering': {
	        name: 'shape-rendering',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: shapeElements,
	    },
	    'shape-subtract': {
	        name: 'shape-subtract',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: ['text'],
	    },
	    'stop-color': {
	        name: 'stop-color',
	        couldBeStyle: true,
	        animatable: true,
	        maybeColor: true,
	        legalValues: [],
	        initValue: 'black',
	        applyTo: ['stop'],
	    },
	    'stop-opacity': {
	        name: 'stop-opacity',
	        couldBeStyle: true,
	        animatable: true,
	        maybeAlpha: true,
	        legalValues: [],
	        initValue: '1',
	        applyTo: ['stop'],
	    },
	    'stroke': {
	        name: 'stroke',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeColor: true,
	        maybeFuncIRI: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: shapeAndText,
	    },
	    'stroke-dasharray': {
	        name: 'stroke-dasharray',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: shapeAndText,
	    },
	    'stroke-dashoffset': {
	        name: 'stroke-dashoffset',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: '0',
	        applyTo: shapeAndText,
	    },
	    'stroke-linecap': {
	        name: 'stroke-linecap',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'butt',
	        applyTo: shapeAndText,
	    },
	    'stroke-linejoin': {
	        name: 'stroke-linejoin',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'miter',
	        applyTo: shapeAndText,
	    },
	    'stroke-miterlimit': {
	        name: 'stroke-miterlimit',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: '4',
	        applyTo: shapeAndText,
	    },
	    'stroke-opacity': {
	        name: 'stroke-opacity',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeAlpha: true,
	        legalValues: [],
	        initValue: '1',
	        applyTo: shapeAndText,
	    },
	    'stroke-width': {
	        name: 'stroke-width',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: '1',
	        applyTo: shapeAndText,
	    },
	    'text-anchor': {
	        name: 'text-anchor',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'start',
	        applyTo: textContentElements,
	    },
	    'text-decoration': {
	        name: 'text-decoration',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: textContentElements,
	    },
	    'text-decoration-line': {
	        name: 'text-decoration-line',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: textContentElements,
	    },
	    'text-decoration-style': {
	        name: 'text-decoration-style',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'solid',
	        applyTo: textContentElements,
	    },
	    'text-decoration-color': {
	        name: 'text-decoration-color',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'currentcolor',
	        applyTo: textContentElements,
	    },
	    'text-decoration-fill': {
	        name: 'text-decoration-fill',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: textContentElements,
	    },
	    'text-decoration-stroke': {
	        name: 'text-decoration-stroke',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: textContentElements,
	    },
	    'text-orientation': {
	        name: 'text-orientation',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: 'mixed',
	        applyTo: textContentElements,
	    },
	    'text-overflow': {
	        name: 'text-overflow',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: textContentElements,
	    },
	    'text-rendering': {
	        name: 'text-rendering',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: ['text'],
	    },
	    'transform': {
	        name: 'transform',
	        animatable: true,
	        couldBeStyle: true,
	        cantTrans: true,
	        legalValues: [{
	                type: 'reg',
	                value: transformListFullMatch,
	            }],
	        initValue: '',
	        applyTo: useContainerGraphics,
	    },
	    'transform-box': {
	        name: 'transform-box',
	        couldBeStyle: true,
	        cantTrans: true,
	        cantBeAttr: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'border-box',
	        applyTo: useContainerGraphics,
	    },
	    'transform-origin': {
	        name: 'transform-origin',
	        animatable: true,
	        couldBeStyle: true,
	        cantTrans: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: '',
	        applyTo: useContainerGraphics,
	    },
	    'unicode-bidi': {
	        name: 'unicode-bidi',
	        couldBeStyle: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'vector-effect': {
	        name: 'vector-effect',
	        couldBeStyle: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'none',
	        applyTo: ['use'].concat(graphicsElements),
	    },
	    'visibility': {
	        name: 'visibility',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'visible',
	        applyTo: ['use', 'a'].concat(graphicsElements),
	    },
	    'white-space': {
	        name: 'white-space',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'will-change': {
	        name: 'will-change',
	        couldBeStyle: true,
	        legalValues: [],
	        initValue: 'auto',
	        applyTo: useContainerGraphics,
	    },
	    'word-spacing': {
	        name: 'word-spacing',
	        couldBeStyle: true,
	        inherited: true,
	        animatable: true,
	        maybeSizeNumber: true,
	        legalValues: [],
	        initValue: 'normal',
	        applyTo: textContentElements,
	    },
	    'writing-mode': {
	        name: 'writing-mode',
	        couldBeStyle: true,
	        inherited: true,
	        legalValues: [],
	        initValue: [{
	                val: 'lr-tb',
	                tag: ['text'],
	            }, {
	                val: 'horizontal-tb',
	                tag: ['text'],
	            }],
	        applyTo: ['text'],
	    },
	};
	const undefAttr = {
	    name: '',
	    isUndef: true,
	    legalValues: [],
	    initValue: '',
	    applyTo: [],
	};
	const regularAttr = new Proxy(_regularAttr, {
	    get(obj, prop) {
	        return prop in obj ? obj[prop] : undefAttr;
	    },
	});

	const useEnum = (e, val) => new RegExp(`^${e}$`).test(val);

	const useReg = (reg, val) => reg.test(val.trim());

	const legalValue = (attrDefine, attr, nodeName = '') => {
	    if (attrDefine.legalValues.length) {
	        // 只要有一个规则命中就返回 true
	        let noMatchRule = true; // 重要！要判断是否有可以用于验证的规则，如果所有规则不适用于验证当前属性，则不应该 return false，而应该 return true
	        for (const legalRule of attrDefine.legalValues) {
	            // 当前验证规则可能只适用于某些 tag，legalTag 表示当前规则适用于所有 tag 或当前验证的 tag 在规则匹配列表中
	            const legalTag = !legalRule.tag || !nodeName || legalRule.tag.includes(nodeName);
	            if (legalTag) {
	                noMatchRule = false;
	                switch (legalRule.type) {
	                    // 用正则判断
	                    case 'reg':
	                        if (useReg(legalRule.value, attr.value)) {
	                            return true;
	                        }
	                        break;
	                    // 用枚举判断
	                    case 'enum':
	                        if (useEnum(legalRule.value, attr.value)) {
	                            return true;
	                        }
	                        break;
	                    // 值应该是一个属性名，而且不允许循环引用
	                    case 'attr':
	                        if (!regularAttr[attr.value].isUndef && attr.fullname !== attr.value) {
	                            return true;
	                        }
	                        break;
	                    // 值应该是一个特定字符串
	                    default:
	                        if (legalRule.value === attr.value) {
	                            return true;
	                        }
	                        break;
	                }
	            }
	        }
	        return noMatchRule;
	    }
	    return !attrDefine.isUndef;
	};

	const rmCSSNode = (cssNode, plist) => {
	    const index = plist.indexOf(cssNode);
	    if (index !== -1) {
	        plist.splice(index, 1);
	    }
	};
	// 合并多个 style 标签，并将文本节点合并到一个子节点
	const combineStyle = async (dom) => new Promise((resolve, reject) => {
	    let firstStyle;
	    let lastChildNode;
	    const checkCNode = (node) => {
	        for (let i = 0; i < node.childNodes.length; i++) {
	            const cNode = node.childNodes[i];
	            if (cNode.nodeType !== NodeType.Text && cNode.nodeType !== NodeType.CDATA) {
	                rmNode(cNode);
	                i--;
	            }
	            else {
	                cNode.textContent = mixWhiteSpace(cNode.textContent.trim());
	                if (cNode.nodeType === NodeType.Text) {
	                    cNode.nodeType = NodeType.CDATA;
	                }
	                if (!lastChildNode) {
	                    lastChildNode = cNode;
	                }
	                else {
	                    lastChildNode.textContent += cNode.textContent;
	                    rmNode(cNode);
	                    i--;
	                }
	            }
	        }
	    };
	    traversalNode(ramda.propEq('nodeName', 'style'), node => {
	        const type = node.getAttribute('type');
	        if (type && type !== 'text/css') {
	            rmNode(node);
	            return;
	        }
	        if (firstStyle) {
	            checkCNode(node);
	            rmNode(node);
	        }
	        else {
	            firstStyle = node;
	            checkCNode(node);
	        }
	    }, dom);
	    const ruleParents = [];
	    if (firstStyle) {
	        const childNodes = firstStyle.childNodes;
	        if (childNodes.length === 0 || !childNodes[0].textContent || !childNodes[0].textContent.replace(/\s/g, '')) { // 如果内容为空，则移除style节点
	            rmNode(firstStyle);
	        }
	        else {
	            if (!childNodes[0].textContent.includes('<')) { // 如果没有危险代码，则由 CDATA 转为普通文本类型
	                childNodes[0].nodeType = NodeType.Text;
	            }
	            // 解析 stylesheet 并缓存
	            try {
	                const parsedCss = css.parse(childNodes[0].textContent);
	                if (parsedCss.stylesheet) {
	                    dom.stylesheet = parsedCss;
	                    dom.styletag = firstStyle;
	                    traversalObj(ramda.has('type'), (cssNode, parents) => {
	                        switch (cssNode.type) {
	                            case 'rule':
	                            case 'keyframe':
	                            case 'font-face':
	                            case 'page':
	                                const cssRule = cssNode;
	                                if (!cssRule.declarations) {
	                                    rmCSSNode(cssRule, parents[parents.length - 1]);
	                                    return;
	                                }
	                                const declared = {};
	                                for (let i = cssRule.declarations.length; i--;) {
	                                    const ruleItem = cssRule.declarations[i];
	                                    // 1、移除不存在属性名或属性值的项
	                                    // 2、排重
	                                    if (!ruleItem.property || !ruleItem.value || declared[ruleItem.property]) {
	                                        cssRule.declarations.splice(i, 1);
	                                    }
	                                    else {
	                                        declared[ruleItem.property] = true;
	                                    }
	                                }
	                                if (!cssRule.declarations.length) {
	                                    rmCSSNode(cssRule, parents[parents.length - 1]);
	                                }
	                                else {
	                                    ruleParents.push([cssRule, parents[parents.length - 1]]);
	                                }
	                                break;
	                            case 'keyframes':
	                                const keyframes = cssNode;
	                                if (!keyframes.keyframes || !keyframes.keyframes.length) {
	                                    rmCSSNode(cssNode, parents[parents.length - 1]);
	                                }
	                                break;
	                            case 'media':
	                            case 'host':
	                            case 'supports':
	                            case 'document':
	                                const ruleParent = cssNode;
	                                if (!ruleParent.rules || !ruleParent.rules.length) {
	                                    rmCSSNode(cssNode, parents[parents.length - 1]);
	                                }
	                                break;
	                            case 'comment':
	                                rmCSSNode(cssNode, parents[parents.length - 1]);
	                                break;
	                            default:
	                                break;
	                        }
	                    }, parsedCss.stylesheet.rules, true);
	                }
	                else {
	                    rmNode(firstStyle);
	                }
	            }
	            catch (e) {
	                rmNode(firstStyle);
	            }
	        }
	    }
	    if (ruleParents.length) {
	        // (async () => { // tslint:disable-line no-floating-promises
	        for (const [rule, parent] of ruleParents) {
	            // 				if (typeof document === 'undefined') { // tslint:disable-line strict-type-predicates
	            // 					let cssString = 'text,rect{';
	            // 					rule.declarations.forEach(d => {
	            // 						cssString += `${d.property}:${d.value};
	            // `;
	            // 					});
	            // 					cssString += '}';
	            // 					const result = await legalCss(cssString);
	            // 					if (!result.validity) {
	            // 						result.errors.forEach(err => {
	            // 							if (err.type === 'zero') { // 忽略没有单位导致的错误
	            // 								return;
	            // 							}
	            // 							const styleItem = rule.declarations[err.line - 1] as Declaration | undefined;
	            // 							if (styleItem && err.message.includes(styleItem.property as string)) { // cssValidator 有时候会报错行数，需要确保规则对得上
	            // 								const styleDefine = regularAttr[styleItem.property as string];
	            // 								// css 验证失败，还需要进行一次 svg-slimming 的合法性验证，确保没有问题
	            // 								if (!styleDefine.legalValues.length || !legalValue(styleDefine, {
	            // 									fullname: styleItem.property as string,
	            // 									value: styleItem.value as string,
	            // 									name: '',
	            // 								})) {
	            // 									styleItem.value = '';
	            // 								}
	            // 							}
	            // 						});
	            // 					}
	            // 				}
	            // 只做基本验证
	            rule.declarations.forEach(styleItem => {
	                const styleDefine = regularAttr[styleItem.property];
	                if (!legalValue(styleDefine, {
	                    fullname: styleItem.property,
	                    value: styleItem.value,
	                    name: '',
	                })) {
	                    styleItem.value = '';
	                }
	            });
	            rule.declarations = rule.declarations.filter(item => !!item.value);
	            if (!rule.declarations.length) {
	                rmCSSNode(rule, parent);
	            }
	        }
	        // resolve();
	        // })();
	    }
	    // } else {
	    resolve();
	    // }
	});

	const baseChildren = ['script'].concat(descriptiveElements);
	const shapeChildren = ['clipPath', 'marker', 'mask', 'style'].concat(animationElements, baseChildren, paintServerElements);
	const globalChildren = ['a', 'audio', 'canvas', 'clipPath', 'cursor', 'filter', 'foreignObject', 'iframe', 'image', 'marker', 'mask', 'style', 'switch', 'text', 'video', 'view'].concat(animationElements, baseChildren, paintServerElements, shapeElements, structuralElements);
	const gradientChildren = ['animate', 'animateTransform', 'set', 'stop', 'style'].concat(baseChildren);
	const feChildren = ['animate', 'set'].concat(baseChildren);
	const conditionAndCore = conditionalProcessingAttributes.concat(coreAttributes);
	const shapeAttributes = ['pathLength'].concat(conditionAndCore);
	const animateAttributes = conditionAndCore.concat(animationAdditionAttributes, animationTimingAttributes, animationValueAttributes);
	const feAttributes = ['result'].concat(coreAttributes, rectAttributes);
	const feFuncAttributes = transferFunctionElementAttributes.concat(coreAttributes);
	// tag define
	const _regularTag = {
	    'a': {
	        containTextNode: true,
	        legalChildElements: { transparent: true, noself: true, childElements: [] },
	        ownAttributes: ['href', 'target', 'download', 'rel', 'hreflang', 'type'].concat(conditionAndCore, deprecatedXlinkAttributes),
	    },
	    'animate': {
	        legalChildElements: { childElements: baseChildren },
	        ownAttributes: ['attributeName'].concat(animateAttributes),
	        onlyAttr: ['fill'],
	    },
	    'animateMotion': {
	        legalChildElements: { childElements: ['mpath'].concat(baseChildren) },
	        ownAttributes: ['path', 'keyPoints', 'rotate', 'origin'].concat(animateAttributes),
	        onlyAttr: ['fill'],
	    },
	    'animateTransform': {
	        legalChildElements: { childElements: baseChildren },
	        ownAttributes: ['attributeName', 'type'].concat(animateAttributes),
	        onlyAttr: ['fill'],
	    },
	    'audio': {
	        legalChildElements: { childElements: [] },
	        ownAttributes: [],
	    },
	    'canvas': {
	        legalChildElements: { childElements: [] },
	        ownAttributes: [],
	    },
	    'circle': {
	        legalChildElements: { childElements: shapeChildren },
	        ownAttributes: ['cx', 'cy', 'r'].concat(shapeAttributes),
	    },
	    'clipPath': {
	        legalChildElements: { childElements: ['text', 'use'].concat(baseChildren, animationElements, shapeElements) },
	        ownAttributes: ['externalResourcesRequired', 'transform', 'clipPathUnits'].concat(conditionAndCore),
	    },
	    'defs': {
	        legalChildElements: { childElements: globalChildren },
	        ownAttributes: coreAttributes,
	    },
	    'desc': {
	        containTextNode: true,
	        legalChildElements: { any: true, childElements: [] },
	        ownAttributes: coreAttributes,
	    },
	    'discard': {
	        legalChildElements: { childElements: baseChildren },
	        ownAttributes: ['begin', 'href'].concat(conditionAndCore),
	    },
	    'ellipse': {
	        legalChildElements: { childElements: shapeChildren },
	        ownAttributes: ['cx', 'cy', 'rx', 'ry'].concat(shapeAttributes),
	    },
	    'feBlend': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in', 'in2', 'mode'].concat(feAttributes),
	    },
	    'feColorMatrix': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in', 'type', 'values'].concat(feAttributes),
	    },
	    'feComponentTransfer': {
	        legalChildElements: { childElements: transferFunctionElements.concat(baseChildren) },
	        ownAttributes: ['in'].concat(feAttributes),
	    },
	    'feComposite': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in', 'in2', 'operator', 'k1', 'k2', 'k3', 'k4'].concat(feAttributes),
	    },
	    'feConvolveMatrix': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in', 'order', 'kernelMatrix', 'divisor', 'bias', 'targetX', 'targetY', 'edgeMode', 'kernelUnitLength', 'preserveAlpha'].concat(feAttributes),
	    },
	    'feDiffuseLighting': {
	        legalChildElements: { childElements: baseChildren.concat(lightSourceElements) },
	        ownAttributes: ['in', 'surfaceScale', 'diffuseConstant', 'kernelUnitLength'].concat(feAttributes),
	    },
	    'feDisplacementMap': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in', 'in2', 'scale', 'xChannelSelector', 'yChannelSelector'].concat(feAttributes),
	    },
	    'feDistantLight': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['azimuth', 'elevation'].concat(coreAttributes),
	    },
	    'feFlood': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: feAttributes,
	    },
	    'feFuncA': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: feFuncAttributes,
	    },
	    'feFuncB': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: feFuncAttributes,
	    },
	    'feFuncG': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: feFuncAttributes,
	    },
	    'feFuncR': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: feFuncAttributes,
	    },
	    'feGaussianBlur': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in', 'stdDeviation', 'edgeMode'].concat(feAttributes),
	    },
	    'feImage': {
	        legalChildElements: { childElements: ['animate', 'animateTransform', 'set'].concat(baseChildren) },
	        ownAttributes: ['externalResourcesRequired', 'preserveAspectRatio', 'xlink:href', 'href', 'crossorigin'].concat(feAttributes),
	    },
	    'feMerge': {
	        legalChildElements: { childElements: ['feMergeNode'].concat(baseChildren) },
	        ownAttributes: feAttributes,
	    },
	    'feMergeNode': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in'].concat(coreAttributes),
	    },
	    'feMorphology': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in', 'operator', 'radius'].concat(feAttributes),
	    },
	    'feOffset': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in', 'dx', 'dy'].concat(feAttributes),
	    },
	    'fePointLight': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['x', 'y', 'z'].concat(coreAttributes),
	    },
	    'feSpecularLighting': {
	        legalChildElements: { childElements: baseChildren.concat(lightSourceElements) },
	        ownAttributes: ['in', 'surfaceScale', 'specularConstant', 'specularExponent', 'kernelUnitLength'].concat(feAttributes),
	    },
	    'feSpotLight': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['x', 'y', 'z'].concat(coreAttributes),
	    },
	    'feTile': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['in'].concat(feAttributes),
	    },
	    'feTurbulence': {
	        legalChildElements: { childElements: feChildren },
	        ownAttributes: ['baseFrequency', 'numOctaves', 'seed', 'stitchTiles', 'type'].concat(feAttributes),
	    },
	    'filter': {
	        legalChildElements: { childElements: feChildren.concat(filterPrimitiveElements) },
	        ownAttributes: ['externalResourcesRequired', 'filterUnits', 'primitiveUnits'].concat(coreAttributes, rectAttributes),
	    },
	    'foreignObject': {
	        legalChildElements: { any: true, childElements: [] },
	        ownAttributes: rectAttributes.concat(conditionAndCore),
	    },
	    'g': {
	        legalChildElements: { childElements: globalChildren },
	        ownAttributes: conditionAndCore,
	    },
	    'iframe': {
	        legalChildElements: { childElements: [] },
	        ownAttributes: [],
	    },
	    'image': {
	        legalChildElements: { childElements: ['clipPath', 'mask', 'style'].concat(animationElements, baseChildren) },
	        ownAttributes: ['preserveAspectRatio', 'href', 'crossorigin'].concat(conditionAndCore, deprecatedXlinkAttributes, rectAttributes),
	    },
	    'line': {
	        legalChildElements: { childElements: shapeChildren },
	        ownAttributes: ['x1', 'y1', 'x2', 'y2'].concat(shapeAttributes),
	    },
	    'linearGradient': {
	        legalChildElements: { childElements: gradientChildren },
	        ownAttributes: ['x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'href'].concat(coreAttributes, deprecatedXlinkAttributes),
	    },
	    'marker': {
	        legalChildElements: { childElements: globalChildren },
	        ownAttributes: ['viewBox', 'preserveAspectRatio', 'refX', 'refY', 'markerUnits', 'markerWidth', 'markerHeight', 'orient'].concat(coreAttributes),
	    },
	    'mask': {
	        legalChildElements: { childElements: ['a', 'clipPath', 'cursor', 'filter', 'foreignObject', 'image', 'marker', 'mask', 'pattern', 'style', 'switch', 'view', 'text'].concat(animationElements, baseChildren, shapeElements, structuralElements, gradientElements) },
	        ownAttributes: ['maskUnits', 'maskContentUnits'].concat(rectAttributes, conditionAndCore),
	    },
	    'metadata': {
	        containTextNode: true,
	        legalChildElements: { any: true, childElements: [] },
	        ownAttributes: coreAttributes,
	    },
	    'mpath': {
	        legalChildElements: { childElements: baseChildren },
	        ownAttributes: ['href'].concat(coreAttributes),
	    },
	    'path': {
	        legalChildElements: { childElements: shapeChildren },
	        ownAttributes: ['d'].concat(shapeAttributes),
	    },
	    'pattern': {
	        legalChildElements: { childElements: globalChildren },
	        ownAttributes: ['viewBox', 'preserveAspectRatio', 'patternUnits', 'patternContentUnits', 'patternTransform', 'href'].concat(coreAttributes, deprecatedXlinkAttributes, rectAttributes),
	    },
	    'polygon': {
	        legalChildElements: { childElements: shapeChildren },
	        ownAttributes: ['points'].concat(shapeAttributes),
	    },
	    'polyline': {
	        legalChildElements: { childElements: shapeChildren },
	        ownAttributes: ['points'].concat(shapeAttributes),
	    },
	    'radialGradient': {
	        legalChildElements: { childElements: gradientChildren },
	        ownAttributes: ['cx', 'cy', 'r', 'fx', 'fy', 'fr', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'href'].concat(coreAttributes, deprecatedXlinkAttributes),
	        onlyAttr: ['cx', 'cy', 'r'],
	    },
	    'rect': {
	        legalChildElements: { childElements: shapeChildren },
	        ownAttributes: ['rx', 'ry'].concat(rectAttributes, shapeAttributes),
	    },
	    'script': {
	        containTextNode: true,
	        legalChildElements: { childElements: [] },
	        ownAttributes: ['type', 'href', 'crossorigin'].concat(coreAttributes, deprecatedXlinkAttributes),
	    },
	    'set': {
	        legalChildElements: { childElements: baseChildren },
	        ownAttributes: ['to', 'attributeName'].concat(conditionAndCore, animationTimingAttributes),
	        onlyAttr: ['fill'],
	    },
	    'stop': {
	        legalChildElements: { childElements: ['animate', 'script', 'set', 'style'] },
	        ownAttributes: ['path', 'offset'].concat(coreAttributes),
	    },
	    'style': {
	        containTextNode: true,
	        legalChildElements: { childElements: [] },
	        ownAttributes: ['type', 'media', 'title'].concat(coreAttributes),
	    },
	    'svg': {
	        legalChildElements: { childElements: globalChildren },
	        ownAttributes: ['viewBox', 'preserveAspectRatio', 'zoomAndPan', 'transform'].concat(conditionAndCore, rectAttributes),
	        onlyAttr: ['width', 'height'],
	    },
	    'switch': {
	        legalChildElements: { childElements: ['a', 'audio', 'canvas', 'foreignObject', 'g', 'iframe', 'image', 'svg', 'switch', 'text', 'use', 'video'].concat(animationElements, shapeElements) },
	        ownAttributes: conditionAndCore,
	    },
	    'symbol': {
	        legalChildElements: { childElements: globalChildren },
	        ownAttributes: ['preserveAspectRatio', 'viewBox', 'refX', 'refY'].concat(coreAttributes, rectAttributes),
	    },
	    'text': {
	        containTextNode: true,
	        legalChildElements: { childElements: ['a', 'clipPath', 'marker', 'mask', 'style'].concat(animationElements, baseChildren, paintServerElements, textContentChildElements) },
	        ownAttributes: ['lengthAdjust', 'x', 'y', 'dx', 'dy', 'rotate', 'textLength'].concat(conditionAndCore),
	        onlyAttr: ['x', 'y'],
	    },
	    'textPath': {
	        containTextNode: true,
	        legalChildElements: { childElements: ['a', 'animate', 'clipPath', 'marker', 'mask', 'set', 'style', 'tspan'].concat(baseChildren, paintServerElements) },
	        ownAttributes: ['lengthAdjust', 'textLength', 'path', 'href', 'startOffset', 'method', 'spacing', 'side'].concat(conditionAndCore, deprecatedXlinkAttributes),
	    },
	    'title': {
	        containTextNode: true,
	        legalChildElements: { any: true, childElements: ['a', 'animate', 'set', 'style', 'tspan'].concat(baseChildren, paintServerElements) },
	        ownAttributes: coreAttributes,
	    },
	    'tspan': {
	        containTextNode: true,
	        legalChildElements: { childElements: [] },
	        ownAttributes: ['lengthAdjust', 'x', 'y', 'dx', 'dy', 'rotate', 'textLength'].concat(conditionAndCore),
	        onlyAttr: ['x', 'y'],
	    },
	    'unknown': {
	        legalChildElements: { any: true, childElements: [] },
	        ownAttributes: conditionAndCore,
	    },
	    'use': {
	        legalChildElements: { childElements: ['clipPath', 'mask', 'style'].concat(animationElements, baseChildren) },
	        ownAttributes: ['href'].concat(rectAttributes, conditionAndCore, deprecatedXlinkAttributes),
	    },
	    'video': {
	        legalChildElements: { childElements: [] },
	        ownAttributes: [],
	    },
	    'view': {
	        legalChildElements: { childElements: ['style'].concat(animationElements, baseChildren) },
	        ownAttributes: ['viewBox', 'preserveAspectRatio', 'zoomAndPan'].concat(coreAttributes),
	    },
	};
	const undefTag = {
	    isUndef: true,
	    legalChildElements: {},
	    ownAttributes: [],
	};
	const regularTag = new Proxy(_regularTag, {
	    get(obj, prop) {
	        return prop in obj ? obj[prop] : undefTag;
	    },
	});

	const combineTextNode = async (dom) => new Promise((resolve, reject) => {
	    // 首先移除所有可移除的文本节点，并对文本节点进行冗余空格清理
	    traversalNode(node => node.nodeType === NodeType.Text || node.nodeType === NodeType.CDATA, node => {
	        const parentName = node.parentNode && node.parentNode.nodeName;
	        if (parentName && (regularTag[parentName].isUndef || !regularTag[parentName].containTextNode)) {
	            rmNode(node);
	        }
	        else {
	            node.textContent = mixWhiteSpace(node.textContent);
	        }
	    }, dom);
	    // 合并相邻的同类型节点
	    traversalNode(node => !regularTag[node.nodeName].isUndef && regularTag[node.nodeName].containTextNode, node => {
	        let lastNode;
	        for (let i = 0; i < node.childNodes.length; i++) {
	            const childNode = node.childNodes[i];
	            if (childNode.nodeType === NodeType.Text || childNode.nodeType === NodeType.CDATA) {
	                if (lastNode) {
	                    if (lastNode.nodeType === childNode.nodeType) {
	                        lastNode.textContent = mixWhiteSpace(`${lastNode.textContent}${childNode.textContent}`);
	                        rmNode(childNode);
	                        i--;
	                    }
	                    else {
	                        lastNode = childNode;
	                    }
	                }
	                else {
	                    lastNode = childNode;
	                }
	            }
	        }
	    }, dom);
	    resolve();
	});

	// 移除其它类型的 xml 定义节点和 xml 片段节点
	const rmUseless = async (dom) => new Promise((resolve, reject) => {
	    traversalNode(ramda.anyPass([ramda.propEq('nodeType', NodeType.OtherSect), ramda.propEq('nodeType', NodeType.OtherDecl)]), rmNode, dom);
	    resolve();
	});

	const isTag = ramda.propEq('nodeType', NodeType.Tag);

	const collapseAttributes = (node1, node2) => {
	    const attrObj = {};
	    node1.attributes.forEach(attr => {
	        attrObj[attr.fullname] = attr;
	    });
	    node2.attributes.forEach(attr => {
	        if (attrObj.hasOwnProperty(attr.fullname)) {
	            if (transformAttributes.includes(attr.fullname)) {
	                attrObj[attr.fullname].value = `${attr.value} ${attrObj[attr.fullname].value}`;
	            }
	        }
	        else {
	            node1.setAttribute(attr.name, attr.value, attr.namespace);
	            attrObj[attr.fullname] = attr;
	        }
	    });
	};
	// 包含某些特定属性，不允许进行塌陷
	const cantCollapse = (node) => node.attributes.filter(attr => cantCollapseAttributes.includes(attr.fullname)).length;
	const doCollapse = (dom) => {
	    traversalNode(ramda.propEq('nodeName', 'g'), node => {
	        const childNodes = node.childNodes;
	        const childTags = childNodes.filter(isTag);
	        if (!childTags.length) {
	            rmNode(node);
	        }
	        else if (!cantCollapse(node)) {
	            if (childTags.length === 1) { // 只有一个子节点
	                const childNode = childTags[0];
	                collapseAttributes(childNode, node);
	                node.parentNode.replaceChild(node, ...childNodes);
	            }
	            else if (!node.attributes.length) { // 没有属性
	                node.parentNode.replaceChild(node, ...childNodes);
	            }
	        }
	    }, dom);
	};
	const collapseG = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        doCollapse(dom);
	    }
	    resolve();
	});

	const collapseTextwrap = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        traversalNode(isTag, node => {
	            const tagDefine = regularTag[node.nodeName];
	            // 规则执行的前提：文本容器嵌套关系
	            if (tagDefine.containTextNode && node.parentNode && regularTag[node.parentNode.nodeName].containTextNode) {
	                for (let i = node.attributes.length; i--;) {
	                    // 只要有一个非空属性，就不执行塌陷
	                    if (node.attributes[i].value.trim()) {
	                        return;
	                    }
	                }
	                node.parentNode.replaceChild(node, ...node.childNodes);
	            }
	        }, dom);
	    }
	    resolve();
	});

	const FF = 255;
	const Hundred = 100;
	const Hex = 16;
	const CIRC = 360;
	const HALF_CIRC = 180;
	const GRAD = 400;
	const RAD = Math.PI * 2;
	const matrixEPos = 4;
	const HALF = 0.5;
	const APOS_RX = 0;
	const APOS_RY = 1;
	const APOS_ROTATION = 2;
	const APOS_LARGE = 3;
	const APOS_SWEEP = 4;
	const APOS_X = 5;
	const APOS_Y = 6;
	const APOS_LEN = 7;
	const OPACITY_DIGIT = 3; // 浏览器对于颜色的 alpha 值只处理到小数点后第 3 位
	const DEFAULT_SIZE_DIGIT = 2;
	const DEFAULT_ACCURATE_DIGIT = 2;
	const DEFAULT_MATRIX_DIGIT = 3;
	// path 直线指令
	const LineTypes = 'LlHhVv';

	const toFixed = ramda.curry((digit, a) => (a < 0 ? -1 : 1) * Math.round(Math.abs(a) * Math.pow(10, digit)) / Math.pow(10, digit));

	// 移除纯小数的前导 0
	const shortenPureDecimal = (s) => s.replace(/^(-?)0\./, '$1.');

	// 浮点数转百分比
	const toPercent = (digit, n) => `${toFixed(Math.max(digit - 2, 0), n * Hundred)}%`;

	// 此工具函数用于优化同时可以用小数和百分比表示，并且二者可以互转的值，例如颜色的 alpha 值
	const shortenAlpha = (digit, s) => {
	    const perc = shortenPureDecimal(toPercent(digit, s));
	    const num = shortenPureDecimal(`${toFixed(digit, s)}`);
	    return perc.length < num.length ? perc : num;
	};

	// 转换百分比格式字符串为数值
	const validPercent = (max, n) => Math.round(Math.max(Math.min(Hundred, n), 0) * max / Hundred);
	// 转换非百分比格式字符串为数值
	const validNum = (max, n) => Math.max(Math.min(max, Math.round(n)), 0);
	// 转换字符串为数值
	const valid = (isPercent, max, n) => isPercent ? validPercent(max, +n) : validNum(max, +n);
	// 转换透明度数值
	const validOpacity = (p, n) => Math.max(Math.min(1, p ? +n / Hundred : +n), 0);

	// 缩短函数类字符串，移除其中的空白
	const shortenFunc = (s) => s.replace(/\s*([,()])\s*/g, '$1');

	const CIRC6 = CIRC / 6;
	const hsl2rgb = (h, s, l) => {
	    let _R;
	    let G;
	    let B;
	    let X;
	    let C;
	    let _h = (h % CIRC) / CIRC6;
	    C = s * 2 * (l < HALF ? l : 1 - l);
	    X = C * (1 - Math.abs(_h % 2 - 1));
	    _R = G = B = l - C / 2;
	    _h = ~~_h;
	    _R += [C, X, 0, 0, X, C][_h];
	    G += [X, C, C, X, 0, 0][_h];
	    B += [0, 0, X, C, C, X][_h];
	    return [validNum(FF, _R * FF), validNum(FF, G * FF), validNum(FF, B * FF)];
	};

	const keywords = {
	    'aliceblue': '#f0f8ff',
	    'antiquewhite': '#faebd7',
	    'aqua': '#00ffff',
	    'aquamarine': '#7fffd4',
	    'azure': '#f0ffff',
	    'beige': '#f5f5dc',
	    'bisque': '#ffe4c4',
	    'black': '#000000',
	    'blanchedalmond': '#ffebcd',
	    'blue': '#0000ff',
	    'blueviolet': '#8a2be2',
	    'brown': '#a52a2a',
	    'burlywood': '#deb887',
	    'cadetblue': '#5f9ea0',
	    'chartreuse': '#7fff00',
	    'chocolate': '#d2691e',
	    'coral': '#ff7f50',
	    'cornflowerblue': '#6495ed',
	    'cornsilk': '#fff8dc',
	    'crimson': '#dc143c',
	    'cyan': '#00ffff',
	    'darkblue': '#00008b',
	    'darkcyan': '#008b8b',
	    'darkgoldenrod': '#b8860b',
	    'darkgray': '#a9a9a9',
	    'darkgreen': '#006400',
	    'darkgrey': '#a9a9a9',
	    'darkkhaki': '#bdb76b',
	    'darkmagenta': '#8b008b',
	    'darkolivegreen': '#556b2f',
	    'darkorange': '#ff8c00',
	    'darkorchid': '#9932cc',
	    'darkred': '#8b0000',
	    'darksalmon': '#e9967a',
	    'darkseagreen': '#8fbc8f',
	    'darkslateblue': '#483d8b',
	    'darkslategray': '#2f4f4f',
	    'darkslategrey': '#2f4f4f',
	    'darkturquoise': '#00ced1',
	    'darkviolet': '#9400d3',
	    'deeppink': '#ff1493',
	    'deepskyblue': '#00bfff',
	    'dimgray': '#696969',
	    'dimgrey': '#696969',
	    'dodgerblue': '#1e90ff',
	    'firebrick': '#b22222',
	    'floralwhite': '#fffaf0',
	    'forestgreen': '#228b22',
	    'fuchsia': '#ff00ff',
	    'gainsboro': '#dcdcdc',
	    'ghostwhite': '#f8f8ff',
	    'gold': '#ffd700',
	    'goldenrod': '#daa520',
	    'gray': '#808080',
	    'green': '#008000',
	    'greenyellow': '#adff2f',
	    'grey': '#808080',
	    'honeydew': '#f0fff0',
	    'hotpink': '#ff69b4',
	    'indianred': '#cd5c5c',
	    'indigo': '#4b0082',
	    'ivory': '#fffff0',
	    'khaki': '#f0e68c',
	    'lavender': '#e6e6fa',
	    'lavenderblush': '#fff0f5',
	    'lawngreen': '#7cfc00',
	    'lemonchiffon': '#fffacd',
	    'lightblue': '#add8e6',
	    'lightcoral': '#f08080',
	    'lightcyan': '#e0ffff',
	    'lightgoldenrodyellow': '#fafad2',
	    'lightgray': '#d3d3d3',
	    'lightgreen': '#90ee90',
	    'lightgrey': '#d3d3d3',
	    'lightpink': '#ffb6c1',
	    'lightsalmon': '#ffa07a',
	    'lightseagreen': '#20b2aa',
	    'lightskyblue': '#87cefa',
	    'lightslategray': '#778899',
	    'lightslategrey': '#778899',
	    'lightsteelblue': '#b0c4de',
	    'lightyellow': '#ffffe0',
	    'lime': '#00ff00',
	    'limegreen': '#32cd32',
	    'linen': '#faf0e6',
	    'magenta': '#ff00ff',
	    'maroon': '#800000',
	    'mediumaquamarine': '#66cdaa',
	    'mediumblue': '#0000cd',
	    'mediumorchid': '#ba55d3',
	    'mediumpurple': '#9370db',
	    'mediumseagreen': '#3cb371',
	    'mediumslateblue': '#7b68ee',
	    'mediumspringgreen': '#00fa9a',
	    'mediumturquoise': '#48d1cc',
	    'mediumvioletred': '#c71585',
	    'midnightblue': '#191970',
	    'mintcream': '#f5fffa',
	    'mistyrose': '#ffe4e1',
	    'moccasin': '#ffe4b5',
	    'navajowhite': '#ffdead',
	    'navy': '#000080',
	    'oldlace': '#fdf5e6',
	    'olive': '#808000',
	    'olivedrab': '#6b8e23',
	    'orange': '#ffa500',
	    'orangered': '#ff4500',
	    'orchid': '#da70d6',
	    'palegoldenrod': '#eee8aa',
	    'palegreen': '#98fb98',
	    'paleturquoise': '#afeeee',
	    'palevioletred': '#db7093',
	    'papayawhip': '#ffefd5',
	    'peachpuff': '#ffdab9',
	    'peru': '#cd853f',
	    'pink': '#ffc0cb',
	    'plum': '#dda0dd',
	    'powderblue': '#b0e0e6',
	    'purple': '#800080',
	    'rebeccapurple': '#663399',
	    'red': '#ff0000',
	    'rosybrown': '#bc8f8f',
	    'royalblue': '#4169e1',
	    'saddlebrown': '#8b4513',
	    'salmon': '#fa8072',
	    'sandybrown': '#f4a460',
	    'seagreen': '#2e8b57',
	    'seashell': '#fff5ee',
	    'sienna': '#a0522d',
	    'silver': '#c0c0c0',
	    'skyblue': '#87ceeb',
	    'slateblue': '#6a5acd',
	    'slategray': '#708090',
	    'slategrey': '#708090',
	    'snow': '#fffafa',
	    'springgreen': '#00ff7f',
	    'steelblue': '#4682b4',
	    'tan': '#d2b48c',
	    'teal': '#008080',
	    'thistle': '#d8bfd8',
	    'tomato': '#ff6347',
	    'turquoise': '#40e0d0',
	    'violet': '#ee82ee',
	    'wheat': '#f5deb3',
	    'white': '#ffffff',
	    'whitesmoke': '#f5f5f5',
	    'yellow': '#ffff00',
	    'yellowgreen': '#9acd32',
	};

	const rgbReg = new RegExp(`^rgba?\\((${numberPattern})(%?),(${numberPattern})\\2,(${numberPattern})\\2(?:,(${numberPattern})(%?))?\\)$`, 'gi');
	const hslReg = new RegExp(`^hsla?\\((${numberPattern})((?:${angel})?),(${numberPattern})%,(${numberPattern})%(?:,(${numberPattern})(%?))?\\)$`, 'gi');
	const hexReg = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
	const alphaMap = {
	    '255': 100,
	    '252': 99,
	    '250': 98,
	    '247': 97,
	    '245': 96,
	    '242': 95,
	    '240': 94,
	    '237': 93,
	    '235': 92,
	    '232': 91,
	    '230': 90,
	    '227': 89,
	    '224': 88,
	    '222': 87,
	    '219': 86,
	    '217': 85,
	    '214': 84,
	    '212': 83,
	    '209': 82,
	    '207': 81,
	    '204': 80,
	    '201': 79,
	    '199': 78,
	    '196': 77,
	    '194': 76,
	    '191': 75,
	    '189': 74,
	    '186': 73,
	    '184': 72,
	    '181': 71,
	    '179': 70,
	    '176': 69,
	    '173': 68,
	    '171': 67,
	    '168': 66,
	    '166': 65,
	    '163': 64,
	    '161': 63,
	    '158': 62,
	    '156': 61,
	    '153': 60,
	    '150': 59,
	    '148': 58,
	    '145': 57,
	    '143': 56,
	    '140': 55,
	    '138': 54,
	    '135': 53,
	    '133': 52,
	    '130': 51,
	    '128': 50,
	    '125': 49,
	    '122': 48,
	    '120': 47,
	    '117': 46,
	    '115': 45,
	    '112': 44,
	    '110': 43,
	    '107': 42,
	    '105': 41,
	    '102': 40,
	    '99': 39,
	    '97': 38,
	    '94': 37,
	    '92': 36,
	    '89': 35,
	    '87': 34,
	    '84': 33,
	    '82': 32,
	    '79': 31,
	    '77': 30,
	    '74': 29,
	    '71': 28,
	    '69': 27,
	    '66': 26,
	    '64': 25,
	    '61': 24,
	    '59': 23,
	    '56': 22,
	    '54': 21,
	    '51': 20,
	    '48': 19,
	    '46': 18,
	    '43': 17,
	    '41': 16,
	    '38': 15,
	    '36': 14,
	    '33': 13,
	    '31': 12,
	    '28': 11,
	    '26': 10,
	    '23': 9,
	    '20': 8,
	    '18': 7,
	    '15': 6,
	    '13': 5,
	    '10': 4,
	    '8': 3,
	    '5': 2,
	    '3': 1,
	    '0': 0,
	};
	const execColor = (color, digit = OPACITY_DIGIT) => {
	    // 首先对原始字符串进行基本的格式处理和类型转换
	    let _color = color.trim();
	    if (keywords.hasOwnProperty(_color)) {
	        // 关键字转为 16 位色
	        _color = keywords[_color];
	    }
	    else if (/^(?:rgb|hsl)a?\s*\(/.test(_color)) {
	        // 缩短函数类
	        _color = shortenFunc(_color);
	    }
	    const result = {
	        r: 0,
	        g: 0,
	        b: 0,
	        a: 1,
	        origin: _color,
	        valid: true,
	    };
	    // 16 位色直接解析
	    const hexMatch = _color.match(hexReg);
	    if (hexMatch) {
	        const hex = hexMatch[1];
	        switch (hex.length) {
	            case 3:
	                result.r = parseInt(`0x${hex[0]}${hex[0]}`, Hex);
	                result.g = parseInt(`0x${hex[1]}${hex[1]}`, Hex);
	                result.b = parseInt(`0x${hex[2]}${hex[2]}`, Hex);
	                break;
	            case 4:
	                result.r = parseInt(`0x${hex[0]}${hex[0]}`, Hex);
	                result.g = parseInt(`0x${hex[1]}${hex[1]}`, Hex);
	                result.b = parseInt(`0x${hex[2]}${hex[2]}`, Hex);
	                const alpha4 = parseInt(`0x${hex[3]}${hex[3]}`, Hex);
	                result.a = ramda.has(`${alpha4}`, alphaMap) ? alphaMap[`${alpha4}`] / Hundred : alpha4 / FF;
	                break;
	            case 8:
	                result.r = parseInt(`0x${hex[0]}${hex[1]}`, Hex);
	                result.g = parseInt(`0x${hex[2]}${hex[3]}`, Hex);
	                result.b = parseInt(`0x${hex[4]}${hex[5]}`, Hex);
	                const alpha8 = parseInt(`0x${hex[6]}${hex[7]}`, Hex);
	                result.a = ramda.has(`${alpha8}`, alphaMap) ? alphaMap[`${alpha8}`] / Hundred : alpha8 / FF;
	                break;
	            default:
	                result.r = parseInt(`0x${hex[0]}${hex[1]}`, Hex);
	                result.g = parseInt(`0x${hex[2]}${hex[3]}`, Hex);
	                result.b = parseInt(`0x${hex[4]}${hex[5]}`, Hex);
	                break;
	        }
	        return result;
	    }
	    // rgb/rgba/hsl/hsla 解析
	    rgbReg.lastIndex = 0; // 重置正则表达式匹配位置
	    const rgbMatch = rgbReg.exec(_color);
	    if (rgbMatch) {
	        result.r = valid(rgbMatch[2], FF, rgbMatch[1]);
	        result.g = valid(rgbMatch[2], FF, rgbMatch[3]);
	        result.b = valid(rgbMatch[2], FF, rgbMatch[4]);
	        if (rgbMatch[5]) {
	            result.a = validOpacity(rgbMatch[6], rgbMatch[5]);
	        }
	        return result;
	    }
	    hslReg.lastIndex = 0;
	    const hslMatch = hslReg.exec(_color);
	    if (hslMatch) {
	        let hue;
	        switch (hslMatch[2].toLowerCase()) {
	            case 'grad':
	                hue = +hslMatch[1] * CIRC / GRAD;
	                break;
	            case 'rad':
	                hue = +hslMatch[1] * CIRC / RAD;
	                break;
	            case 'turn':
	                hue = +hslMatch[1] * CIRC;
	                break;
	            default: // deg 和纯数值都按照 360 解析
	                hue = +hslMatch[1];
	                break;
	        }
	        [result.r, result.g, result.b] = hsl2rgb(hue, +hslMatch[3] / Hundred, +hslMatch[4] / Hundred);
	        if (hslMatch[5]) {
	            // 考虑到转来转去可能和原始字符串不同，保留一份缩短后的 hsl 原始字符串
	            result.a = validOpacity(hslMatch[6], hslMatch[5]);
	            result.origin = `hsl(${validNum(CIRC, hue)},${validNum(Hundred, +hslMatch[3])}%,${validNum(Hundred, +hslMatch[4])}%,${shortenAlpha(digit, result.a)})`;
	        }
	        return result;
	    }
	    if (_color === 'transparent') {
	        result.a = 0;
	        return result;
	    }
	    result.valid = false;
	    return result;
	};

	const alphaReg = new RegExp(`^(${numberPattern})(%?)$`);
	// 解析 opacity 类型的值，成功解析返回 0~1 之间的数值，无法解析则返回原始字符串
	const execAlpha = (s) => {
	    const alpha = alphaReg.exec(s);
	    if (alpha) {
	        return validOpacity(alpha[2], alpha[1]);
	    }
	    return s;
	};

	const cssReg = /([^:;]+):((?:[^;'"]*?(?:(?:'[^']*?'|"[^"]*?"|\/\*.*?\*\/))*[^;'"]*?)*)(?=;|$)/gim;
	const execStyle = (styleStr) => {
	    // 此处使用数组，因为不能在解析器中排重，排重的工作要交给优化工具
	    const style = [];
	    const str = he.decode(styleStr, {
	        isAttributeValue: true,
	    });
	    // 重置正则
	    cssReg.lastIndex = 0;
	    let match = cssReg.exec(str);
	    while (match !== null) {
	        // 去除前导注释和空格
	        const name = match[1].replace(/^(?:\s*\/\*.+?\*\/\s*)*/g, '').trim().replace(/\s/g, '');
	        // 去除两端注释和冗余空格
	        const value = match[2].replace(/^(?:\s*\/\*.+?\*\/\s*)*|(?:\s*\/\*.+?\*\/\s*)*$/g, '').trim().replace(/\s+/, ' ');
	        // 只保留非空
	        if (name && value) {
	            style.push({
	                fullname: name,
	                name,
	                value,
	            });
	        }
	        match = cssReg.exec(str);
	    }
	    return style;
	};

	// 用于验证的正则表达式
	// css 选择器相关字符
	const idChar = '#[^#\\.\\[\\*:\\s]+';
	const classChar = '\\.[^#\\.\\[\\*:\\s]+';
	// tslint:disable-next-line
	const attrChar = `\\[[a-zA-Z][a-zA-Z0-9\\-]*(?:[\\|\\^\\$\\*~]?=(?:'[^']*'|"[^"]*"|[^'"\\]]+))?\\]`;
	const pseudoChar = '\\:{1,2}[a-zA-Z-]+(?:\\((?:[^\\)]+|[^\\(]+\\([^\\)]+\\))\\))?';

	// 选择器混合字符，不含后代选择器（空格）
	var selectorUnitCombinator;
	(function (selectorUnitCombinator) {
	    selectorUnitCombinator[selectorUnitCombinator[">"] = 1] = ">";
	    selectorUnitCombinator[selectorUnitCombinator["+"] = 2] = "+";
	    selectorUnitCombinator[selectorUnitCombinator["~"] = 3] = "~";
	})(selectorUnitCombinator || (selectorUnitCombinator = {}));
	// 属性选择器等号修饰符
	var attrModifier;
	(function (attrModifier) {
	    attrModifier[attrModifier["^"] = 1] = "^";
	    attrModifier[attrModifier["$"] = 2] = "$";
	    attrModifier[attrModifier["~"] = 3] = "~";
	    attrModifier[attrModifier["|"] = 4] = "|";
	    attrModifier[attrModifier["*"] = 5] = "*";
	})(attrModifier || (attrModifier = {}));

	const execSelector = (selector) => {
	    const selectors = [];
	    const selectorUnitReg = new RegExp(`^([^\\s>+~#\\.\\[:]+|\\*)?((?:${idChar}|${classChar}|${attrChar}|${pseudoChar})*)([\\s>+~]+|$)`);
	    let selectorStr = selector;
	    let selectorExec = selectorUnitReg.exec(selectorStr);
	    while (selectorExec && selectorExec[0].length) {
	        const selectorUnit = { id: [], class: [], attr: [], pseudo: [] };
	        if (selectorExec[1]) {
	            if (selectorExec[1] === '*') {
	                selectorUnit.universal = true;
	            }
	            else {
	                selectorUnit.type = selectorExec[1];
	            }
	        }
	        if (selectorExec[2]) {
	            let specialStr = selectorExec[2];
	            const specialReg = new RegExp(`^(?:${idChar}|${classChar}|${attrChar}|${pseudoChar})`);
	            let specialExec = specialReg.exec(specialStr);
	            while (specialExec) {
	                switch (specialExec[0][0]) {
	                    case '.': // class 选择器
	                        selectorUnit.class.push(specialExec[0].slice(1));
	                        break;
	                    case '[': // 属性选择器
	                        const attrStr = specialExec[0].slice(1, -1);
	                        const eqIndex = attrStr.indexOf('=');
	                        if (eqIndex === -1) {
	                            // 没有等号的情况
	                            selectorUnit.attr.push({
	                                key: attrStr,
	                            });
	                        }
	                        else {
	                            // 取出等号修饰符
	                            // tslint:disable-next-line strict-type-predicates
	                            if (typeof attrModifier[attrStr[eqIndex - 1]] === 'number') {
	                                selectorUnit.attr.push({
	                                    key: attrStr.slice(0, eqIndex - 1),
	                                    modifier: attrModifier[attrStr[eqIndex - 1]],
	                                    value: attrStr.slice(eqIndex + 1),
	                                });
	                            }
	                            else {
	                                selectorUnit.attr.push({
	                                    key: attrStr.slice(0, eqIndex),
	                                    value: attrStr.slice(eqIndex + 1),
	                                });
	                            }
	                        }
	                        break;
	                    case ':': // 伪类，伪元素
	                        const isClass = specialExec[0][1] !== ':';
	                        const pseudoStr = specialExec[0].replace(/^:+/, '');
	                        const parenIndex = pseudoStr.indexOf('(');
	                        if (parenIndex === -1) {
	                            // 不是函数型伪类
	                            selectorUnit.pseudo.push({
	                                func: pseudoStr,
	                                isClass,
	                            });
	                        }
	                        else {
	                            selectorUnit.pseudo.push({
	                                func: pseudoStr.slice(0, parenIndex),
	                                value: pseudoStr.slice(parenIndex + 1, -1),
	                                isClass,
	                            });
	                        }
	                        break;
	                    default: // id 选择器
	                        selectorUnit.id.push(specialExec[0].slice(1));
	                        break;
	                }
	                specialStr = specialStr.slice(specialExec[0].length);
	                specialExec = specialReg.exec(specialStr);
	            }
	        }
	        if (selectorExec[3]) {
	            const combinator = selectorExec[3].trim();
	            // tslint:disable-next-line strict-type-predicates
	            if (typeof selectorUnitCombinator[combinator] === 'number') {
	                selectorUnit.combinator = selectorUnitCombinator[combinator];
	            }
	        }
	        selectors.push(selectorUnit);
	        selectorStr = selectorStr.slice(selectorExec[0].length);
	        selectorExec = selectorUnitReg.exec(selectorStr);
	    }
	    return selectors;
	};

	const getSelectorPriority = (seletors) => {
	    const priority = {
	        id: 0,
	        class: 0,
	        tag: 0,
	    };
	    seletors.forEach(seletor => {
	        priority.id += seletor.id.length;
	        priority.class += seletor.class.length + seletor.pseudo.length + seletor.attr.length;
	        priority.tag += seletor.type ? 1 : 0;
	    });
	    return priority;
	};
	const overrideAble = (priority1, priority2) => {
	    if (priority1.id !== priority2.id) {
	        return priority1.id > priority2.id;
	    }
	    else if (priority1.class !== priority2.class) {
	        return priority1.class > priority2.class;
	    }
	    else if (priority1.tag !== priority2.tag) {
	        return priority1.tag > priority2.tag;
	    }
	    return true;
	};

	const getById = (idStr, dom) => {
	    let result;
	    traversalNode(n => idStr === `#${n.getAttribute('id')}`, (n) => {
	        if (!result) {
	            result = n;
	        }
	    }, dom);
	    return result;
	};

	// 验证 className
	const checkClass = (node, selector) => {
	    const className = node.getAttribute('class');
	    let classNames = [];
	    if (className) {
	        classNames = className.trim().split(/\s+/);
	    }
	    for (let ci = selector.class.length; ci--;) {
	        if (!classNames.includes(selector.class[ci])) {
	            return false;
	        }
	    }
	    return true;
	};
	// 验证 ID
	const checkID = (node, selector) => {
	    let id = node.getAttribute('id');
	    if (id) {
	        id = id.trim();
	    }
	    for (let i = selector.id.length; i--;) {
	        if (id !== selector.id[i]) {
	            return false;
	        }
	    }
	    return true;
	};
	// 验证属性
	const checkAttr = (node, selector) => {
	    for (let ai = selector.attr.length; ai--;) {
	        const attrSelector = selector.attr[ai];
	        let attr = node.getAttribute(attrSelector.key);
	        if (attr === null) {
	            return false;
	        }
	        else if (attrSelector.value) {
	            // 属性值大小写不敏感
	            attr = attr.trim().toLowerCase();
	            switch (attrSelector.modifier) {
	                // 开始字符匹配
	                case attrModifier['^']:
	                    if (attr.indexOf(attrSelector.value) !== 0) {
	                        return false;
	                    }
	                    break;
	                // 结尾字符匹配
	                // tslint:disable-next-line:no-string-literal
	                case attrModifier['$']:
	                    if (attr.lastIndexOf(attrSelector.value) !== attr.length - attrSelector.value.length) {
	                        return false;
	                    }
	                    break;
	                // 空格分组字符匹配
	                case attrModifier['~']:
	                    if (!attr.split(/\s+/).includes(attrSelector.value)) {
	                        return false;
	                    }
	                    break;
	                // 前缀字符匹配
	                case attrModifier['|']:
	                    if (attr !== attrSelector.value && attr.indexOf(`${attrSelector.value}-`) !== 0) {
	                        return false;
	                    }
	                    break;
	                // 模糊匹配
	                case attrModifier['*']:
	                    if (!attr.includes(attrSelector.value)) {
	                        return false;
	                    }
	                    break;
	                // 默认全字匹配
	                default:
	                    if (attr !== attrSelector.value) {
	                        return false;
	                    }
	                    break;
	            }
	        }
	    }
	    return true;
	};
	// 验证伪类和伪元素
	// 根据 SVG 标准只验证 CSS 2.1 规范的伪类和伪元素
	// https://www.w3.org/TR/SVG2/styling.html#RequiredCSSFeatures
	const checkPseudo = (node, selector) => {
	    for (let pi = selector.pseudo.length; pi--;) {
	        const pseudoSelector = selector.pseudo[pi];
	        if (!validPseudoClass.includes(pseudoSelector.func) && !validPseudoElement.includes(pseudoSelector.func)) {
	            return false;
	        }
	        // 命中伪元素，需要验证作用域链上是否存在文本节点 text
	        if (validPseudoElement.includes(pseudoSelector.func)) {
	            let hasText = false;
	            if (node.nodeName === 'text') {
	                hasText = true;
	            }
	            else {
	                traversalNode(isTag, (n) => {
	                    if (n.nodeName === 'text') {
	                        hasText = true;
	                    }
	                }, node);
	            }
	            if (!hasText) {
	                return false;
	            }
	        }
	    }
	    return true;
	};
	// 验证 selector 和 node 是否匹配
	const matchSelector = (selector) => (node) => {
	    if (!selector || !node) {
	        return false;
	    }
	    // 如果存在标签，则标签必须符合
	    if (selector.type && selector.type !== node.nodeName) {
	        return false;
	    }
	    // 如果存在 class 选择器，则每个 class 都要匹配
	    if (selector.class.length) {
	        if (!checkClass(node, selector)) {
	            return false;
	        }
	    }
	    // 如果存在 id 选择器，则每个 id 都要匹配
	    if (selector.id.length) {
	        if (!checkID(node, selector)) {
	            return false;
	        }
	    }
	    if (selector.attr.length) {
	        if (!checkAttr(node, selector)) {
	            return false;
	        }
	    }
	    if (selector.pseudo.length) {
	        if (!checkPseudo(node, selector)) {
	            return false;
	        }
	    }
	    return true;
	};

	// 类似 querySelectorAll 的规则，找到所有符合条件的元素
	const getBySelector = (dom, selectors) => {
	    const len = selectors.length;
	    const result = [];
	    traversalNode(ramda.both(isTag, matchSelector(selectors[len - 1])), node => {
	        let i = len - 2;
	        let currentNode = node;
	        while (i >= 0) {
	            const matchI = matchSelector(selectors[i]);
	            switch (selectors[i].combinator) {
	                // 子选择器
	                case selectorUnitCombinator['>']:
	                    if (currentNode.parentNode) {
	                        if (!matchI(currentNode.parentNode)) {
	                            return;
	                        }
	                        currentNode = currentNode.parentNode;
	                        break;
	                    }
	                    return;
	                // 相邻兄弟选择器
	                case selectorUnitCombinator['+']:
	                    if (currentNode.parentNode) {
	                        const brothers = currentNode.parentNode.childNodes;
	                        const index = brothers.indexOf(currentNode);
	                        if (index <= 0 || !matchI(brothers[index - 1])) {
	                            return;
	                        }
	                        currentNode = brothers[index - 1];
	                        break;
	                    }
	                    return;
	                // 兄弟选择器
	                case selectorUnitCombinator['~']:
	                    if (currentNode.parentNode) {
	                        const _brothers = currentNode.parentNode.childNodes;
	                        const _index = _brothers.indexOf(currentNode);
	                        if (_index <= 0) {
	                            return;
	                        }
	                        let _brother;
	                        for (let bi = _index; bi--;) {
	                            _brother = _brothers[bi];
	                            if (matchI(_brother)) {
	                                currentNode = _brother;
	                                break;
	                            }
	                        }
	                        if (currentNode !== _brother) {
	                            return;
	                        }
	                        break;
	                    }
	                    return;
	                // 后代选择器
	                default:
	                    let parent = currentNode.parentNode;
	                    while (parent) {
	                        if (matchI(parent)) {
	                            currentNode = parent;
	                            break;
	                        }
	                        parent = parent.parentNode;
	                    }
	                    if (currentNode !== parent) {
	                        return;
	                    }
	                    break;
	            }
	            i--;
	        }
	        result.push(node);
	    }, dom);
	    return result;
	};

	const check = (dom, styleItems) => {
	    traversalNode(isTag, node => {
	        let nodeStyle = {};
	        if (node.styles) {
	            nodeStyle = node.styles;
	        }
	        else {
	            node.styles = nodeStyle;
	        }
	        // 可能有 xlink 引用，css 样式会影响到 xlink 引用的节点
	        let xlinkObj;
	        node.attributes.forEach(attr => {
	            if (attr.fullname === 'style') {
	                // 行内样式优先级最高
	                const styles = execStyle(attr.value);
	                styles.forEach(style => {
	                    nodeStyle[style.name] = {
	                        value: style.value,
	                        from: 'inline',
	                    };
	                });
	            }
	            else if (attr.name === 'href') {
	                // 获取 xlink 引用
	                xlinkObj = getById(node.getAttribute(attr.fullname), dom);
	            }
	            else if (regularAttr[attr.fullname].couldBeStyle) {
	                // 属性优先级最低，但可以覆盖继承
	                const styleDefine = nodeStyle[attr.fullname];
	                // tslint:disable-next-line
	                if (!styleDefine || styleDefine.from === 'inherit') {
	                    nodeStyle[attr.fullname] = {
	                        value: attr.value,
	                        from: 'attr',
	                    };
	                }
	            }
	        });
	        // 判断 style 标签内的样式，优先级高于 attr 和 inehrit
	        styleItems.forEach(styleItem => {
	            if (styleItem.nodes.includes(node)) {
	                styleItem.styles.forEach(style => {
	                    const styleDefine = nodeStyle[style.name];
	                    // tslint:disable-next-line
	                    if (!styleDefine || styleDefine.from === 'attr' || styleDefine.from === 'inherit' || (styleDefine.from === 'styletag' && styleDefine.selectorPriority && overrideAble(styleItem.selectorPriority, styleDefine.selectorPriority))) {
	                        nodeStyle[style.name] = {
	                            value: style.value,
	                            from: 'styletag',
	                            selectorPriority: styleItem.selectorPriority,
	                        };
	                    }
	                });
	            }
	        });
	        const parentNode = node.parentNode;
	        if (parentNode && parentNode.styles) {
	            // 可能从父元素继承的样式
	            Object.keys(parentNode.styles).forEach(key => {
	                if (!nodeStyle.hasOwnProperty(key) && regularAttr[key].inherited) {
	                    nodeStyle[key] = {
	                        value: parentNode.styles[key].value,
	                        from: 'inherit',
	                    };
	                }
	            });
	        }
	        if (xlinkObj) {
	            let styleObj = {};
	            if (xlinkObj.styles) {
	                styleObj = xlinkObj.styles;
	            }
	            else {
	                xlinkObj.styles = styleObj;
	            }
	            Object.keys(nodeStyle).forEach(key => {
	                if (!styleObj.hasOwnProperty(key)) {
	                    styleObj[key] = {
	                        value: nodeStyle[key].value,
	                        from: 'inherit',
	                    };
	                }
	            });
	        }
	    }, dom);
	};
	// 解析样式树，为每个节点增加 styles 属性，标记当前节点生效的样式信息
	const execStyleTree = (dom) => {
	    // 首先清理掉曾经被解析过的样式树
	    traversalNode(isTag, node => {
	        if (node.styles) {
	            delete node.styles;
	        }
	    }, dom);
	    const styleItems = [];
	    // 记录 stylesheet 选择器权重和影响到的节点
	    if (dom.stylesheet) {
	        dom.stylesheet.stylesheet.rules.forEach((styleRule) => {
	            // 只针对规则类
	            if (styleRule.type === 'rule' && styleRule.declarations && styleRule.selectors) {
	                const styles = [];
	                styleRule.declarations.forEach((ruleItem) => {
	                    if (ruleItem.property && ruleItem.value) {
	                        styles.push({
	                            name: ruleItem.property,
	                            fullname: ruleItem.property,
	                            value: ruleItem.value,
	                        });
	                    }
	                });
	                for (let si = styleRule.selectors.length; si--;) {
	                    const selector = execSelector(styleRule.selectors[si]);
	                    const selectorPriority = getSelectorPriority(selector);
	                    const nodes = getBySelector(dom, selector);
	                    if (nodes.length) {
	                        styleItems.push({
	                            styles,
	                            selectorPriority,
	                            nodes,
	                        });
	                    }
	                }
	            }
	        });
	    }
	    check(dom, styleItems);
	};

	// 获取属性（根据 SVG 覆盖规则，css 优先）
	const getAttr = (node, key, defaultVal) => {
	    let val = defaultVal;
	    const styles = node.styles;
	    if (styles.hasOwnProperty(key)) {
	        val = styles[key].value;
	    }
	    return val;
	};

	// 合并属性和样式完全相同的路径
	// // TODO 验证路径是否相交
	// const checkPath = (str: string) => {
	// 	const paths: number[][] = [];
	// 	const pathItems = doCompute(execPath(str));
	// 	let verify = true;
	// 	let currentPath: number[] = [];
	// 	pathItems.every(item => {
	// 		switch (item.type) {
	// 			// 平移 - 绝对
	// 			case 'M':
	// 				currentPath = [item.val[0], item.val[1]];
	// 				paths.push(currentPath);
	// 				return true;
	// 			case 'm':
	// 				currentPath = [plus(item.from[0], item.val[0]), plus(item.from[1], item.val[1])];
	// 				paths.push(currentPath);
	// 				return true;
	// 			case 'Z':
	// 			case 'z':
	// 				currentPath.push(currentPath[0], currentPath[1]);
	// 				return true;
	// 			// 水平直线 - 绝对
	// 			case 'H':
	// 				item.val.forEach(val => {
	// 					currentPath.push(val, item.from[1]);
	// 				});
	// 				return true;
	// 			// 水平直线 - 相对
	// 			case 'h':
	// 				item.val.reduce((accumulator, val) => {
	// 					currentPath.push(plus(val, accumulator), item.from[1]);
	// 					return plus(val, accumulator);
	// 				}, item.from[0]);
	// 				return true;
	// 			// 垂直直线 - 绝对
	// 			case 'V':
	// 				item.val.forEach(val => {
	// 					currentPath.push(item.from[0], val);
	// 				});
	// 				return true;
	// 			// 垂直直线 - 相对
	// 			case 'v':
	// 				item.val.reduce((accumulator, val) => {
	// 					currentPath.push(item.from[0], plus(val, accumulator));
	// 					return plus(val, accumulator);
	// 				}, item.from[1]);
	// 				return true;
	// 			// 直线 - 绝对
	// 			case 'L':
	// 				currentPath.push(...item.val);
	// 				return true;
	// 			// 直线 - 相对
	// 			case 'l':
	// 				currentPath.reduce((accumulator, val, index) => {
	// 					currentPath.push(plus(accumulator[index % 2], val));
	// 					return [plus(accumulator[0], val * (1 - (index % 2))), plus(accumulator[1], val * (index % 2))];
	// 				}, item.from);
	// 				return true;
	// 			default:
	// 				verify = false;
	// 				return false;
	// 		}
	// 	});
	// 	return {
	// 		verify,
	// 		paths
	// 	};
	// }
	// const noJoin = (attr1: string, attr2: string): boolean => {
	// 	const checkResult1 = checkPath(attr1);
	// 	const checkResult2 = checkPath(attr2);
	// 	if (checkResult1.verify && checkResult2.verify) {
	// 		// TODO： 验证碰撞
	// 	}
	// 	return true;
	// }
	const canbeCombine = (node1, node2, attr, combineFill, combineOpacity) => {
	    // 不能存在任何子节点
	    if (node1.childNodes.length || node2.childNodes.length) {
	        return false;
	    }
	    // 有 marker 引用不能进行合并
	    const hasMarker = getAttr(node1, 'marker-start', 'none') !== 'none' || getAttr(node1, 'marker-mid', 'none') !== 'none' || getAttr(node1, 'marker-end', 'none') !== 'none';
	    if (hasMarker) {
	        return false;
	    }
	    const styles = node1.styles;
	    const noOpacity = !styles.hasOwnProperty('opacity') || execAlpha(styles.opacity.value) === 1;
	    const noStrokeOpacity = execColor(styles.hasOwnProperty('stroke') ? styles.stroke.value : '').a === 1 && (!styles.hasOwnProperty('stroke-opacity') || execAlpha(styles['stroke-opacity'].value) === 1);
	    const noFillOpacity = execColor(styles.hasOwnProperty('fill') ? styles.fill.value : '').a === 1 && (!styles.hasOwnProperty('fill-opacity') || execAlpha(styles['fill-opacity'].value) === 1);
	    // fill 为空
	    const noFill = styles.hasOwnProperty('fill') && styles.fill.value === 'none' && (combineOpacity || (noOpacity && noStrokeOpacity));
	    // 填充规则不能是 evenodd 必须是 nonzero
	    const noEvenOdd = !styles.hasOwnProperty('fill-rule') || styles['fill-rule'].value !== 'evenodd';
	    // stroke 为空
	    const noStroke = (!styles.hasOwnProperty('stroke') || styles.stroke.value === 'none') && (combineOpacity || (noOpacity && noFillOpacity));
	    return noFill || (combineFill && noStroke && noEvenOdd) /* || noJoin(attr.value, node2.getAttribute('d'))*/;
	};
	const getKey = (node) => {
	    const keyObj = {
	        attr: '',
	        inline: '',
	        styletag: '',
	        inherit: '',
	    };
	    const styles = node.styles;
	    Object.keys(styles).forEach(key => {
	        const define = styles[key];
	        keyObj[define.from] += `${key}=${define.value}&`;
	    });
	    return `attr:${keyObj.attr}|inline:${keyObj.inline}|styletag:${keyObj.styletag}|inherit:${keyObj.inherit}`;
	};
	const combinePath = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { disregardFill, disregardOpacity, } = rule[1];
	        execStyleTree(dom);
	        traversalNode(isTag, node => {
	            const pathChildren = {};
	            let tagIndex = 0;
	            for (let i = 0; i < node.childNodes.length; i++) {
	                const childNode = node.childNodes[i];
	                if (childNode.nodeName === 'path') {
	                    let d;
	                    let k = '';
	                    childNode.attributes.forEach(attr => {
	                        if (attr.fullname === 'd') {
	                            d = attr;
	                        }
	                        else if (attr.fullname !== 'style') {
	                            k += `${attr.fullname}=${attr.value}&`;
	                        }
	                    });
	                    if (d) {
	                        const key = `${k}|${getKey(childNode)}`;
	                        if (ramda.has(key, pathChildren)) {
	                            // 允许路径合并的条件：
	                            // 1、所有属性和样式（包括继承样式）相同
	                            // 2、相邻
	                            // 3、没有 fill 或 stroke
	                            // 4、所有可见透明度 ≥ 1
	                            // TODO 路径没有相交或包含
	                            if (pathChildren[key].index === tagIndex - 1 && canbeCombine(childNode, pathChildren[key].node, d, disregardFill, disregardOpacity)) {
	                                // 路径拼合时，第一个 m 要转为绝对，否则会有 bug
	                                pathChildren[key].attr.value += d.value.replace(/^m/, 'M');
	                                rmNode(childNode);
	                                tagIndex--;
	                                i--;
	                            }
	                            else {
	                                pathChildren[key] = {
	                                    attr: d,
	                                    index: tagIndex,
	                                    node: childNode,
	                                };
	                            }
	                        }
	                        else {
	                            pathChildren[key] = {
	                                attr: d,
	                                index: tagIndex,
	                                node: childNode,
	                            };
	                        }
	                    }
	                }
	                if (isTag(childNode)) {
	                    tagIndex++;
	                }
	            }
	        }, dom);
	    }
	    resolve();
	});

	/*
	 * 以字符串的形式返回小数部分
	 */
	const decimal = (a) => {
	    const astr = `${a}`;
	    return astr.includes('.') ? astr.slice(astr.indexOf('.') + 1) : '';
	};

	/*
	 * 保证精度的乘法
	 * 用于解决 双精度浮点数 导致精度变化的问题
	 */
	const multiply = ramda.curry((a, b) => toFixed(decimal(a).length + decimal(b).length, a * b));

	/*
	 * 返回两个小数的最大精度
	 */
	const digit = ramda.curry((a, b) => Math.max(decimal(a).length, decimal(b).length));

	/*
	 * 保证精度的加法
	 * 用于解决 双精度浮点数 导致精度变化的问题
	 */
	const plus = ramda.curry((a, b) => toFixed(digit(a, b), a + b));

	const HALF_CIRC$1 = 180;
	class Matrix {
	    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
	        this.a = a;
	        this.b = b;
	        this.c = c;
	        this.d = d;
	        this.e = e;
	        this.f = f;
	    }
	    translate(x, y) {
	        return this.multiply(new Matrix(1, 0, 0, 1, x, y));
	    }
	    rotate(corner) {
	        const arg = corner * Math.PI / HALF_CIRC$1;
	        return this.multiply(new Matrix(Math.cos(arg), Math.sin(arg), -Math.sin(arg), Math.cos(arg), 0, 0));
	    }
	    scale(xscale, yscale = null) {
	        return this.multiply(new Matrix(xscale, 0, 0, yscale === null ? xscale : yscale, 0, 0));
	    }
	    skewX(corner) {
	        const skew = corner * Math.PI / HALF_CIRC$1;
	        return this.multiply(new Matrix(1, 0, Math.tan(skew), 1, 0, 0));
	    }
	    skewY(corner) {
	        const skew = corner * Math.PI / HALF_CIRC$1;
	        return this.multiply(new Matrix(1, Math.tan(skew), 0, 1, 0, 0));
	    }
	    multiply(m) {
	        const a = this.a * m.a + this.c * m.b;
	        const b = this.b * m.a + this.d * m.b;
	        const c = this.a * m.c + this.c * m.d;
	        const d = this.b * m.c + this.d * m.d;
	        const e = this.a * m.e + this.c * m.f + this.e;
	        const f = this.b * m.e + this.d * m.f + this.f;
	        this.a = a;
	        this.b = b;
	        this.c = c;
	        this.d = d;
	        this.e = e;
	        this.f = f;
	        return this;
	    }
	}

	const aPos = 0;
	const bPos = 1;
	const cPos = 2;
	const dPos = 3;
	const ePos = 4;
	const fPos = 5;
	// 把 matrix 函数反转为简单函数
	const simplify = (matrix, digit1, digit2) => {
	    const mVal = matrix.val.map((v, i) => toFixed((i < matrixEPos) ? digit1 : digit2, v)).join(',');
	    const fixed1 = toFixed(digit1);
	    const fixed2 = toFixed(digit2);
	    if (/^1,0,0,1/.test(mVal)) {
	        return {
	            type: 'translate',
	            val: fixed2(matrix.val[fPos]) === 0 ? [matrix.val[ePos]] : [matrix.val[ePos], matrix.val[fPos]],
	        };
	    }
	    if (/^[^,]+,0,0,[^,]+,0,0/.test(mVal)) {
	        return {
	            type: 'scale',
	            val: fixed1(matrix.val[aPos]) === fixed1(matrix.val[dPos]) ? [matrix.val[aPos]] : [matrix.val[aPos], matrix.val[dPos]],
	        };
	    }
	    if (/^1,0,[^,]+,1,0,0/.test(mVal)) {
	        let corner = (Math.atan(matrix.val[cPos]) * HALF_CIRC / Math.PI + CIRC) % CIRC;
	        if (corner > CIRC - 10) {
	            corner -= CIRC;
	        }
	        return {
	            type: 'skewX',
	            val: [corner],
	        };
	    }
	    if (/^1,[^,]+,0,1,0,0/.test(mVal)) {
	        let corner = (Math.atan(matrix.val[bPos]) * HALF_CIRC / Math.PI + CIRC) % CIRC;
	        if (corner > CIRC - 10) {
	            corner -= CIRC;
	        }
	        return {
	            type: 'skewY',
	            val: [corner],
	        };
	    }
	    if (fixed1(matrix.val[aPos]) === fixed1(matrix.val[dPos])
	        &&
	            fixed1(matrix.val[bPos]) === -fixed1(matrix.val[cPos])
	        &&
	            fixed1(Math.pow(matrix.val[aPos], 2) + Math.pow(matrix.val[bPos], 2)) === 1) {
	        let arc;
	        if (matrix.val[aPos] >= 0) {
	            arc = Math.asin(matrix.val[bPos]);
	        }
	        else {
	            if (matrix.val[bPos] >= 0) {
	                arc = Math.acos(matrix.val[aPos]);
	            }
	            else {
	                arc = -Math.acos(matrix.val[aPos]);
	            }
	        }
	        let corner = (arc * HALF_CIRC / Math.PI + CIRC) % CIRC;
	        if (corner > CIRC - 10) {
	            corner -= CIRC;
	        }
	        // [1,0,0,1,x,y].[a,b,c,d,0,0].[1,0,0,1,-x,-y] = [a,b,c,d,e,f]，根据该公式反解
	        const cx = (matrix.val[ePos] * (1 - matrix.val[aPos]) - matrix.val[bPos] * matrix.val[fPos]) / (2 - matrix.val[aPos] * 2);
	        const cy = (cx * matrix.val[bPos] + matrix.val[fPos]) / (1 - matrix.val[dPos]);
	        return {
	            type: 'rotate',
	            val: [corner, cx, cy],
	        };
	    }
	    return matrix;
	};

	// 降低 transform 函数的参数精度，移除冗余参数，并对无效函数打上标记
	const shorten = (m, digit1 = DEFAULT_MATRIX_DIGIT, digit2 = DEFAULT_SIZE_DIGIT, digit3 = DEFAULT_ACCURATE_DIGIT) => {
	    const res = {
	        type: m.type,
	        val: [],
	    };
	    switch (m.type) {
	        case 'translate':
	            m.val.forEach((v, i) => {
	                res.val[i] = toFixed(digit2, v);
	            });
	            if (res.val[1] === 0) {
	                res.val.length = 1;
	            }
	            if (res.val[0] === 0) {
	                res.val[0] = 0;
	                if (res.val.length === 1) {
	                    res.noEffect = true;
	                }
	            }
	            break;
	        case 'scale':
	            m.val.forEach((v, i) => {
	                res.val[i] = toFixed(digit1, v);
	            });
	            if (res.val[0] === res.val[1]) {
	                res.val.length = 1;
	            }
	            if (res.val[0] === 1 && res.val.length === 1) {
	                res.noEffect = true;
	            }
	            break;
	        case 'rotate':
	            res.val[0] = toFixed(digit3, m.val[0]);
	            if (res.val[0] === 0) {
	                res.val[0] = 0;
	                res.noEffect = true;
	            }
	            if (m.val.length === 3) {
	                res.val[1] = toFixed(digit2, m.val[1]);
	                res.val[2] = toFixed(digit2, m.val[2]);
	                if (res.val[1] === 0 && res.val[2] === 0) {
	                    res.val.length = 1;
	                }
	            }
	            break;
	        case 'skewX':
	        case 'skewY':
	            res.val[0] = toFixed(digit3, m.val[0]);
	            if (res.val[0] === 0) {
	                res.val[0] = 0;
	                res.noEffect = true;
	            }
	            break;
	        default:
	            const _res = simplify(m, digit1, digit2);
	            if (_res.type === 'matrix') {
	                _res.val.forEach((v, i) => {
	                    res.val[i] = toFixed((i < matrixEPos) ? digit1 : digit2, v);
	                });
	                break;
	            }
	            else {
	                return shorten(_res, digit1, digit2, digit3);
	            }
	    }
	    return res;
	};

	const combineMatrix = (operate, digit1 = DEFAULT_MATRIX_DIGIT, digit2 = DEFAULT_SIZE_DIGIT, digit3 = DEFAULT_ACCURATE_DIGIT) => {
	    let matrix = new Matrix();
	    for (const item of operate) {
	        switch (item.type) {
	            case 'translate':
	                matrix = matrix.translate(item.val[0], item.val[1]);
	                break;
	            case 'rotate':
	                if (item.val.length === 3) {
	                    matrix = matrix.translate(item.val[1], item.val[2]);
	                    matrix = matrix.rotate(item.val[0]);
	                    matrix = matrix.translate(-item.val[1], -item.val[2]);
	                }
	                else {
	                    matrix = matrix.rotate(item.val[0]);
	                }
	                break;
	            case 'scale':
	                matrix = matrix.scale(item.val[0], ...item.val.slice(1));
	                break;
	            case 'skewX':
	                matrix = matrix.skewX(item.val[0]);
	                break;
	            case 'skewY':
	                matrix = matrix.skewY(item.val[0]);
	                break;
	            default:
	                matrix = matrix.multiply(new Matrix(...item.val));
	                break;
	        }
	    }
	    return shorten({
	        type: 'matrix',
	        val: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f],
	    }, digit1, digit2, digit3);
	};

	const execNumberList = (s) => {
	    const result = [];
	    // 首先全字匹配字符串，不符合的直接退出
	    if (numberListFullMatch.test(s)) {
	        // 重要！含有 g 修饰符的正则表达式 exec 时要先重置！
	        numberGlobal.lastIndex = 0;
	        let matches = numberGlobal.exec(s);
	        while (matches) {
	            result.push(+matches[0]);
	            matches = numberGlobal.exec(s);
	        }
	    }
	    return result;
	};

	const matrixSingle = `(translate|scale|rotate|skewX|skewY|matrix)\\s*\\(\\s*(${numberPattern}(?:${commaWsp}${numberPattern})*)\\s*\\)`;
	const matrixReg = new RegExp(matrixSingle, 'gm');
	const matrixFullReg = new RegExp(`^${matrixSingle}(?:${commaWsp}${matrixSingle})*$`, 'm');
	const matrixValLen = 6;
	const execMatrix = (str) => {
	    const result = [];
	    // 首先全字匹配完整的字符串，不匹配的直接退出
	    if (matrixFullReg.test(str.trim())) {
	        // 重置正则匹配位置
	        matrixReg.lastIndex = 0;
	        let match = matrixReg.exec(str);
	        while (match !== null) {
	            const val = execNumberList(match[2]);
	            // 验证参数的个数是否合法，不合法的直接退出
	            if (match[1] === 'translate' || match[1] === 'scale') {
	                if (val.length > 2) {
	                    return [];
	                }
	            }
	            else if (match[1] === 'matrix') {
	                if (val.length !== matrixValLen) {
	                    return [];
	                }
	            }
	            else if (match[1] === 'rotate') {
	                if (val.length !== 1 && val.length !== 3) {
	                    return [];
	                }
	            }
	            else {
	                if (val.length !== 1) {
	                    return [];
	                }
	            }
	            result.push({
	                type: match[1],
	                val,
	            });
	            match = matrixReg.exec(str);
	        }
	    }
	    return result;
	};

	const merge = (func1, func2, digit1 = DEFAULT_MATRIX_DIGIT, digit2 = DEFAULT_SIZE_DIGIT, digit3 = DEFAULT_ACCURATE_DIGIT) => {
	    let resFunc = {
	        type: func1.type,
	        val: [],
	    };
	    switch (func1.type) {
	        case 'translate':
	            if (func1.val.length === 1) {
	                func1.val[1] = 0;
	            }
	            if (func2.val.length === 1) {
	                func2.val[1] = 0;
	            }
	            resFunc.val = [func1.val[0] + func2.val[0], func1.val[1] + func2.val[1]];
	            break;
	        case 'scale':
	            if (func1.val.length === 1) {
	                func1.val[1] = func1.val[0];
	            }
	            if (func2.val.length === 1) {
	                func2.val[1] = func2.val[0];
	            }
	            resFunc.val = [func1.val[0] * func2.val[0], func1.val[1] * func2.val[1]];
	            break;
	        case 'rotate':
	            if (func1.val.length === 1 && func2.val.length === 1) {
	                resFunc.val[0] = func1.val[0] + func2.val[0];
	            }
	            else if (func1.val[1] === func2.val[1] && func1.val[2] === func2.val[2]) {
	                resFunc.val = [func1.val[0] + func2.val[0], func1.val[1], func1.val[2]];
	            }
	            else {
	                resFunc = combineMatrix([func1, func2], digit1, digit2, digit3);
	            }
	            break;
	        case 'skewX':
	        case 'skewY':
	            resFunc = combineMatrix([func1, func2], digit1, digit2, digit3);
	            break;
	        default:
	            return combineMatrix([func1, func2], digit1, digit2, digit3);
	    }
	    return shorten(resFunc, digit1, digit2, digit3);
	};

	const toScientific = (s) => {
	    const sStr = s.toString();
	    let _s = sStr;
	    let e = 0;
	    while (_s.slice(-1) === '0') {
	        _s = _s.slice(0, -1);
	        e++;
	    }
	    _s = `${_s}e${e}`;
	    return _s.length <= sStr.length ? _s : sStr;
	};

	const shortenNumber = ramda.pipe(toScientific, shortenPureDecimal);

	const shortenNumberList = (s) => s.trim().replace(/\s*,\s*|\s+/g, ',').replace(/,(?=[+-]\.?\d+)/g, '').replace(/([\.eE]\d+),(?=\.\d+)/g, '$1');

	// 将函数类参数转为字符串，并优化（转科学计数法，移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号）
	const stringifyFuncVal = (s) => shortenNumberList(s.map(shortenNumber).join(','));

	const stringify = (m, digit1 = DEFAULT_MATRIX_DIGIT, digit2 = DEFAULT_SIZE_DIGIT, digit3 = DEFAULT_ACCURATE_DIGIT) => {
	    let result = '';
	    m.forEach((v, i) => {
	        const _v = shorten(v, digit1, digit2, digit3);
	        if (!_v.noEffect) {
	            result += `${_v.type}(${stringifyFuncVal(_v.val)})`;
	        }
	    });
	    return result;
	};

	/*
	 * 保证精度的减法
	 * 用于解决 双精度浮点数 导致精度变化的问题
	 */
	const minus = ramda.curry((a, b) => toFixed(digit(a, b), a - b));

	const numberLength = (num) => shortenNumberList(num.map(shortenNumber).join(',')).length;

	const computeH = (absolute, relative, pathResult, pos) => {
	    const relLen = numberLength([relative]);
	    const absLen = numberLength([absolute]);
	    if (relLen === absLen) { // 如果相等则参照前一个指令
	        if (pathResult[pathResult.length - 1].type === 'H') {
	            pathResult.push({
	                type: 'H',
	                from: pos.slice(),
	                val: [absolute],
	            });
	        }
	        else {
	            pathResult.push({
	                type: 'h',
	                from: pos.slice(),
	                val: [relative],
	            });
	        }
	    }
	    else if (relLen < absLen) {
	        pathResult.push({
	            type: 'h',
	            from: pos.slice(),
	            val: [relative],
	        });
	    }
	    else {
	        pathResult.push({
	            type: 'H',
	            from: pos.slice(),
	            val: [absolute],
	        });
	    }
	    return [absolute, pos[1]];
	};

	const computeV = (absolute, relative, pathResult, pos) => {
	    const relLen = numberLength([relative]);
	    const absLen = numberLength([absolute]);
	    if (relLen === absLen) { // 如果相等则参照前一个指令
	        if (pathResult[pathResult.length - 1].type === 'V') {
	            pathResult.push({
	                type: 'V',
	                from: pos.slice(),
	                val: [absolute],
	            });
	        }
	        else {
	            pathResult.push({
	                type: 'v',
	                from: pos.slice(),
	                val: [relative],
	            });
	        }
	    }
	    else if (relLen < absLen) {
	        pathResult.push({
	            type: 'v',
	            from: pos.slice(),
	            val: [relative],
	        });
	    }
	    else {
	        pathResult.push({
	            type: 'V',
	            from: pos.slice(),
	            val: [absolute],
	        });
	    }
	    return [pos[0], absolute];
	};

	const computeL = (absolute, relative, pathResult, pos) => {
	    // 需要转为水平或垂直的情况
	    // 注意，0 长度的线段不能省略，它可能也是有意义的 @by wangfeng-pd @v1.5.0
	    // https://www.w3.org/TR/SVG/paths.html#ZeroLengthSegments
	    if (relative[1] === 0) {
	        return computeH(absolute[0], relative[0], pathResult, pos);
	    }
	    else if (relative[0] === 0) {
	        return computeV(absolute[1], relative[1], pathResult, pos);
	    }
	    // 普通情况
	    const relLen = numberLength(relative);
	    const absLen = numberLength(absolute);
	    if (relLen === absLen) { // 如果相等则参照前一个指令
	        if (pathResult[pathResult.length - 1].type === 'L') {
	            pathResult.push({
	                type: 'L',
	                from: pos.slice(),
	                val: absolute.slice(),
	            });
	        }
	        else {
	            pathResult.push({
	                type: 'l',
	                from: pos.slice(),
	                val: relative.slice(),
	            });
	        }
	    }
	    else if (relLen < absLen) {
	        pathResult.push({
	            type: 'l',
	            from: pos.slice(),
	            val: relative.slice(),
	        });
	    }
	    else {
	        pathResult.push({
	            type: 'L',
	            from: pos.slice(),
	            val: absolute.slice(),
	        });
	    }
	    return absolute.slice();
	};

	const computeA = (absolute, relative, pathResult, pos) => {
	    // https://www.w3.org/TR/SVG/paths.html#ArcOutOfRangeParameters
	    // 起始点和目标点重合，或者有一个半径为 0，可以转直线指令
	    if ((absolute[APOS_X] === pos[0] && absolute[APOS_Y] === pos[1]) || absolute[APOS_RX] === 0 || absolute[APOS_RY] === 0) {
	        return computeL([absolute[APOS_X], absolute[APOS_Y]], [relative[APOS_X], relative[APOS_Y]], pathResult, pos);
	    }
	    // 负数半径取绝对值
	    if (absolute[APOS_RX] < 0) {
	        absolute[APOS_RX] = Math.abs(absolute[APOS_RX]);
	    }
	    if (absolute[APOS_RY] < 0) {
	        absolute[APOS_RY] = Math.abs(absolute[APOS_RY]);
	    }
	    const rLen = pathResult.length;
	    const relLen = numberLength(relative);
	    const absLen = numberLength(absolute);
	    if (relLen === absLen) { // 如果相等则参照前一个指令
	        if (pathResult[rLen - 1].type === 'A') {
	            pathResult.push({
	                type: 'A',
	                from: pos.slice(),
	                val: absolute,
	            });
	        }
	        else {
	            pathResult.push({
	                type: 'a',
	                from: pos.slice(),
	                val: relative,
	            });
	        }
	    }
	    else if (relLen < absLen) {
	        pathResult.push({
	            type: 'a',
	            from: pos.slice(),
	            val: relative,
	        });
	    }
	    else {
	        pathResult.push({
	            type: 'A',
	            from: pos.slice(),
	            val: absolute,
	        });
	    }
	    return [absolute[APOS_X], absolute[APOS_Y]];
	};

	const SPOS_X = 2;
	const SPOS_Y = 3;
	const computeS = (absolute, relative, pathResult, pos) => {
	    const relLen = numberLength(relative);
	    const absLen = numberLength(absolute);
	    if (relLen === absLen) { // 如果相等则参照前一个指令
	        if (pathResult[pathResult.length - 1].type === 'S') {
	            pathResult.push({
	                type: 'S',
	                from: pos.slice(),
	                val: absolute.slice(),
	            });
	        }
	        else {
	            pathResult.push({
	                type: 's',
	                from: pos.slice(),
	                val: relative.slice(),
	            });
	        }
	    }
	    else if (relLen < absLen) {
	        pathResult.push({
	            type: 's',
	            from: pos.slice(),
	            val: relative.slice(),
	        });
	    }
	    else {
	        pathResult.push({
	            type: 'S',
	            from: pos.slice(),
	            val: absolute.slice(),
	        });
	    }
	    return [absolute[SPOS_X], absolute[SPOS_Y]];
	};

	// 获取 a 相对于 b 的对称值
	const symmetry = ramda.curry((a, b) => plus(b, minus(b, a)));

	// 匹配贝塞尔曲线的控制点
	const matchControl = (ctrl1X, ctrl1Y, centerX, centerY, ctrl2X, ctrl2Y) => symmetry(ctrl1X, centerX) === ctrl2X && symmetry(ctrl1Y, centerY) === ctrl2Y;

	const canTransformS = (pathResult, ctrlX, ctrlY, from) => {
	    const lastItem = pathResult[pathResult.length - 1];
	    const type = lastItem.type;
	    switch (type) {
	        case 'C':
	            return matchControl(lastItem.val[2], lastItem.val[3], from[0], from[1], ctrlX, ctrlY);
	        case 'c':
	            return matchControl(plus(lastItem.val[2], lastItem.from[0]), plus(lastItem.val[3], lastItem.from[1]), from[0], from[1], ctrlX, ctrlY);
	        case 'S':
	            return matchControl(lastItem.val[0], lastItem.val[1], from[0], from[1], ctrlX, ctrlY);
	        case 's':
	            return matchControl(plus(lastItem.val[0], lastItem.from[0]), plus(lastItem.val[1], lastItem.from[1]), from[0], from[1], ctrlX, ctrlY);
	        default:
	            // 前置不是 c/s 指令，则可以根据控制点和 from 是否重合来决定是否可以转为 s
	            return ctrlX === from[0] && ctrlY === from[1];
	    }
	};
	const computeC = (absolute, relative, pathResult, pos) => {
	    if (canTransformS(pathResult, absolute[0], absolute[1], pos)) {
	        return computeS(absolute.slice(2), relative.slice(2), pathResult, pos);
	    }
	    else {
	        // 普通情况
	        const relLen = numberLength(relative);
	        const absLen = numberLength(absolute);
	        if (relLen === absLen) { // 如果相等则参照前一个指令
	            if (pathResult[pathResult.length - 1].type === 'C') {
	                pathResult.push({
	                    type: 'C',
	                    from: pos.slice(),
	                    val: absolute.slice(),
	                });
	            }
	            else {
	                pathResult.push({
	                    type: 'c',
	                    from: pos.slice(),
	                    val: relative.slice(),
	                });
	            }
	        }
	        else if (relLen < absLen) {
	            pathResult.push({
	                type: 'c',
	                from: pos.slice(),
	                val: relative.slice(),
	            });
	        }
	        else {
	            pathResult.push({
	                type: 'C',
	                from: pos.slice(),
	                val: absolute.slice(),
	            });
	        }
	        return [absolute[4], absolute[5]];
	    }
	};

	const computeM = (absolute, relative, pathResult, pos) => {
	    if (ramda.lt(numberLength(absolute), numberLength(relative))) {
	        pathResult.push({
	            type: 'M',
	            from: pos.slice(),
	            val: absolute.slice(),
	        });
	    }
	    else {
	        pathResult.push({
	            type: 'm',
	            from: pos.slice(),
	            val: relative.slice(),
	        });
	    }
	    return absolute.slice();
	};

	const computeT = (absolute, relative, pathResult, pos) => {
	    // t 类型的 from 会存储 4 个值，前 2 个为前一个指令的 absolute，后 2 个存储本指令未记录的控制点的绝对坐标
	    const from = pos.slice();
	    const lastItem = pathResult[pathResult.length - 1];
	    switch (lastItem.type) {
	        case 'T':
	        case 't':
	            from.push(symmetry(lastItem.from[2], from[0]), symmetry(lastItem.from[3], from[1]));
	            break;
	        case 'Q':
	            from.push(symmetry(lastItem.val[0], from[0]), symmetry(lastItem.val[1], from[1]));
	            break;
	        case 'q':
	            from.push(symmetry(plus(lastItem.val[0], lastItem.from[0]), from[0]), symmetry(plus(lastItem.val[1], lastItem.from[1]), from[1]));
	            break;
	        default:
	            // 前置不是 q/t 指令，则控制点与 from 相同
	            from.push(from[0], from[1]);
	            break;
	    }
	    const relLen = numberLength(relative);
	    const absLen = numberLength(absolute);
	    if (relLen === absLen) { // 如果相等则参照前一个指令
	        if (pathResult[pathResult.length - 1].type === 'T') {
	            pathResult.push({
	                type: 'T',
	                from,
	                val: absolute.slice(),
	            });
	        }
	        else {
	            pathResult.push({
	                type: 't',
	                from,
	                val: relative.slice(),
	            });
	        }
	    }
	    else if (relLen < absLen) {
	        pathResult.push({
	            type: 't',
	            from,
	            val: relative.slice(),
	        });
	    }
	    else {
	        pathResult.push({
	            type: 'T',
	            from,
	            val: absolute.slice(),
	        });
	    }
	    return absolute.slice();
	};

	const canTransformT = (pathResult, ctrlX, ctrlY, from) => {
	    const lastItem = pathResult[pathResult.length - 1];
	    const type = lastItem.type;
	    switch (type) {
	        case 'Q':
	            return matchControl(lastItem.val[0], lastItem.val[1], from[0], from[1], ctrlX, ctrlY);
	        case 'q':
	            return matchControl(plus(lastItem.val[0], lastItem.from[0]), plus(lastItem.val[1], lastItem.from[1]), from[0], from[1], ctrlX, ctrlY);
	        case 'T':
	        case 't':
	            return matchControl(lastItem.from[2], lastItem.from[3], from[0], from[1], ctrlX, ctrlY);
	        default:
	            // 前置不是 q/t 指令，则可以根据控制点和 from 是否重合来决定是否可以转为 t
	            return ramda.equals([ctrlX, ctrlY], from);
	    }
	};
	const computeQ = (absolute, relative, pathResult, pos) => {
	    if (canTransformT(pathResult, absolute[0], absolute[1], pos)) {
	        return computeT(absolute.slice(2), relative.slice(2), pathResult, pos);
	    }
	    else {
	        // 普通情况
	        const relLen = numberLength(relative);
	        const absLen = numberLength(absolute);
	        if (relLen === absLen) { // 如果相等则参照前一个指令
	            if (pathResult[pathResult.length - 1].type === 'Q') {
	                pathResult.push({
	                    type: 'Q',
	                    from: pos.slice(),
	                    val: absolute.slice(),
	                });
	            }
	            else {
	                pathResult.push({
	                    type: 'q',
	                    from: pos.slice(),
	                    val: relative.slice(),
	                });
	            }
	        }
	        else if (relLen < absLen) {
	            pathResult.push({
	                type: 'q',
	                from: pos.slice(),
	                val: relative.slice(),
	            });
	        }
	        else {
	            pathResult.push({
	                type: 'Q',
	                from: pos.slice(),
	                val: absolute.slice(),
	            });
	        }
	        return [absolute[2], absolute[3]];
	    }
	};

	const computeZ = (pathResult, pos) => {
	    const rLen = pathResult.length;
	    const lastItem = pathResult[rLen - 1];
	    // 如果 z 指令紧跟着 z 指令，直接抛弃
	    if (lastItem.type.toLowerCase() === 'z') {
	        return pos;
	    }
	    const zpos = (pathResult[0].type === 'm') ? [plus(pathResult[0].val[0], pathResult[0].from[0]), plus(pathResult[0].val[1], pathResult[0].from[1])] : [pathResult[0].val[0], pathResult[0].val[1]];
	    pathResult.push({
	        type: 'z',
	        from: pos.slice(),
	        val: [],
	    });
	    return zpos;
	};

	const rel2abs = (val, pos) => val.map((s, index) => plus(s, pos[index % 2]));
	const abs2rel = (val, pos) => val.map((s, index) => minus(s, pos[index % 2]));
	const getRelHV = (pathItem) => {
	    const isRel = pathItem.type === pathItem.type.toLowerCase();
	    if (isRel)
	        return pathItem.val[0];
	    const isH = pathItem.type.toLowerCase() === 'h';
	    return minus(pathItem.val[0], pathItem.from[isH ? 0 : 1]);
	};
	const getAbsHV = (pathItem) => {
	    const isAbs = pathItem.type === pathItem.type.toUpperCase();
	    if (isAbs)
	        return pathItem.val[0];
	    const isH = pathItem.type.toLowerCase() === 'h';
	    return plus(pathItem.val[0], pathItem.from[isH ? 0 : 1]);
	};
	const getRel = (pathItem) => pathItem.type === pathItem.type.toLowerCase() ? pathItem.val.slice() : abs2rel(pathItem.val, pathItem.from);
	const getAbs = (pathItem) => pathItem.type === pathItem.type.toUpperCase() ? pathItem.val.slice() : rel2abs(pathItem.val, pathItem.from);

	const cArgLen = 6;
	const sArgLen = 4;
	const qArgLen = 4;
	const doCompute = (pathArr) => {
	    const result = [];
	    let pos = [0, 0];
	    // tslint:disable-next-line:cyclomatic-complexity
	    for (const subPath of pathArr) {
	        const pathResult = [];
	        for (const pathItem of subPath) {
	            switch (pathItem.type) {
	                // 平移 - 绝对
	                case 'M':
	                    // 当移动指令超过 2 个时，后续指令按平移处理 - fixed@v1.4.2
	                    for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
	                        const handler = (i === 0) ? computeM : computeL;
	                        pos = handler([pathItem.val[i], pathItem.val[i + 1]], abs2rel([pathItem.val[i], pathItem.val[i + 1]], pos), pathResult, pos);
	                    }
	                    break;
	                // 平移 - 相对
	                case 'm':
	                    // 当移动指令超过 2 个时，后续指令按平移处理 - fixed@v1.4.2
	                    for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
	                        const handler = (i === 0) ? computeM : computeL;
	                        pos = handler(rel2abs([pathItem.val[i], pathItem.val[i + 1]], pos), [pathItem.val[i], pathItem.val[i + 1]], pathResult, pos);
	                    }
	                    break;
	                // 水平直线 - 绝对
	                case 'H':
	                    for (let i = 0, l = pathItem.val.length; i < l; i++) {
	                        pos = computeH(pathItem.val[i], minus(pathItem.val[i], pos[0]), pathResult, pos);
	                    }
	                    break;
	                // 水平直线 - 相对
	                case 'h':
	                    for (let i = 0, l = pathItem.val.length; i < l; i++) {
	                        pos = computeH(plus(pathItem.val[i], pos[0]), pathItem.val[i], pathResult, pos);
	                    }
	                    break;
	                // 垂直直线 - 绝对
	                case 'V':
	                    for (let i = 0, l = pathItem.val.length; i < l; i++) {
	                        pos = computeV(pathItem.val[i], minus(pathItem.val[i], pos[1]), pathResult, pos);
	                    }
	                    break;
	                // 垂直直线 - 相对
	                case 'v':
	                    for (let i = 0, l = pathItem.val.length; i < l; i++) {
	                        pos = computeV(plus(pathItem.val[i], pos[1]), pathItem.val[i], pathResult, pos);
	                    }
	                    break;
	                // 直线 - 绝对
	                case 'L':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
	                        pos = computeL([pathItem.val[i], pathItem.val[i + 1]], abs2rel([pathItem.val[i], pathItem.val[i + 1]], pos), pathResult, pos);
	                    }
	                    break;
	                // 直线 - 相对
	                case 'l':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
	                        pos = computeL(rel2abs([pathItem.val[i], pathItem.val[i + 1]], pos), [pathItem.val[i], pathItem.val[i + 1]], pathResult, pos);
	                    }
	                    break;
	                // 三次贝塞尔曲线 - 绝对
	                case 'C':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += cArgLen) {
	                        const CArgs = pathItem.val.slice(i, i + cArgLen);
	                        pos = computeC(CArgs, abs2rel(CArgs, pos), pathResult, pos);
	                    }
	                    break;
	                // 三次贝塞尔曲线 - 相对
	                case 'c':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += cArgLen) {
	                        const cArgs = pathItem.val.slice(i, i + cArgLen);
	                        pos = computeC(rel2abs(cArgs, pos), cArgs, pathResult, pos);
	                    }
	                    break;
	                // 三次连续贝塞尔曲线 - 绝对
	                case 'S':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += sArgLen) {
	                        const SArgs = pathItem.val.slice(i, i + sArgLen);
	                        pos = computeS(SArgs, abs2rel(SArgs, pos), pathResult, pos);
	                    }
	                    break;
	                // 三次连续贝塞尔曲线 - 相对
	                case 's':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += sArgLen) {
	                        const sArgs = pathItem.val.slice(i, i + sArgLen);
	                        pos = computeS(rel2abs(sArgs, pos), sArgs, pathResult, pos);
	                    }
	                    break;
	                // 二次贝塞尔曲线 - 绝对
	                case 'Q':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += qArgLen) {
	                        const QArgs = pathItem.val.slice(i, i + qArgLen);
	                        pos = computeQ(QArgs, abs2rel(QArgs, pos), pathResult, pos);
	                    }
	                    break;
	                // 二次贝塞尔曲线 - 相对
	                case 'q':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += qArgLen) {
	                        const qArgs = pathItem.val.slice(i, i + qArgLen);
	                        pos = computeQ(rel2abs(qArgs, pos), qArgs, pathResult, pos);
	                    }
	                    break;
	                // 二次连续贝塞尔曲线 - 绝对
	                case 'T':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
	                        const TArgs = pathItem.val.slice(i, i + 2);
	                        pos = computeT(TArgs, abs2rel(TArgs, pos), pathResult, pos);
	                    }
	                    break;
	                // 二次连续贝塞尔曲线 - 相对
	                case 't':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
	                        const tArgs = pathItem.val.slice(i, i + 2);
	                        pos = computeT(rel2abs(tArgs, pos), tArgs, pathResult, pos);
	                    }
	                    break;
	                // 圆弧 - 绝对
	                case 'A':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += APOS_LEN) {
	                        const AArgs = pathItem.val.slice(i, i + APOS_LEN);
	                        pos = computeA(AArgs, AArgs.slice(0, APOS_X).concat(abs2rel(AArgs.slice(APOS_X), pos)), pathResult, pos);
	                    }
	                    break;
	                // 圆弧 - 相对
	                case 'a':
	                    for (let i = 0, l = pathItem.val.length; i < l; i += APOS_LEN) {
	                        const aArgs = pathItem.val.slice(i, i + APOS_LEN);
	                        pos = computeA(aArgs.slice(0, APOS_X).concat(rel2abs(aArgs.slice(APOS_X), pos)), aArgs, pathResult, pos);
	                    }
	                    break;
	                default:
	                    pos = computeZ(pathResult, pos);
	                    break;
	            }
	        }
	        if (pathResult.length) {
	            result.push(pathResult);
	        }
	    }
	    return result;
	};

	const FLAG_POS1 = 3;
	const FLAG_POS2 = 4;
	const LOOP_LEN = 7;
	const execArc = (s) => {
	    const result = [];
	    // 重要！含有 g 修饰符的正则表达式 exec 时要先重置！
	    numberGlobal.lastIndex = 0;
	    let matches = numberGlobal.exec(s);
	    let pos = 0;
	    while (matches) {
	        if (pos % LOOP_LEN === FLAG_POS1 || pos % LOOP_LEN === FLAG_POS2) {
	            if (matches[0][0] === '0' || matches[0][0] === '1') {
	                result.push(+matches[0][0]);
	                matches[0] = matches[0].slice(1);
	                if (matches[0].length) {
	                    pos++;
	                    continue;
	                }
	            }
	        }
	        else {
	            result.push(+matches[0]);
	        }
	        pos++;
	        matches = numberGlobal.exec(s);
	    }
	    return result;
	};

	const pathReg = new RegExp(`([mzlhvcsqta])\\s*((?:${numberSequence})?)(.*?)(?=[mzlhvcsqta]|$)`, 'gim');
	const execPath = (str) => {
	    const result = [];
	    let temp = [];
	    // 重置正则匹配位置
	    pathReg.lastIndex = 0;
	    let match = pathReg.exec(str);
	    outer: while (match !== null) {
	        // 所有路径必须从 mM 开始
	        const type = match[1].toLowerCase();
	        if (!temp.length && type !== 'm') {
	            return result;
	        }
	        let val = [];
	        if (match[2]) {
	            val = type === 'a' ? execArc(match[2]) : execNumberList(match[2]);
	        }
	        switch (type) {
	            // 平移的参数必须为偶数
	            case 'm':
	                if (temp.length) {
	                    result.push(temp);
	                    temp = [];
	                }
	                if (val.length % 2 !== 0) {
	                    if (val.length > 2) {
	                        temp.push({
	                            type: match[1],
	                            val: val.slice(0, val.length - 1),
	                        });
	                    }
	                    break outer;
	                }
	                break;
	            case 'l':
	            case 't':
	                // l 和 t 的参数必须为偶数
	                if (val.length % 2 !== 0) {
	                    if (val.length > 2) {
	                        temp.push({
	                            type: match[1],
	                            val: val.slice(0, val.length - 1),
	                        });
	                    }
	                    break outer;
	                }
	                break;
	            case 'z':
	                // z 不允许有参数
	                if (val.length) {
	                    temp.push({
	                        type: match[1],
	                        val: [],
	                    });
	                    break outer;
	                }
	                break;
	            case 's':
	            case 'q':
	                // s 和 q 的参数必须是 4 的整倍数
	                if (val.length % 4 !== 0) {
	                    if (val.length > 4) {
	                        temp.push({
	                            type: match[1],
	                            val: val.slice(0, val.length - val.length % 4),
	                        });
	                    }
	                    break outer;
	                }
	                break;
	            case 'c':
	                // c 的参数必须是 6 的整倍数
	                if (val.length % 6 !== 0) {
	                    if (val.length > 6) {
	                        temp.push({
	                            type: match[1],
	                            val: val.slice(0, val.length - val.length % 6),
	                        });
	                    }
	                    break outer;
	                }
	                break;
	            case 'a':
	                // a 的参数第 3、4 位必须是 0 或 1
	                const _val = [];
	                val.every((v, i) => {
	                    if ((i % APOS_LEN === APOS_LARGE || i % APOS_LEN === APOS_SWEEP) && v !== 0 && v !== 1) {
	                        return false;
	                    }
	                    _val.push(v);
	                    return true;
	                });
	                // a 的参数必须是 7 的整倍数
	                if (_val.length % APOS_LEN !== 0) {
	                    if (_val.length > APOS_LEN) {
	                        temp.push({
	                            type: match[1],
	                            val: _val.slice(0, _val.length - _val.length % APOS_LEN),
	                        });
	                    }
	                    break outer;
	                }
	                break;
	        }
	        // 只有 z 指令不能没有参数
	        if (type !== 'z' && !val.length) {
	            break outer;
	        }
	        temp.push({
	            type: match[1],
	            val,
	        });
	        if (match[3] && !/^\s*,?\s*$/.test(match[3])) {
	            break;
	        }
	        match = pathReg.exec(str);
	    }
	    result.push(temp);
	    return result;
	};

	const shortenDigit = (pathItem, digit1, digit2) => {
	    if (pathItem.type.toLowerCase() === 'a') {
	        return pathItem.val.map((val, index) => {
	            const i = index % APOS_LEN;
	            switch (i) {
	                case APOS_RX:
	                case APOS_RY:
	                case APOS_X:
	                case APOS_Y:
	                    return toFixed(digit1, val);
	                case APOS_ROTATION:
	                    return toFixed(digit2, val);
	                default:
	                    return val;
	            }
	        });
	    }
	    else {
	        return pathItem.val.map(val => toFixed(digit1, val));
	    }
	};

	const FLAG_POS1$1 = 3;
	const FLAG_POS2$1 = 4;
	const LOOP_LEN$1 = 7;
	// 将函数类参数转为字符串，并优化（转科学计数法，移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号）
	// 特殊，针对 arc 类 path 指令，flag 位后面不需要跟逗号
	const stringifyArc = (s) => shortenNumberList(s.reduce((prev, curr, index) => {
	    if (index % LOOP_LEN$1 === FLAG_POS1$1 || index % LOOP_LEN$1 === FLAG_POS2$1 || index === s.length - 1) {
	        return `${prev}${shortenNumber(curr)}`;
	    }
	    else {
	        return `${prev}${shortenNumber(curr)},`;
	    }
	}, ''));

	// 路径字符串化
	const stringifyPath = (pathResult, digit1 = DEFAULT_SIZE_DIGIT, digit2 = DEFAULT_ACCURATE_DIGIT) => {
	    let d = '';
	    let lastType = '';
	    for (const subPath of pathResult) {
	        for (const pathItem of subPath) {
	            const stringifyFunc = pathItem.type === 'a' || pathItem.type === 'A' ? stringifyArc : stringifyFuncVal;
	            if (
	            // 注意：连续的 m 指令不能进行合并
	            (pathItem.type === lastType && lastType.toLowerCase() !== 'm')
	                ||
	                    // 字符串化的时候，紧跟 m 指令的 l 指令，且大小写一致，可以直接向前合并
	                    (pathItem.type === 'l' && lastType === 'm')
	                ||
	                    (pathItem.type === 'L' && lastType === 'M')) {
	                d = shortenNumberList(`${d},${stringifyFunc(shortenDigit(pathItem, digit1, digit2))}`);
	            }
	            else {
	                lastType = pathItem.type;
	                d += `${pathItem.type}${stringifyFunc(shortenDigit(pathItem, digit1, digit2))}`;
	            }
	        }
	    }
	    return d;
	};

	const stringifyStyle = (style) => style.map(attr => `${attr.name}:${attr.value}`).join(';');

	// 如果子对象包含动画元素，获取这些动画元素影响了哪些属性
	const getAnimateAttr = (node) => {
	    const result = [];
	    node.childNodes.forEach(childNode => {
	        if (animationAttrElements.includes(childNode.nodeName)) {
	            const attributeName = childNode.getAttribute('attributeName');
	            if (attributeName) {
	                if (childNode.nodeName !== 'animateTransform' || attributeName === 'tranform' || attributeName === 'patternTransform') {
	                    const value = [];
	                    const from = childNode.getAttribute('from');
	                    const to = childNode.getAttribute('to');
	                    const by = childNode.getAttribute('by');
	                    const values = childNode.getAttribute('values');
	                    const key = [];
	                    if (from) {
	                        value.push(from);
	                        key.push('from');
	                    }
	                    if (to) {
	                        value.push(to);
	                        key.push('to');
	                    }
	                    if (by) {
	                        value.push(by);
	                        key.push('by');
	                    }
	                    if (values) {
	                        value.push(...values.split(';').map(val => val.trim()).filter(val => !!val));
	                        key.push('values');
	                    }
	                    result.push({
	                        node: childNode,
	                        attributeName,
	                        keys: key,
	                        values: value,
	                    });
	                }
	            }
	        }
	    });
	    return result;
	};
	const checkAnimateAttr = (animateAttrs, name, condition = (v) => true) => animateAttrs.some(item => item.attributeName === name && item.values.some(condition));
	const findAnimateAttr = (animateAttrs, name) => animateAttrs.filter(item => item.attributeName === name);

	const rmAttrs = (node, attrs) => {
	    let styleVal = execStyle(node.getAttribute('style') || '');
	    for (const key of attrs) {
	        node.removeAttribute(key);
	        styleVal = styleVal.filter(attr => attr.fullname !== key);
	    }
	    if (styleVal.length) {
	        node.setAttribute('style', stringifyStyle(styleVal));
	    }
	    else {
	        node.removeAttribute('style');
	    }
	};

	// tslint:disable max-file-line-count
	const SAFE_ROTATE_CORNER = 90;
	const fixedMVal = toFixed(DEFAULT_MATRIX_DIGIT);
	const applyNumber = (fn, s, ex) => shortenNumber(fn(parseFloat(s), ex));
	const applyNumberList = (fn, numlist, ex) => {
	    numlist.forEach((val, index) => {
	        numlist[index] = fn(val, ex);
	    });
	    return shortenNumberList(numlist.map(shortenNumber).join(','));
	};
	const applyNumberPairs = (fn, numlist) => {
	    for (let i = 0; i < numlist.length; i += 2) {
	        [numlist[i], numlist[i + 1]] = fn(numlist[i], numlist[i + 1]);
	    }
	    return shortenNumberList(numlist.map(shortenNumber).join(','));
	};
	const checkAttr$1 = (node, attrname, val) => {
	    if (val === '0') {
	        rmAttrs(node, [attrname]);
	    }
	    else {
	        node.removeAttribute(attrname);
	        const attrDefine = regularAttr[attrname];
	        if (attrDefine.couldBeStyle && node.hasAttribute('style')) {
	            const styleAttr = execStyle(node.getAttribute('style'));
	            styleAttr.some(sAttr => {
	                if (sAttr.fullname === attrname) {
	                    sAttr.value = val;
	                    return true;
	                }
	                return false;
	            });
	            node.setAttribute('style', stringifyStyle(styleAttr));
	        }
	        else {
	            node.setAttribute(attrname, val);
	        }
	    }
	};
	// 应用
	const applyTextTransform = (node, matrix, animateAttrs) => {
	    // todo 暂不支持 animate
	    if (matrix.type !== 'translate' || checkAnimateAttr(animateAttrs, 'dx') || checkAnimateAttr(animateAttrs, 'dy')) {
	        return false;
	    }
	    const dx = node.getAttribute('dx') || '0';
	    const dy = node.getAttribute('dy') || '0';
	    // 必须是纯数值列表
	    if (pureNumOrWithPxList.test(dx) && pureNumOrWithPxList.test(dy)) {
	        const dxs = execNumberList(dx);
	        checkAttr$1(node, 'dx', applyNumberList(plus, dxs, matrix.val[0]));
	        if (matrix.val[1]) {
	            const dys = execNumberList(dy);
	            checkAttr$1(node, 'dy', applyNumberList(plus, dys, matrix.val[1]));
	        }
	        node.removeAttribute('transform');
	        return true;
	    }
	    return false;
	};
	const applyRectTransform = (node, matrix, animateAttrs, hasStroke, hasMarker) => {
	    const x = getAttr(node, 'x', '0');
	    const y = getAttr(node, 'y', '0');
	    const width = getAttr(node, 'width', '0');
	    const height = getAttr(node, 'height', '0');
	    let rx = getAttr(node, 'rx', 'auto');
	    let ry = getAttr(node, 'ry', 'auto');
	    if (rx === 'auto') {
	        rx = ry;
	    }
	    else if (ry === 'auto') {
	        ry = rx;
	    }
	    if (rx === 'auto') {
	        rx = '0';
	        ry = '0';
	    }
	    // todo 暂不支持 animate
	    if (!pureNumOrWithPx.test(x) || !pureNumOrWithPx.test(y) || checkAnimateAttr(animateAttrs, 'x') || checkAnimateAttr(animateAttrs, 'y')) {
	        return false;
	    }
	    if (matrix.type !== 'translate') {
	        if (hasMarker) {
	            return false;
	        }
	        if (matrix.type !== 'rotate' && hasStroke) {
	            return false;
	        }
	        if (checkAnimateAttr(animateAttrs, 'width') || checkAnimateAttr(animateAttrs, 'height') || checkAnimateAttr(animateAttrs, 'rx') || checkAnimateAttr(animateAttrs, 'ry')) {
	            return false;
	        }
	        if (!pureNumOrWithPx.test(width) || !pureNumOrWithPx.test(height) || !pureNumOrWithPx.test(rx) || !pureNumOrWithPx.test(ry)) {
	            return false;
	        }
	    }
	    switch (matrix.type) {
	        case 'translate':
	            checkAttr$1(node, 'x', applyNumber(plus, x, matrix.val[0]));
	            checkAttr$1(node, 'y', applyNumber(plus, y, matrix.val[1] || 0));
	            node.removeAttribute('transform');
	            return true;
	        case 'rotate':
	            // 1、没有 marker
	            // 2、仅限直角旋转
	            if (matrix.val[0] % SAFE_ROTATE_CORNER === 0) {
	                let mx = new Matrix();
	                if (matrix.val.length === 3) {
	                    mx = mx.translate(matrix.val[1], matrix.val[2]);
	                    mx = mx.rotate(matrix.val[0]);
	                    mx = mx.translate(-matrix.val[1], -matrix.val[2]);
	                }
	                else {
	                    mx = mx.rotate(matrix.val[0]);
	                }
	                // 获取两个对角坐标
	                let _x1 = parseFloat(x);
	                let _y1 = parseFloat(y);
	                let _x2 = plus(_x1, parseFloat(width));
	                let _y2 = plus(_y1, parseFloat(height));
	                // 运算
	                [_x1, _y1] = [mx.a * _x1 + mx.c * _y1 + mx.e, mx.b * _x1 + mx.d * _y1 + mx.f];
	                [_x2, _y2] = [mx.a * _x2 + mx.c * _y2 + mx.e, mx.b * _x2 + mx.d * _y2 + mx.f];
	                // 重新生成 x 和 y
	                checkAttr$1(node, 'x', `${fixedMVal(Math.min(_x1, _x2))}`);
	                checkAttr$1(node, 'y', `${fixedMVal(Math.min(_y1, _y2))}`);
	                if (Math.abs(matrix.val[0] % (SAFE_ROTATE_CORNER * 2)) === SAFE_ROTATE_CORNER) {
	                    checkAttr$1(node, 'width', height);
	                    checkAttr$1(node, 'height', width);
	                    checkAttr$1(node, 'rx', ry);
	                    if (rx === ry) {
	                        rmAttrs(node, ['ry']);
	                    }
	                    else {
	                        checkAttr$1(node, 'ry', rx);
	                    }
	                }
	                node.removeAttribute('transform');
	                return true;
	            }
	            return false;
	        case 'scale':
	            // 1. 没有描边
	            // 2. 属性不存在，或者没有百分比的值
	            const sx = matrix.val[0];
	            const sy = matrix.val.length === 2 ? matrix.val[1] : matrix.val[0];
	            checkAttr$1(node, 'x', applyNumber(multiply, x, sx));
	            checkAttr$1(node, 'y', applyNumber(multiply, y, sy));
	            checkAttr$1(node, 'width', applyNumber(multiply, width, sx));
	            checkAttr$1(node, 'height', applyNumber(multiply, height, sy));
	            rx = applyNumber(multiply, rx, sx);
	            ry = applyNumber(multiply, ry, sy);
	            checkAttr$1(node, 'rx', rx);
	            if (rx === ry) {
	                rmAttrs(node, ['ry']);
	            }
	            else {
	                checkAttr$1(node, 'ry', ry);
	            }
	            node.removeAttribute('transform');
	            return true;
	        case 'matrix':
	            if (matrix.val[1] === 0 && matrix.val[2] === 0) {
	                // 仅验证缩放 + 平移的情况
	                const msx = matrix.val[0];
	                const msy = matrix.val[3];
	                checkAttr$1(node, 'x', applyNumber(plus, applyNumber(multiply, x, msx), matrix.val[4]));
	                checkAttr$1(node, 'y', applyNumber(plus, applyNumber(multiply, y, msy), matrix.val[5]));
	                checkAttr$1(node, 'width', applyNumber(multiply, width, msx));
	                checkAttr$1(node, 'height', applyNumber(multiply, height, msy));
	                rx = applyNumber(multiply, rx, msx);
	                ry = applyNumber(multiply, ry, msy);
	                checkAttr$1(node, 'rx', rx);
	                if (rx === ry) {
	                    rmAttrs(node, ['ry']);
	                }
	                else {
	                    checkAttr$1(node, 'ry', ry);
	                }
	                node.removeAttribute('transform');
	                return true;
	            }
	            return false;
	        default:
	            return false;
	    }
	};
	const applyLineTransform = (node, matrix, animateAttrs, hasMarker) => {
	    if (checkAnimateAttr(animateAttrs, 'x1') || checkAnimateAttr(animateAttrs, 'y1') || checkAnimateAttr(animateAttrs, 'x2') || checkAnimateAttr(animateAttrs, 'y2')) {
	        return false;
	    }
	    const x1 = node.getAttribute('x1') || '0';
	    const y1 = node.getAttribute('y1') || '0';
	    const x2 = node.getAttribute('x2') || '0';
	    const y2 = node.getAttribute('y2') || '0';
	    if (!pureNumOrWithPx.test(x1) || !pureNumOrWithPx.test(y1) || !pureNumOrWithPx.test(x2) || !pureNumOrWithPx.test(y2)) {
	        return false;
	    }
	    switch (matrix.type) {
	        case 'translate':
	            const tx = matrix.val[0];
	            const ty = matrix.val[1] || 0;
	            checkAttr$1(node, 'x1', applyNumber(plus, x1, tx));
	            checkAttr$1(node, 'y1', applyNumber(plus, y1, ty));
	            checkAttr$1(node, 'x2', applyNumber(plus, x2, tx));
	            checkAttr$1(node, 'y2', applyNumber(plus, y2, ty));
	            node.removeAttribute('transform');
	            return true;
	        case 'rotate':
	            if (hasMarker) {
	                return false;
	            }
	            let mx = new Matrix();
	            if (matrix.val.length === 3) {
	                mx = mx.translate(matrix.val[1], matrix.val[2]);
	                mx = mx.rotate(matrix.val[0]);
	                mx = mx.translate(-matrix.val[1], -matrix.val[2]);
	            }
	            else {
	                mx = mx.rotate(matrix.val[0]);
	            }
	            const _x1 = parseFloat(x1);
	            const _y1 = parseFloat(y1);
	            const _x2 = parseFloat(x2);
	            const _y2 = parseFloat(y2);
	            checkAttr$1(node, 'x1', `${fixedMVal(mx.a * _x1 + mx.c * _y1 + mx.e)}`);
	            checkAttr$1(node, 'y1', `${fixedMVal(mx.b * _x1 + mx.d * _y1 + mx.f)}`);
	            checkAttr$1(node, 'x2', `${fixedMVal(mx.a * _x2 + mx.c * _y2 + mx.e)}`);
	            checkAttr$1(node, 'y2', `${fixedMVal(mx.b * _x2 + mx.d * _y2 + mx.f)}`);
	            node.removeAttribute('transform');
	            return true;
	        default:
	            return false;
	    }
	};
	const applyCircleTransform = (node, matrix, animateAttrs, hasStroke, hasMarker) => {
	    if (checkAnimateAttr(animateAttrs, 'cx') || checkAnimateAttr(animateAttrs, 'cy')) {
	        return false;
	    }
	    const cx = getAttr(node, 'cx', '0');
	    const cy = getAttr(node, 'cy', '0');
	    const r = getAttr(node, 'r', '0');
	    if (!pureNumOrWithPx.test(cx) || !pureNumOrWithPx.test(cy)) {
	        return false;
	    }
	    if (matrix.type !== 'translate' && hasMarker) {
	        return false;
	    }
	    switch (matrix.type) {
	        case 'translate':
	            const tx = matrix.val[0];
	            const ty = matrix.val[1] || 0;
	            checkAttr$1(node, 'cx', applyNumber(plus, cx, tx));
	            checkAttr$1(node, 'cy', applyNumber(plus, cy, ty));
	            node.removeAttribute('transform');
	            return true;
	        case 'rotate':
	            let mx = new Matrix();
	            if (matrix.val.length === 3) {
	                mx = mx.translate(matrix.val[1], matrix.val[2]);
	                mx = mx.rotate(matrix.val[0]);
	                mx = mx.translate(-matrix.val[1], -matrix.val[2]);
	            }
	            else {
	                mx = mx.rotate(matrix.val[0]);
	            }
	            const _cx = parseFloat(cx);
	            const _cy = parseFloat(cy);
	            checkAttr$1(node, 'cx', `${fixedMVal(mx.a * _cx + mx.c * _cy + mx.e)}`);
	            checkAttr$1(node, 'cy', `${fixedMVal(mx.b * _cx + mx.d * _cy + mx.f)}`);
	            node.removeAttribute('transform');
	            return true;
	        case 'scale':
	            if (hasStroke || !pureNumOrWithPx.test(r) || checkAnimateAttr(animateAttrs, 'r')) {
	                return false;
	            }
	            const sx = matrix.val[0];
	            const sy = matrix.val.length === 2 ? matrix.val[1] : matrix.val[0];
	            checkAttr$1(node, 'cx', applyNumber(multiply, cx, sx));
	            checkAttr$1(node, 'cy', applyNumber(multiply, cy, sy));
	            if (sx === sy) {
	                checkAttr$1(node, 'r', applyNumber(multiply, r, sx));
	            }
	            else {
	                // 转成椭圆
	                node.nodeName = 'ellipse';
	                checkAttr$1(node, 'rx', applyNumber(multiply, r, sx));
	                checkAttr$1(node, 'ry', applyNumber(multiply, r, sy));
	                rmAttrs(node, ['r']);
	            }
	            node.removeAttribute('transform');
	            return true;
	        case 'matrix':
	            if (matrix.val[1] === 0 && matrix.val[2] === 0) {
	                if (hasStroke || !pureNumOrWithPx.test(r) || checkAnimateAttr(animateAttrs, 'r')) {
	                    return false;
	                }
	                // 仅验证缩放 + 平移的情况
	                const msx = matrix.val[0];
	                const msy = matrix.val[3];
	                checkAttr$1(node, 'cx', applyNumber(plus, applyNumber(multiply, cx, msx), matrix.val[4]));
	                checkAttr$1(node, 'cy', applyNumber(plus, applyNumber(multiply, cy, msy), matrix.val[5]));
	                if (msx === msy) {
	                    checkAttr$1(node, 'r', applyNumber(multiply, r, msx));
	                }
	                else {
	                    // 转成椭圆
	                    node.nodeName = 'ellipse';
	                    checkAttr$1(node, 'rx', applyNumber(multiply, r, msx));
	                    checkAttr$1(node, 'ry', applyNumber(multiply, r, msy));
	                    rmAttrs(node, ['r']);
	                }
	                node.removeAttribute('transform');
	                return true;
	            }
	            return false;
	        default:
	            return false;
	    }
	};
	const applyEllipseTransform = (node, matrix, animateAttrs, hasStroke, hasMarker) => {
	    const cx = getAttr(node, 'cx', '0');
	    const cy = getAttr(node, 'cy', '0');
	    let rx = getAttr(node, 'rx', 'auto');
	    let ry = getAttr(node, 'ry', 'auto');
	    if (rx === 'auto') {
	        rx = ry;
	    }
	    else if (ry === 'auto') {
	        ry = rx;
	    }
	    if (rx === 'auto') {
	        rx = '0';
	        ry = '0';
	    }
	    if (!pureNumOrWithPx.test(cx) || !pureNumOrWithPx.test(cy) || checkAnimateAttr(animateAttrs, 'cx') || checkAnimateAttr(animateAttrs, 'cy')) {
	        return false;
	    }
	    if (matrix.type !== 'translate' && hasMarker) {
	        return false;
	    }
	    if (rx === ry && !checkAnimateAttr(animateAttrs, 'rx') && !checkAnimateAttr(animateAttrs, 'ry')) {
	        node.nodeName = 'circle';
	        rmAttrs(node, ['rx', 'ry']);
	        checkAttr$1(node, 'r', rx);
	        return applyCircleTransform(node, matrix, animateAttrs, hasStroke, hasMarker);
	    }
	    switch (matrix.type) {
	        case 'translate':
	            const tx = matrix.val[0];
	            const ty = matrix.val[1] || 0;
	            checkAttr$1(node, 'cx', applyNumber(plus, cx, tx));
	            checkAttr$1(node, 'cy', applyNumber(plus, cy, ty));
	            node.removeAttribute('transform');
	            return true;
	        case 'rotate':
	            // 仅限直角旋转
	            if (matrix.val[0] % SAFE_ROTATE_CORNER !== 0) {
	                return false;
	            }
	            let mx = new Matrix();
	            if (matrix.val.length === 3) {
	                mx = mx.translate(matrix.val[1], matrix.val[2]);
	                mx = mx.rotate(matrix.val[0]);
	                mx = mx.translate(-matrix.val[1], -matrix.val[2]);
	            }
	            else {
	                mx = mx.rotate(matrix.val[0]);
	            }
	            const _cx = parseFloat(cx);
	            const _cy = parseFloat(cy);
	            // 垂直的情况要交换 rx 和 ry
	            if (Math.abs(matrix.val[0] % (SAFE_ROTATE_CORNER * 2)) === SAFE_ROTATE_CORNER) {
	                // 如果存在百分比的尺寸，不能交换 rx 和 ry
	                // TODO：如果存在动画，暂时不做处理
	                if (rx.includes('%') || ry.includes('%') || checkAnimateAttr(animateAttrs, 'rx') || checkAnimateAttr(animateAttrs, 'ry')) {
	                    return false;
	                }
	                checkAttr$1(node, 'rx', ry);
	                checkAttr$1(node, 'ry', rx);
	            }
	            checkAttr$1(node, 'cx', `${fixedMVal(mx.a * _cx + mx.c * _cy + mx.e)}`);
	            checkAttr$1(node, 'cy', `${fixedMVal(mx.b * _cx + mx.d * _cy + mx.f)}`);
	            node.removeAttribute('transform');
	            return true;
	        case 'scale':
	            if (hasStroke || !pureNumOrWithPx.test(rx) || !pureNumOrWithPx.test(ry) || checkAnimateAttr(animateAttrs, 'rx') || checkAnimateAttr(animateAttrs, 'ry')) {
	                return false;
	            }
	            const sx = matrix.val[0];
	            const sy = matrix.val.length === 2 ? matrix.val[1] : matrix.val[0];
	            checkAttr$1(node, 'cx', applyNumber(multiply, cx, sx));
	            checkAttr$1(node, 'cy', applyNumber(multiply, cy, sy));
	            rx = applyNumber(multiply, rx, sx);
	            ry = applyNumber(multiply, ry, sy);
	            if (rx === ry) {
	                // 转成正圆
	                node.nodeName = 'circle';
	                rmAttrs(node, ['rx', 'ry']);
	                checkAttr$1(node, 'r', rx);
	            }
	            else {
	                checkAttr$1(node, 'rx', rx);
	                checkAttr$1(node, 'ry', ry);
	            }
	            node.removeAttribute('transform');
	            return true;
	        case 'matrix':
	            if (matrix.val[1] === 0 && matrix.val[2] === 0) {
	                if (hasStroke || !pureNumOrWithPx.test(rx) || !pureNumOrWithPx.test(ry) || checkAnimateAttr(animateAttrs, 'rx') || checkAnimateAttr(animateAttrs, 'ry')) {
	                    return false;
	                }
	                // 仅验证缩放 + 平移的情况
	                const msx = matrix.val[0];
	                const msy = matrix.val[3];
	                checkAttr$1(node, 'cx', applyNumber(plus, applyNumber(multiply, cx, msx), matrix.val[4]));
	                checkAttr$1(node, 'cy', applyNumber(plus, applyNumber(multiply, cy, msy), matrix.val[5]));
	                rx = applyNumber(multiply, rx, msx);
	                ry = applyNumber(multiply, ry, msy);
	                if (rx === ry) {
	                    // 转成正圆
	                    node.nodeName = 'circle';
	                    rmAttrs(node, ['rx', 'ry']);
	                    checkAttr$1(node, 'r', rx);
	                }
	                else {
	                    checkAttr$1(node, 'rx', rx);
	                    checkAttr$1(node, 'ry', ry);
	                }
	                node.removeAttribute('transform');
	                return true;
	            }
	            return false;
	        default:
	            return false;
	    }
	};
	const applyPolyTransform = (node, matrix, animateAttrs, hasStroke, hasMarker, minStr) => {
	    if (checkAnimateAttr(animateAttrs, 'points')) {
	        return false;
	    }
	    let pointVal = node.getAttribute('points') || '';
	    const points = execNumberList(pointVal);
	    // points 数量必须是偶数
	    if (points.length % 2 === 1) {
	        points.pop();
	        pointVal = shortenNumberList(points.map(shortenNumber).join(','));
	        node.setAttribute('points', pointVal);
	    }
	    if (matrix.type === 'translate') {
	        const tx = matrix.val[0];
	        const ty = matrix.val[1] || 0;
	        const _points = applyNumberPairs((x, y) => [plus(x, tx), plus(y, ty)], points);
	        if (_points.length < pointVal.length + minStr.length) {
	            node.setAttribute('points', _points);
	            node.removeAttribute('transform');
	            return true;
	        }
	        else {
	            return false;
	        }
	    }
	    if (hasMarker || (matrix.type !== 'rotate' && hasStroke)) {
	        return false;
	    }
	    let mx = new Matrix();
	    switch (matrix.type) {
	        case 'rotate':
	            if (matrix.val.length === 3) {
	                mx = mx.translate(matrix.val[1], matrix.val[2]);
	                mx = mx.rotate(matrix.val[0]);
	                mx = mx.translate(-matrix.val[1], -matrix.val[2]);
	            }
	            else {
	                mx = mx.rotate(matrix.val[0]);
	            }
	            break;
	        case 'scale':
	        case 'skewX':
	        case 'skewY':
	            mx = mx[matrix.type](...matrix.val);
	            break;
	        default:
	            mx = new Matrix(...matrix.val);
	            break;
	    }
	    const newPoints = applyNumberPairs((n1, n2) => [
	        fixedMVal(mx.a * n1 + mx.c * n2 + mx.e),
	        fixedMVal(mx.b * n1 + mx.d * n2 + mx.f),
	    ], points);
	    if (newPoints.length < pointVal.length + minStr.length) {
	        node.setAttribute('points', newPoints);
	        node.removeAttribute('transform');
	        return true;
	    }
	    else {
	        return false;
	    }
	};
	const applyPathTransform = (node, matrix, animateAttrs, hasStroke, hasMarker, minStr) => {
	    if (checkAnimateAttr(animateAttrs, 'd')) {
	        return false;
	    }
	    const d = node.getAttribute('d') || '';
	    const pathResult = doCompute(execPath(d));
	    if (matrix.type === 'translate') {
	        const tx = matrix.val[0];
	        const ty = matrix.val[1] || 0;
	        pathResult.forEach((subPath, index) => {
	            subPath.forEach(pathItem => {
	                switch (pathItem.type) {
	                    case 'm':
	                        // 第一个移动指令也要执行平移变换
	                        if (index === 0) {
	                            pathItem.val[0] = plus(pathItem.val[0], tx);
	                            pathItem.val[1] = plus(pathItem.val[1], ty);
	                        }
	                        break;
	                    case 'M':
	                    case 'L':
	                    case 'C':
	                    case 'S':
	                    case 'Q':
	                    case 'T':
	                        for (let i = 0; i < pathItem.val.length; i += 2) {
	                            pathItem.val[i] = plus(pathItem.val[i], tx);
	                            pathItem.val[i + 1] = plus(pathItem.val[i + 1], ty);
	                        }
	                        break;
	                    case 'H':
	                        for (let i = 0; i < pathItem.val.length; i++) {
	                            pathItem.val[i] = plus(pathItem.val[i], tx);
	                        }
	                        break;
	                    case 'V':
	                        for (let i = 0; i < pathItem.val.length; i++) {
	                            pathItem.val[i] = plus(pathItem.val[i], ty);
	                        }
	                        break;
	                    case 'A':
	                        for (let i = 0; i < pathItem.val.length; i += APOS_LEN) {
	                            pathItem.val[i + APOS_X] = plus(pathItem.val[i + APOS_X], tx);
	                            pathItem.val[i + APOS_Y] = plus(pathItem.val[i + APOS_Y], ty);
	                        }
	                        break;
	                }
	            });
	        });
	        const _d = stringifyPath(doCompute(pathResult));
	        if (_d.length < d.length + minStr.length) {
	            node.setAttribute('d', _d);
	            node.removeAttribute('transform');
	            return true;
	        }
	        else {
	            return false;
	        }
	    }
	    // 不能有 marker
	    if (hasMarker) {
	        return false;
	    }
	    else if (matrix.type !== 'rotate') {
	        // rotate 之外不能有 stroke
	        // rotate 和 scale 之外遇到 a 指令会有问题
	        if (hasStroke || (matrix.type !== 'scale' && d.toLowerCase().includes('a'))) {
	            return false;
	        }
	    }
	    if (matrix.type === 'scale') {
	        const sx = matrix.val[0];
	        const sy = matrix.val.length === 2 ? matrix.val[1] : matrix.val[0];
	        pathResult.forEach(subPath => {
	            subPath.forEach(pathItem => {
	                switch (pathItem.type.toLowerCase()) {
	                    case 'm':
	                    case 'l':
	                    case 'c':
	                    case 's':
	                    case 'q':
	                    case 't':
	                        for (let i = 0; i < pathItem.val.length; i += 2) {
	                            pathItem.val[i] = multiply(pathItem.val[i], sx);
	                            pathItem.val[i + 1] = multiply(pathItem.val[i + 1], sy);
	                        }
	                        break;
	                    case 'h':
	                        for (let i = 0; i < pathItem.val.length; i++) {
	                            pathItem.val[i] = multiply(pathItem.val[i], sx);
	                        }
	                        break;
	                    case 'v':
	                        for (let i = 0; i < pathItem.val.length; i++) {
	                            pathItem.val[i] = multiply(pathItem.val[i], sy);
	                        }
	                        break;
	                    case 'a':
	                        for (let i = 0; i < pathItem.val.length; i += APOS_LEN) {
	                            pathItem.val[i + APOS_RX] = multiply(pathItem.val[i + APOS_RX], sx);
	                            pathItem.val[i + APOS_RY] = multiply(pathItem.val[i + APOS_RY], sy);
	                            pathItem.val[i + APOS_X] = multiply(pathItem.val[i + APOS_X], sx);
	                            pathItem.val[i + APOS_Y] = multiply(pathItem.val[i + APOS_Y], sy);
	                        }
	                        break;
	                }
	            });
	        });
	        const _d = stringifyPath(doCompute(pathResult));
	        if (_d.length < d.length + minStr.length) {
	            node.setAttribute('d', _d);
	            node.removeAttribute('transform');
	            return true;
	        }
	        else {
	            return false;
	        }
	    }
	    let mx = new Matrix();
	    switch (matrix.type) {
	        case 'rotate':
	            if (matrix.val.length === 3) {
	                mx = mx.translate(matrix.val[1], matrix.val[2]);
	                mx = mx.rotate(matrix.val[0]);
	                mx = mx.translate(-matrix.val[1], -matrix.val[2]);
	            }
	            else {
	                mx = mx.rotate(matrix.val[0]);
	            }
	            break;
	        case 'skewX':
	        case 'skewY':
	            mx = mx[matrix.type](matrix.val[0]);
	            break;
	        default:
	            mx = new Matrix(...matrix.val);
	            break;
	    }
	    pathResult.forEach((subPath, index) => {
	        subPath.forEach(pathItem => {
	            switch (pathItem.type) {
	                case 'M':
	                case 'L':
	                case 'C':
	                case 'S':
	                case 'Q':
	                case 'T':
	                    for (let i = 0; i < pathItem.val.length; i += 2) {
	                        [pathItem.val[i], pathItem.val[i + 1]] = [
	                            fixedMVal(mx.a * pathItem.val[i] + mx.c * pathItem.val[i + 1] + mx.e),
	                            fixedMVal(mx.b * pathItem.val[i] + mx.d * pathItem.val[i + 1] + mx.f),
	                        ];
	                    }
	                    break;
	                case 'm':
	                case 'l':
	                case 'c':
	                case 's':
	                case 'q':
	                case 't':
	                    for (let i = 0; i < pathItem.val.length; i += 2) {
	                        [pathItem.val[i], pathItem.val[i + 1]] = [
	                            fixedMVal(mx.a * pathItem.val[i] + mx.c * pathItem.val[i + 1]),
	                            fixedMVal(mx.b * pathItem.val[i] + mx.d * pathItem.val[i + 1]),
	                        ];
	                    }
	                    // 第一个移动指令也要执行平移变换
	                    if (pathItem.type === 'm' && index === 0) {
	                        pathItem.val[0] = fixedMVal(pathItem.val[0] + mx.e);
	                        pathItem.val[1] = fixedMVal(pathItem.val[1] + mx.f);
	                    }
	                    break;
	                case 'H':
	                    pathItem.type = 'L';
	                    const HVal = pathItem.val.slice();
	                    const Hy = pathItem.from[1];
	                    for (let i = 0; i < HVal.length; i++) {
	                        pathItem.val[i * 2] = fixedMVal(mx.a * HVal[i] + mx.c * Hy + mx.e);
	                        pathItem.val[i * 2 + 1] = fixedMVal(mx.b * HVal[i] + mx.d * Hy + mx.f);
	                    }
	                    break;
	                case 'h':
	                    pathItem.type = 'l';
	                    const hVal = pathItem.val.slice();
	                    const hy = 0;
	                    for (let i = 0; i < hVal.length; i++) {
	                        pathItem.val[i * 2] = fixedMVal(mx.a * hVal[i] + mx.c * hy);
	                        pathItem.val[i * 2 + 1] = fixedMVal(mx.b * hVal[i] + mx.d * hy);
	                    }
	                    break;
	                case 'V':
	                    pathItem.type = 'L';
	                    const VVal = pathItem.val.slice();
	                    const Vx = pathItem.from[0];
	                    for (let i = 0; i < VVal.length; i++) {
	                        pathItem.val[i * 2] = fixedMVal(mx.a * Vx + mx.c * VVal[i] + mx.e);
	                        pathItem.val[i * 2 + 1] = fixedMVal(mx.b * Vx + mx.d * VVal[i] + mx.f);
	                    }
	                    break;
	                case 'v':
	                    pathItem.type = 'l';
	                    const vVal = pathItem.val.slice();
	                    const vx = 0;
	                    for (let i = 0; i < vVal.length; i++) {
	                        pathItem.val[i * 2] = fixedMVal(mx.a * vx + mx.c * vVal[i]);
	                        pathItem.val[i * 2 + 1] = fixedMVal(mx.b * vx + mx.d * vVal[i]);
	                    }
	                    break;
	            }
	        });
	    });
	    const newD = stringifyPath(doCompute(pathResult));
	    if (newD.length < d.length + minStr.length) {
	        node.setAttribute('d', newD);
	        node.removeAttribute('transform');
	        return true;
	    }
	    else {
	        return false;
	    }
	};
	const applyTransform = (node, matrix, minStr) => {
	    const animateAttrs = getAnimateAttr(node);
	    // 平移可以直接应用，旋转要判断节点类型，其它变形函数只能在没有描边的时候应用
	    const hasStroke = (getAttr(node, 'stroke', 'none') !== 'none' || checkAnimateAttr(animateAttrs, 'stroke', val => val !== 'none')) && (getAttr(node, 'stroke-width', '1') !== '0' || checkAnimateAttr(animateAttrs, 'stroke-width', val => val !== '0'));
	    // 存在 marker 引用的对象只能进行平移变换
	    const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none'
	        || getAttr(node, 'marker-mid', 'none') !== 'none'
	        || getAttr(node, 'marker-end', 'none') !== 'none'
	        || checkAnimateAttr(animateAttrs, 'marker-start', val => val !== 'none')
	        || checkAnimateAttr(animateAttrs, 'marker-mid', val => val !== 'none')
	        || checkAnimateAttr(animateAttrs, 'marker-end', val => val !== 'none');
	    switch (node.nodeName) {
	        case 'text':
	        case 'tspan':
	            return applyTextTransform(node, matrix, animateAttrs);
	        case 'rect':
	            return applyRectTransform(node, matrix, animateAttrs, hasStroke, hasMarker);
	        case 'line':
	            return applyLineTransform(node, matrix, animateAttrs, hasMarker);
	        case 'circle':
	            return applyCircleTransform(node, matrix, animateAttrs, hasStroke, hasMarker);
	        case 'ellipse':
	            return applyEllipseTransform(node, matrix, animateAttrs, hasStroke, hasMarker);
	        case 'polyline':
	        case 'polygon':
	            return applyPolyTransform(node, matrix, animateAttrs, hasStroke, hasMarker, minStr);
	        case 'path':
	            return applyPathTransform(node, matrix, animateAttrs, hasStroke, hasMarker, minStr);
	        default:
	            return false;
	    }
	};
	const combineTransform = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        execStyleTree(dom);
	        // digit1 = 矩阵前 4 位的精度，digit2 = 矩阵后 2 位的精度
	        const { trigDigit, sizeDigit, angelDigit, } = rule[1];
	        traversalNode(isTag, node => {
	            for (let i = node.attributes.length; i--;) {
	                const attr = node.attributes[i];
	                if (transformAttributes.includes(attr.name)) {
	                    const transform = [];
	                    execMatrix(attr.value.trim()).forEach(mFunc => {
	                        const lastFunc = transform[transform.length - 1];
	                        if (transform.length && lastFunc.type === mFunc.type) {
	                            const mergeFunc = merge(lastFunc, mFunc, trigDigit, sizeDigit, angelDigit);
	                            // 如果合并后为无效变化，则出栈，否则更新合并后的函数
	                            if (mergeFunc.noEffect) {
	                                transform.pop();
	                            }
	                            else {
	                                transform[transform.length - 1] = mergeFunc;
	                            }
	                        }
	                        else {
	                            transform.push(mFunc);
	                        }
	                    });
	                    if (transform.length) {
	                        const matrix = combineMatrix(transform, trigDigit, sizeDigit, angelDigit);
	                        const transformStr = stringify(transform, trigDigit, sizeDigit, angelDigit);
	                        const matrixStr = stringify([matrix], trigDigit, sizeDigit, angelDigit);
	                        const minStr = (matrixStr.length < transformStr.length) ? matrixStr : transformStr;
	                        if (matrix.noEffect) {
	                            node.removeAttribute(attr.fullname);
	                            return;
	                        }
	                        if (attr.fullname === 'transform') {
	                            // TODO：进一步分析子元素
	                            // TODO：暂时只应用 transform 属性
	                            if (applyTransform(node, matrix, ` ${attr.fullname}="${minStr}"`)) {
	                                return;
	                            }
	                        }
	                        attr.value = minStr;
	                    }
	                    else {
	                        node.removeAttribute(attr.fullname);
	                    }
	                }
	            }
	        }, dom);
	    }
	    resolve();
	});

	// 2d 向量
	const HALF_CIRC$2 = 180;
	const ACCURACY = 1e6;
	class Vector {
	    constructor(x = 0, y = 0) {
	        this.x = x;
	        this.y = y;
	    }
	    // 获取未修正的向量长度
	    get _modulo() {
	        return Math.sqrt(this.x * this.x + this.y * this.y);
	    }
	    // 获取向量长度
	    get modulo() {
	        return Vector.Rounding(Math.sqrt(this.x * this.x + this.y * this.y));
	    }
	    set modulo(m) {
	        this.normalize();
	        this.x *= m;
	        this.y *= m;
	    }
	    rotate(arc) {
	        const _x = this.x;
	        const _y = this.y;
	        this.x = _x * Math.cos(arc) - _y * Math.sin(arc);
	        this.y = _x * Math.sin(arc) + _y * Math.cos(arc);
	        return this;
	    }
	    // value 直接返回长度
	    valueOf() {
	        return this.modulo;
	    }
	    // 返回字符串形式
	    toString() {
	        return `[${this.x},${this.y}]`;
	    }
	    // 转为单位向量
	    normalize() {
	        const modulo = this._modulo;
	        if (modulo !== 0) {
	            this.x /= modulo;
	            this.y /= modulo;
	        }
	        else {
	            throw new Error('零向量无法标准化！');
	        }
	        return this;
	    }
	    // 转为零向量
	    zero() {
	        this.x = 0;
	        this.y = 0;
	        return this;
	    }
	    // 与另一个向量相加
	    add(v) {
	        this.x += v.x;
	        this.y += v.y;
	        return this;
	    }
	    // 与另一个向量相减
	    substract(v) {
	        this.x -= v.x;
	        this.y -= v.y;
	        return this;
	    }
	    multiplied(n) {
	        if (typeof n === 'number') {
	            this.x *= n;
	            this.y *= n;
	            return this;
	        }
	        else {
	            return this.x * n.x + this.y * n.y;
	        }
	    }
	    // 计算两个向量的夹角 - 弧度
	    radian(v) {
	        return Vector.radian(this, v);
	    }
	    // 计算两个向量的夹角 - 角度
	    angel(v) {
	        return Vector.angel(this, v);
	    }
	    // 自己是不是零向量
	    get isZero() {
	        return this.x === 0 && this.y === 0;
	    }
	    // 自己是不是单位向量
	    get isNormalize() {
	        return this.modulo === 1;
	    }
	    // 两个向量相加
	    static add(v1, v2) {
	        return new Vector(v1.x + v2.x, v1.y + v2.y);
	    }
	    // 两个向量相减
	    static substract(v1, v2) {
	        return new Vector(v1.x - v2.x, v1.y - v2.y);
	    }
	    // 两个向量相乘
	    static multiplied(v1, n) {
	        if (typeof n === 'number') {
	            return new Vector(v1.x * n, v1.y * n);
	        }
	        else {
	            return v1.x * n.x + v1.y * n.y;
	        }
	    }
	    // 两个向量的夹角 - 弧度
	    static radian(v1, v2) {
	        if (v1.isZero || v2.isZero) {
	            return NaN;
	        }
	        return Math.acos(Vector.multiplied(v1, v2) / v1._modulo / v2._modulo);
	    }
	    // 两个向量的夹角 - 角度
	    static angel(v1, v2) {
	        if (v1.isZero || v2.isZero) {
	            return NaN;
	        }
	        return Vector.Rounding(HALF_CIRC$2 * Vector.radian(v1, v2) / Math.PI);
	    }
	    // v1 到 v2 的投影分量
	    static projected(v1, v2) {
	        if (v1.isZero || v2.isZero) {
	            return new Vector(0, 0);
	        }
	        return Vector.multiplied(v2, Vector.multiplied(v1, v2) / Math.pow(v2._modulo, 2));
	    }
	    // v1 到 v2 的垂直分量
	    static plumb(v1, v2) {
	        if (v1.isZero) {
	            return new Vector(0, 0);
	        }
	        if (v2.isZero) {
	            return new Vector(v1.x, v1.y);
	        }
	        return Vector.substract(v1, Vector.projected(v1, v2));
	    }
	    // 取模，对小数点后6位进行取整，修正双精度浮点数导致无法正常标准化的
	    static Rounding(n) {
	        return Math.round(n * ACCURACY) / ACCURACY;
	    }
	    // 求距离
	    static distance(v1, v2) {
	        return Vector.substract(v1, v2).modulo;
	    }
	}

	const check$1 = (threshold, startI, endI, paths) => {
	    let max = 0;
	    let maxI = 0;
	    // 拿到基础向量
	    const baseVector = new Vector(minus(paths[endI], paths[startI]), minus(paths[endI + 1], paths[startI + 1]));
	    for (let i = startI + 2; i < endI; i += 2) {
	        // 获取每个点基于起始和结束位置的向量
	        const vectorToStart = new Vector(minus(paths[i], paths[startI]), minus(paths[i + 1], paths[startI + 1]));
	        const vectorToEnd = new Vector(minus(paths[i], paths[endI]), minus(paths[i + 1], paths[endI + 1]));
	        let distance = 0;
	        // 与起始或结束点重合的点直接跳过
	        if (!vectorToStart.isZero && !vectorToEnd.isZero) {
	            // 边界情况：投影分量的模大于基础向量，说明途径点在起始点或结束点之外，不能单纯靠垂直分量来抽稀
	            const prjToStart = Vector.projected(vectorToStart, baseVector);
	            const prjToEnd = Vector.projected(vectorToEnd, baseVector);
	            if (prjToStart.modulo > baseVector.modulo) {
	                distance = prjToStart.modulo;
	            }
	            else if (prjToEnd.modulo > baseVector.modulo) {
	                distance = prjToEnd.modulo;
	            }
	            else {
	                distance = Vector.plumb(vectorToStart, baseVector).modulo;
	            }
	            if (distance > max) {
	                max = distance;
	                maxI = i;
	            }
	        }
	    }
	    if (max <= threshold) {
	        paths.splice(startI + 2, endI - startI - 2);
	    }
	    else {
	        if (maxI < endI - 2) {
	            check$1(threshold, maxI, endI, paths);
	        }
	        if (maxI > startI + 2) {
	            check$1(threshold, startI, maxI, paths);
	        }
	    }
	};
	const douglasPeucker = (threshold, pathArr) => {
	    const pathCopy = pathArr.slice();
	    check$1(threshold, 0, pathCopy.length - 2, pathCopy);
	    return pathCopy;
	};

	const combineHV = (subPath, pathItem, index) => {
	    const relVal = getRelHV(pathItem);
	    // 如果前一个函数也是水平/垂直移动，判断是否可以合并
	    // 判断的依据是：相对值的积为正数（即同向移动）
	    if (subPath[index - 1].type.toLowerCase() === pathItem.type.toLowerCase()) {
	        const lastItem = subPath[index - 1];
	        if (getRelHV(lastItem) * relVal >= 0) {
	            // 合并时直接转绝对坐标
	            lastItem.val[0] = getAbsHV(pathItem);
	            lastItem.type = lastItem.type.toUpperCase();
	            subPath.splice(index, 1);
	        }
	    }
	};
	// 同方向的直线直接合并
	const combineL = (subPath, pathItem, index, digit) => {
	    const fixed = toFixed(digit);
	    if (subPath[index - 1].type.toLowerCase() === 'l') {
	        const lastItem = subPath[index - 1];
	        const relVal = getRel(pathItem);
	        const lastRelVal = getRel(lastItem);
	        if (fixed(Math.atan2(lastRelVal[0], lastRelVal[1])) === fixed(Math.atan2(relVal[0], relVal[1]))) {
	            lastItem.val = [plus(lastItem.val[0], relVal[0]), plus(lastItem.val[1], relVal[1])];
	            lastItem.type = 'l';
	            subPath.splice(index, 1);
	        }
	    }
	};
	const getCenter = (pathItem, digit) => {
	    const rotation = pathItem.val[APOS_ROTATION];
	    const rx = pathItem.val[APOS_RX];
	    const ry = pathItem.val[APOS_RY];
	    const ccw = pathItem.val[APOS_LARGE] === pathItem.val[APOS_SWEEP];
	    const abs = getAbs({
	        type: pathItem.type,
	        val: pathItem.val.slice(APOS_X),
	        from: pathItem.from,
	    });
	    const v1 = new Vector(pathItem.from[0], pathItem.from[1]);
	    const v2 = new Vector(abs[0], abs[1]);
	    // 先旋转一下
	    if (rotation) {
	        v1.rotate(-rotation * Math.PI * 2 / CIRC);
	        v2.rotate(-rotation * Math.PI * 2 / CIRC);
	    }
	    // 从椭圆变成正圆
	    if (rx !== ry) {
	        v1.y *= rx / ry;
	        v2.y *= rx / ry;
	    }
	    // 获取起点到终点的向量
	    const v = new Vector(v2.x - v1.x, v2.y - v1.y);
	    // r 不一定是够长，需要扩大到指定的大小 https://www.w3.org/TR/SVG/paths.html#ArcOutOfRangeParameters
	    let r = rx;
	    if (r < v.modulo / 2) {
	        r = v.modulo / 2;
	    }
	    // 向量长度为另一条直角边
	    v.modulo = Math.sqrt(r * r - Math.pow(v.modulo / 2, 2));
	    // 根据方向选择 90 度
	    const arc = ccw ? -Math.PI / 2 : Math.PI / 2;
	    v.rotate(arc);
	    // 把起始点挪到线段中心
	    v.x += (v1.x + v2.x) / 2;
	    v.y += (v1.y + v2.y) / 2;
	    if (rx !== ry) {
	        v.y *= ry / rx;
	    }
	    if (rotation) {
	        v.rotate(rotation * Math.PI * 2 / CIRC);
	    }
	    return [toFixed(digit, v.x), toFixed(digit, v.y)];
	};
	const combineA = (subPath, pathItem, index, digit) => {
	    const lastItem = subPath[index - 1];
	    if (lastItem.type.toLowerCase() === 'a') {
	        // rx ry 转角 旋转方向相等，并且圆心重合，才能进行合并
	        const _eqProps = (prop) => ramda.eqProps(`${prop}`, lastItem.val, pathItem.val);
	        if (ramda.all(_eqProps, [APOS_RX, APOS_RY, APOS_ROTATION, APOS_SWEEP])) {
	            const center = getCenter(pathItem, digit);
	            const lastCenter = getCenter(lastItem, digit);
	            // equals 存在 0 !== -0 的问题
	            if (center[0] === lastCenter[0] && center[1] === lastCenter[1]) {
	                // 前一个指令的起始弧线
	                const vbase = new Vector(lastItem.from[0] - center[0], lastItem.from[1] - center[1]);
	                const lastAbs = getAbs({
	                    type: lastItem.type,
	                    val: lastItem.val.slice(APOS_X),
	                    from: lastItem.from,
	                });
	                const v1 = new Vector(lastAbs[0] - center[0], lastAbs[1] - center[1]);
	                const abs = getAbs({
	                    type: pathItem.type,
	                    val: pathItem.val.slice(APOS_X),
	                    from: pathItem.from,
	                });
	                const v2 = new Vector(abs[0] - center[0], abs[1] - center[1]);
	                let radian1 = Vector.radian(vbase, v1);
	                if (lastItem.val[APOS_LARGE] === 1) {
	                    radian1 = Math.PI * 2 - radian1;
	                }
	                let radian2 = Vector.radian(v1, v2);
	                if (pathItem.val[APOS_LARGE] === 1) {
	                    radian2 = Math.PI * 2 - radian2;
	                }
	                // 大于等于 360 度不能合并，等于 360 度会造成 a 指令被忽略
	                if (radian1 + radian2 >= Math.PI * 2) {
	                    return;
	                }
	                // 下面是进行合并的算法
	                // 首先判断是否要改为大转角
	                if (radian1 + radian2 > Math.PI && lastItem.val[APOS_LARGE] === 0) {
	                    lastItem.val[APOS_LARGE] = 1;
	                }
	                // 直接强制改为绝对坐标
	                lastItem.type = 'A';
	                lastItem.val[APOS_X] = abs[0];
	                lastItem.val[APOS_Y] = abs[1];
	                // 移除当前节点
	                subPath.splice(index, 1);
	            }
	        }
	    }
	    return;
	};

	// 把简单路径指令转回复杂指令
	const complex = (item, lastItem) => {
	    const complexItem = {
	        type: item.type,
	        from: item.from.slice(),
	        val: item.val.slice(),
	    };
	    if (item.type.toLowerCase() === 's') {
	        let [x, y] = item.from;
	        if (lastItem.type === 'C') {
	            x = symmetry(lastItem.val[2], item.from[0]);
	            y = symmetry(lastItem.val[3], item.from[1]);
	        }
	        else if (lastItem.type === 'c') {
	            x = symmetry(plus(lastItem.val[2], lastItem.from[0]), item.from[0]);
	            y = symmetry(plus(lastItem.val[3], lastItem.from[1]), item.from[1]);
	        }
	        if (item.type === 'S') {
	            complexItem.type = 'C';
	            complexItem.val.unshift(x, y);
	        }
	        else {
	            complexItem.type = 'c';
	            complexItem.val.unshift(minus(x, item.from[0]), minus(y, item.from[1]));
	        }
	    }
	    else if (item.type.toLowerCase() === 't') {
	        let [x, y] = item.from;
	        if (lastItem.type === 'Q') {
	            x = symmetry(lastItem.val[0], item.from[0]);
	            y = symmetry(lastItem.val[1], item.from[1]);
	        }
	        else if (lastItem.type === 'q') {
	            x = symmetry(plus(lastItem.val[0], lastItem.from[0]), item.from[0]);
	            y = symmetry(plus(lastItem.val[1], lastItem.from[1]), item.from[1]);
	        }
	        if (item.type === 'T') {
	            complexItem.type = 'Q';
	            complexItem.val.unshift(x, y);
	        }
	        else {
	            complexItem.type = 'q';
	            complexItem.val.unshift(minus(x, item.from[0]), minus(y, item.from[1]));
	        }
	    }
	    return complexItem;
	};

	const contours = require('svg-path-contours');
	const triangle = require('triangulate-contours');
	// 当前子路径中除了起始点和自己之外，还有其它任意指令
	const hasBrother = (subPath, index) => {
	    return index > 1 || index < subPath.length - 1;
	};
	// 移除 0 长度的平移指令，规则是没有 stroke-cap 或具有兄弟，反之可以转为 z 指令
	const checkHV = (subPath, index, hasStrokeCap) => {
	    if (!hasStrokeCap || hasBrother(subPath, index)) {
	        subPath.splice(index, 1);
	    }
	    else {
	        subPath[index].type = 'z';
	    }
	};
	// 如果控制点位于起始点和终点的连线中间位置，则 q 指令可以转 l 指令
	const checkQ = (pathItem, subPath, index, hasStrokeCap) => {
	    // 简单指令转复杂指令
	    const complexItem = complex(pathItem, subPath[index - 1]);
	    const relVal = getRel(complexItem);
	    const sameLine = (relVal[0] * relVal[3] === relVal[1] * relVal[2]) && (relVal[0] * (relVal[2] - relVal[0]) >= 0);
	    if (sameLine) {
	        if (relVal.every(s => s === 0)) {
	            // 控制点及指令的相对值全部为 0 ，可以视情况移除或转 z 指令
	            if (!hasStrokeCap || hasBrother(subPath, index)) {
	                subPath.splice(index, 1);
	            }
	            else {
	                pathItem.type = 'z';
	            }
	            return;
	        }
	        // 如果前后都不是 q/t 节点，则可以转直线指令
	        if (subPath[index - 1].type.toLowerCase() !== 'q' && subPath[index - 1].type.toLowerCase() !== 't' && (index === subPath.length - 1 || subPath[index + 1].type.toLowerCase() !== 't')) {
	            pathItem.type = complexItem.type === 'q' ? 'l' : 'L';
	            pathItem.val = complexItem.val.slice(2);
	        }
	    }
	};
	// 如果控制点位于起始点和终点的连线中间位置，则 c 指令可以转 l 指令
	const checkC = (pathItem, subPath, index, hasStrokeCap) => {
	    const complexItem = complex(pathItem, subPath[index - 1]);
	    const relVal = getRel(complexItem);
	    const sameLine = (relVal[0] * relVal[5] === relVal[1] * relVal[4])
	        && (relVal[0] * (relVal[4] - relVal[0]) >= 0)
	        && (relVal[2] * relVal[5] === relVal[3] * relVal[4])
	        && (relVal[2] * (relVal[4] - relVal[2]) >= 0);
	    if (sameLine) {
	        if (relVal.every(s => s === 0)) {
	            // 控制点及指令的相对值全部为 0 ，可以视情况移除或转 z 指令
	            if (!hasStrokeCap || hasBrother(subPath, index)) {
	                subPath.splice(index, 1);
	            }
	            else {
	                pathItem.type = 'z';
	            }
	            return;
	        }
	        // 可以直接转直线指令
	        pathItem.type = complexItem.type === 'c' ? 'l' : 'L';
	        pathItem.val = complexItem.val.slice(4);
	    }
	};
	const checkSubPath = (pathResult, hasStroke, hasStrokeCap, sizeDigit, angelDigit) => {
	    const result = [];
	    // 首先过一遍子路径，移除所有的空节点
	    pathResult.forEach(subPath => {
	        for (let j = subPath.length; j--;) {
	            const pathItem = subPath[j];
	            switch (pathItem.type) {
	                case 'm':
	                    // 所有子路径起始位置改为绝对坐标
	                    pathItem.type = 'M';
	                    pathItem.val[0] += subPath[0].from[0];
	                    pathItem.val[1] += subPath[0].from[1];
	                    break;
	                case 'z':
	                    // 没有 cap，可以移除紧跟 m 指令的 z 指令
	                    if (!hasStrokeCap && subPath[j - 1].type.toLowerCase() === 'm') {
	                        subPath.splice(j, 1);
	                    }
	                    break;
	                // 移除长度为 0 的直线指令
	                case 'h':
	                case 'v':
	                    if (pathItem.val[0] === 0) {
	                        checkHV(subPath, j, hasStrokeCap);
	                    }
	                    break;
	                case 't':
	                case 'T':
	                    // 移除 0 长度指令，曲线转直线
	                    checkQ(pathItem, subPath, j, hasStrokeCap);
	                    break;
	                case 'q':
	                case 'Q':
	                    // 移除 0 长度指令，曲线转直线
	                    checkQ(pathItem, subPath, j, hasStrokeCap);
	                    break;
	                case 's':
	                case 'S':
	                    // 移除 0 长度指令，曲线转直线
	                    checkC(pathItem, subPath, j, hasStrokeCap);
	                    break;
	                case 'c':
	                case 'C':
	                    // 移除 0 长度指令，曲线转直线
	                    checkC(pathItem, subPath, j, hasStrokeCap);
	                    break;
	            }
	        }
	    });
	    for (let i = pathResult.length; i--;) {
	        const subPath = pathResult[i];
	        // 没有 stroke 直接移除空的子路径
	        if (!hasStroke) {
	            // triangle 存在 badcase，可能导致崩溃，所以必须 try
	            try {
	                const shapes = triangle(contours(subPath.map(item => [item.type, ...item.val])));
	                if (!shapes.cells.length) {
	                    continue;
	                }
	            }
	            catch (e) { }
	        }
	        // 同向路径合并
	        for (let j = subPath.length; j--;) {
	            const pathItem = subPath[j];
	            switch (pathItem.type.toLowerCase()) {
	                case 'h':
	                case 'v':
	                    combineHV(subPath, pathItem, j);
	                    break;
	                case 'l':
	                    combineL(subPath, pathItem, j, angelDigit);
	                    break;
	                case 'a':
	                    combineA(subPath, pathItem, j, angelDigit);
	                    break;
	            }
	        }
	        // 如果没有 marker，则空的 m 指令没有意义 https://www.w3.org/TR/SVG/paths.html#ZeroLengthSegments
	        // 直接移除子路径即可，因为所有子路径起始点已经改为绝对地址，所以不会有副作用
	        if (subPath.length > 1) {
	            result.unshift(subPath);
	        }
	    }
	    return result;
	};

	// 曲线指令转直线指令
	const straighten = (threshold, pathArr) => {
	    // 必须逆序执行
	    outer: for (let pi = pathArr.length; pi--;) {
	        const pathItem = pathArr[pi];
	        if (pathItem.type.toLowerCase() === 'a') {
	            let [x, y] = [pathItem.val[5], pathItem.val[6]];
	            if (pathItem.type === 'A') {
	                x = minus(x, pathItem.from[0]);
	                y = minus(y, pathItem.from[1]);
	            }
	            const v = new Vector(x, y);
	            if (pathItem.val[0] * 2 < threshold && pathItem.val[1] * 2 < threshold && v.modulo < threshold) {
	                pathItem.type = 'l';
	                pathItem.val = [x, y];
	            }
	        }
	        else if (
	        // c/s 指令可以直接直线化
	        pathItem.type.toLowerCase() === 'c' || pathItem.type.toLowerCase() === 's'
	            ||
	                // q 指令必须保证后续指令不是 t 指令
	                (pathItem.type.toLowerCase() === 'q' && (pi === pathArr.length - 1 || pathArr[pi + 1].type.toLowerCase() !== 't'))) {
	            const complexItem = complex(pathItem, pathArr[pi - 1]);
	            if (complexItem.type.toLowerCase() === complexItem.type) {
	                for (let i = 0; i < complexItem.val.length; i += 2) {
	                    const v = new Vector(complexItem.val[i], complexItem.val[i + 1]);
	                    if (v.modulo >= threshold) {
	                        continue outer;
	                    }
	                }
	                pathItem.type = 'l';
	                // 忽略所有的控制点，直接移动到目标点
	                pathItem.val = pathItem.val.slice(pathItem.val.length - 2);
	            }
	            else {
	                for (let i = 0; i < complexItem.val.length; i += 2) {
	                    const v = new Vector(minus(complexItem.val[i], complexItem.from[0]), minus(complexItem.val[i + 1], complexItem.from[1]));
	                    if (v.modulo >= threshold) {
	                        continue outer;
	                    }
	                }
	                pathItem.type = 'L';
	                // 忽略所有的控制点，直接移动到目标点
	                pathItem.val = pathItem.val.slice(pathItem.val.length - 2);
	            }
	        }
	    }
	    return pathArr;
	};

	const DPItemNormalize = (pathItem) => {
	    switch (pathItem.type) {
	        case 'l':
	            pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
	            pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
	            break;
	        case 'H':
	            pathItem.val.push(pathItem.from[1]);
	            break;
	        case 'h':
	            pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
	            pathItem.val.push(pathItem.from[1]);
	            break;
	        case 'V':
	            pathItem.val.unshift(pathItem.from[0]);
	            break;
	        case 'v':
	            pathItem.val.unshift(pathItem.from[0]);
	            pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
	            break;
	    }
	    pathItem.type = 'L';
	    return pathItem;
	};
	const DPItemMerge = (lastItem, pathItem) => {
	    lastItem.val = lastItem.val.concat(DPItemNormalize(pathItem).val);
	};
	const DPInit = (threshold, pathArr) => {
	    const pathResult = [];
	    let len = 0;
	    for (const pathItem of pathArr) {
	        if (LineTypes.includes(pathItem.type)) {
	            const lastItem = pathResult[len - 1];
	            if (lastItem.type === 'L') {
	                DPItemMerge(lastItem, pathItem);
	            }
	            else {
	                pathResult.push(DPItemNormalize(pathItem));
	                len++;
	            }
	        }
	        else {
	            const lastItem = pathResult[len - 1];
	            if (len > 0 && lastItem.type === 'L') {
	                lastItem.val = douglasPeucker(threshold, lastItem.from.concat(lastItem.val)).slice(2);
	            }
	            pathResult.push(pathItem);
	            len++;
	        }
	    }
	    if (pathResult[len - 1].type === 'L') {
	        const lastItem = pathResult[len - 1];
	        lastItem.val = douglasPeucker(threshold, lastItem.from.concat(lastItem.val)).slice(2);
	    }
	    return pathResult;
	};
	const processPath = (dVal, hasMarker, hasStroke, hasStrokeCap, { thinning, sizeDigit, angelDigit, straighten: straighten$1, }) => {
	    // 先运算一次 doCompute，拿到每条指令的 from 坐标
	    let pathResult = doCompute(execPath(dVal));
	    // 如果存在 marker 引用，多余的优化都不能做
	    if (!hasMarker) {
	        // 存在小尺寸曲线转直线的规则
	        if (straighten$1) {
	            // doCompute 必须执行
	            pathResult = doCompute(pathResult.map(p => straighten(straighten$1, p)));
	        }
	        // 存在路径抽稀规则
	        if (thinning) {
	            // doCompute 必须执行
	            pathResult = doCompute(pathResult.map(p => DPInit(thinning, p)));
	        }
	        // 进行合并、指令转换等运算
	        pathResult = doCompute(checkSubPath(pathResult, hasStroke, hasStrokeCap, sizeDigit, angelDigit));
	    }
	    if (pathResult.length) {
	        return stringifyPath(pathResult, sizeDigit, angelDigit);
	    }
	    else {
	        return '';
	    }
	};
	const computePath = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        execStyleTree(dom);
	        traversalNode(ramda.anyPass([ramda.propEq('nodeName', 'path'), ramda.propEq('nodeName', 'animateMotion'), ramda.propEq('nodeName', 'textPath')]), node => {
	            const option = rule[1];
	            const attrName = node.nodeName === 'path' ? 'd' : 'path';
	            const attrD = node.getAttribute(attrName);
	            const animateAttrs = getAnimateAttr(node);
	            // 是否存在 marker 引用，没有 marker 可以移除所有空移动指令
	            const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none' || getAttr(node, 'marker-mid', 'none') !== 'none' || getAttr(node, 'marker-end', 'none') !== 'none';
	            // 是否存在 stroke，没有 stroke 可以移除面积为 0 的子路径
	            const hasStroke = getAttr(node, 'stroke', 'none') !== 'none' && getAttr(node, 'stroke-width', '1') !== '0';
	            // 是否存在 stroke-linecap，没有 stroke-linecap 可以移除长度为 0 的指令
	            const hasStrokeCap = getAttr(node, 'stroke-linecap', 'butt') !== 'butt';
	            let noAttrD = true;
	            let noAnimateD = true;
	            if (attrD) {
	                const pathResult = processPath(attrD, hasMarker, hasStroke, hasStrokeCap, option);
	                if (!pathResult) {
	                    node.removeAttribute(attrName);
	                }
	                else {
	                    noAttrD = false;
	                    node.setAttribute(attrName, pathResult);
	                }
	            }
	            // animateMotion 的 path 属性不能再次被动画元素修改
	            if (node.nodeName !== 'animateMotion' && checkAnimateAttr(animateAttrs, attrName)) {
	                const animateD = findAnimateAttr(animateAttrs, attrName);
	                animateD.forEach(item => {
	                    const value = item.values.map(val => processPath(val, hasMarker, hasStroke, hasStrokeCap, option));
	                    item.keys.forEach((key, index) => {
	                        if (key === 'values') {
	                            const values = value.slice(index).filter(v => !!v).join(';');
	                            if (values) {
	                                item.node.setAttribute(key, values);
	                            }
	                            else {
	                                item.node.removeAttribute(key);
	                            }
	                        }
	                        else {
	                            if (value[index]) {
	                                item.node.setAttribute(key, value[index]);
	                            }
	                            else {
	                                item.node.removeAttribute(key);
	                            }
	                        }
	                    });
	                });
	                // 再次更新动画属性再进行判断
	                if (node.nodeName === 'path' && checkAnimateAttr(getAnimateAttr(node), attrName)) {
	                    noAnimateD = false;
	                }
	            }
	            // 既没有 d 属性也没有动画 d 属性的 path 元素可以移除
	            // textPath 不适用，还需要判断 href 和 xlink:href 且 href 指向了正确的目标
	            // animateMotion 不适用，还需要判断是否有 mpath 子元素，且 mpath 指向了正确的目标
	            if (noAttrD && noAnimateD && node.nodeName === 'path') {
	                rmNode(node);
	            }
	        }, dom);
	    }
	    resolve();
	});

	const valueIsEqual = (attrDefine, value1, value2) => {
	    if (value1 === value2) {
	        return true;
	    }
	    if (attrDefine.maybeColor) {
	        const color1 = execColor(value1);
	        const color2 = execColor(value2);
	        color1.origin = '';
	        color2.origin = '';
	        if (ramda.equals(color1, color2)) {
	            return true;
	        }
	    }
	    if (attrDefine.maybeSizeNumber || attrDefine.maybeAccurateNumber) {
	        const nums2 = execNumberList(value2);
	        if (nums2.length > 0 && ramda.equals(execNumberList(value1), nums2)) {
	            return true;
	        }
	    }
	    return false;
	};
	const attrIsEqual = (attrDefine, value, nodeName) => {
	    if (typeof attrDefine.initValue === 'string') {
	        return valueIsEqual(attrDefine, value, attrDefine.initValue);
	    }
	    else {
	        const initValue = attrDefine.initValue;
	        for (let ii = 0, il = initValue.length; ii < il; ii++) {
	            if (initValue[ii].tag.includes(nodeName) && valueIsEqual(attrDefine, value, initValue[ii].val)) {
	                return true;
	            }
	        }
	    }
	    return false;
	};

	// rm-attirbute 不再验证 css 类的属性，只关注该 css 属性是否是 svg 所支持的
	const rmAttribute = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { rmDefault, keepEvent, keepAria, } = rule[1];
	        traversalNode(isTag, node => {
	            if (rmDefault) {
	                execStyleTree(dom);
	            }
	            const tagDefine = regularTag[node.nodeName];
	            // href 和 xlink:href 不能并存，如果并存，应该移除后者
	            if (node.hasAttribute('href') && node.hasAttribute('xlink:href')) {
	                node.removeAttribute('xlink:href');
	            }
	            for (let i = node.attributes.length; i--;) {
	                const attr = node.attributes[i];
	                const attrDefine = regularAttr[attr.fullname];
	                const value = attr.value.trim();
	                if (attrDefine.isUndef) { // 非标准属性
	                    let isUndef = true;
	                    if ((keepEvent && eventAttributes.includes(attr.fullname)) // 事件属性是否保留
	                        ||
	                            (keepAria && ariaAttributes.includes(attr.fullname)) // aria 属性是否保留
	                    ) {
	                        isUndef = false;
	                    }
	                    if (isUndef) {
	                        node.removeAttribute(attr.fullname);
	                        continue;
	                    }
	                }
	                else {
	                    if (!value // 空属性
	                        ||
	                            (!attrDefine.couldBeStyle && !attr.fullname.includes('xmlns') && !tagDefine.ownAttributes.includes(attr.fullname)) // 属性和元素不匹配
	                        ||
	                            !legalValue(attrDefine, attr, node.nodeName) // 不合法的值
	                    ) {
	                        node.removeAttribute(attr.fullname);
	                        continue;
	                    }
	                }
	                if (rmDefault) {
	                    // 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
	                    const parentStyle = node.parentNode.styles;
	                    if (attrDefine.inherited && parentStyle && parentStyle.hasOwnProperty(attr.fullname)) {
	                        continue;
	                    }
	                    if (attrIsEqual(attrDefine, value, node.nodeName)) {
	                        node.removeAttribute(attr.fullname);
	                    }
	                }
	                // use 元素的宽高不能为负
	                if (node.nodeName === 'use') {
	                    if (attr.fullname === 'width' || attr.fullname === 'height') {
	                        if (+value < 0) {
	                            node.removeAttribute(attr.fullname);
	                        }
	                    }
	                }
	            }
	        }, dom);
	    }
	    resolve();
	});

	const rmComments = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        traversalNode(ramda.propEq('nodeType', NodeType.Comments), rmNode, dom);
	    }
	    resolve();
	});

	const rmDocType = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        traversalNode(ramda.propEq('nodeType', NodeType.DocType), rmNode, dom);
	    }
	    resolve();
	});

	// 根据条件获取祖先元素
	const getAncestor = (tag, checkFn) => {
	    let _tag = tag;
	    if (checkFn(_tag)) {
	        return _tag;
	    }
	    while (_tag.parentNode) {
	        _tag = _tag.parentNode;
	        if (checkFn(_tag)) {
	            return _tag;
	        }
	    }
	    return null;
	};

	// 检测数值类属性
	const checkNumberAttr = (node, key, allowEmpty, allowAuto, allowZero, animateAttrs) => {
	    const val = getAttr(node, key, '');
	    // 是否允许为空
	    if (!val)
	        return allowEmpty;
	    // 是否允许 auto
	    if (val === 'auto')
	        return allowAuto;
	    // 是否必须大于 0
	    const compare = allowZero ? ramda.gte : ramda.gt;
	    if (compare(parseFloat(val), 0) || checkAnimateAttr(animateAttrs, key, v => compare(parseFloat(val), 0))) {
	        return true;
	    }
	    return false;
	};
	const checkUse = (node, dom) => {
	    if (!node.hasAttribute('href') && !node.hasAttribute('xlink:href')) {
	        rmNode(node);
	    }
	    else {
	        const value = (node.getAttribute('href') || node.getAttribute('xlink:href'));
	        const iri = IRIFullMatch.exec(value);
	        if (iri) {
	            const id = iri[1];
	            // 不允许引用自身或祖先元素
	            if (getAncestor(node, (n) => n.getAttribute('id') === id)) {
	                rmNode(node);
	                return;
	            }
	            // 引用了不存在的元素
	            if (!getById(value, dom)) {
	                rmNode(node);
	            }
	        }
	        else {
	            rmNode(node);
	        }
	    }
	};
	const numberMap = {
	    pattern: {
	        attrs: ['width', 'height'],
	        allowEmpty: false,
	        allowAuto: false,
	        allowZero: false,
	    },
	    mask: {
	        attrs: ['width', 'height'],
	        allowEmpty: true,
	        allowAuto: true,
	        allowZero: false,
	    },
	    marker: {
	        attrs: ['markerWidth', 'markerHeight'],
	        allowEmpty: true,
	        allowAuto: true,
	        allowZero: false,
	    },
	    image: {
	        attrs: ['width', 'height'],
	        allowEmpty: true,
	        allowAuto: true,
	        allowZero: false,
	    },
	};
	const rmHidden = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        execStyleTree(dom);
	        // tslint:disable-next-line: cyclomatic-complexity
	        traversalNode(isTag, node => {
	            // 未包含子节点的文本容器视为隐藏节点
	            if (!node.childNodes.length && regularTag[node.nodeName].containTextNode) {
	                rmNode(node);
	                return;
	            }
	            // textPath 如果没有 path 属性，则 href 和 xlink:href 必须指向 path 或 shape 元素
	            if (node.nodeName === 'textPath') {
	                if (!node.hasAttribute('path')) {
	                    const id = node.getAttribute('href') || node.getAttribute('xlink:href');
	                    if (!id) {
	                        rmNode(node);
	                        return;
	                    }
	                    const target = getById(id, dom);
	                    if (!target) {
	                        rmNode(node);
	                        return;
	                    }
	                    if (!shapeElements.includes(target.nodeName)) {
	                        rmNode(node);
	                        return;
	                    }
	                }
	            }
	            const styles = node.styles;
	            const animateAttrs = getAnimateAttr(node);
	            const notNone = ramda.complement(ramda.equals('none'));
	            if (styles.hasOwnProperty('display')
	                &&
	                    styles.display.value === 'none'
	                &&
	                    !['script', 'style', 'mpath'].concat(filterPrimitiveElements, animationElements).includes(node.nodeName)
	                &&
	                    // 增加对动画的验证，对那些 display 为 none，但是动画会修改 display 的元素也不会进行移除
	                    !checkAnimateAttr(animateAttrs, 'display', notNone)) {
	                rmNode(node);
	                return;
	            }
	            // 没有填充和描边的形状，不一定可以被移除，要再判断一下自身或父元素是否有 id
	            if (shapeElements.includes(node.nodeName)) {
	                const noFill = styles.hasOwnProperty('fill') && styles.fill.value === 'none' && !checkAnimateAttr(animateAttrs, 'fill', notNone);
	                const noStroke = (!styles.hasOwnProperty('stroke') || styles.stroke.value === 'none') && !checkAnimateAttr(animateAttrs, 'stroke', notNone);
	                if (noFill && noStroke && !getAncestor(node, (n) => n.hasAttribute('id'))) {
	                    rmNode(node);
	                    return;
	                }
	            }
	            if (numberMap.hasOwnProperty(node.nodeName)) {
	                const nubmerItem = numberMap[node.nodeName];
	                for (let i = nubmerItem.attrs.length; i--;) {
	                    if (!checkNumberAttr(node, nubmerItem.attrs[i], nubmerItem.allowEmpty, nubmerItem.allowAuto, nubmerItem.allowZero, animateAttrs)) {
	                        rmNode(node);
	                        return;
	                    }
	                }
	            }
	            if (node.nodeName === 'use') {
	                checkUse(node, dom);
	            }
	        }, dom);
	    }
	    resolve();
	});

	const rmIrregularNesting = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { ignore } = rule[1];
	        const notIgnore = (node) => ramda.not(ramda.any(ramda.equals(ramda.prop('nodeName', node)), ignore));
	        traversalNode(ramda.both(isTag, notIgnore), node => {
	            let legalRule = regularTag[node.nodeName].legalChildElements;
	            // noself 表示不允许嵌套自身
	            const noself = legalRule.noself;
	            // transparent 表示参照最近的非 switch 上级元素的规则
	            if (legalRule.transparent) {
	                const parent = getAncestor(node.parentNode, (n) => n.nodeName !== 'switch');
	                legalRule = regularTag[parent.nodeName].legalChildElements;
	            }
	            for (let i = node.childNodes.length; i--;) {
	                const childNode = node.childNodes[i];
	                // 只针对 tag 类的子节点作处理
	                if (!isTag(childNode)) {
	                    continue;
	                }
	                if (noself && childNode.nodeName === node.nodeName) { // 不允许嵌套自身
	                    rmNode(childNode);
	                }
	                else if (legalRule.any) {
	                    // any 表示可以任意嵌套
	                    continue;
	                }
	                else if (legalRule.childElements && !legalRule.childElements.includes(childNode.nodeName)) { // 不在嵌套列表中的情况
	                    rmNode(childNode);
	                }
	            }
	        }, dom, true);
	    }
	    resolve();
	});

	const rmIrregularTag = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { ignore } = rule[1];
	        const notIgnore = (node) => ramda.not(ramda.any(ramda.equals(ramda.prop('nodeName', node)), ignore));
	        traversalNode(ramda.both(isTag, notIgnore), node => {
	            if (regularTag[node.nodeName].isUndef) {
	                rmNode(node);
	            }
	        }, dom);
	    }
	    resolve();
	});

	const pxReg = new RegExp(`(^|\\(|\\s|,|{|;|:)(${numberPattern})px(?=$|\\)|\\s|,|;|})`, 'gi');
	const rmPx = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        traversalNode(isTag, node => {
	            node.attributes.forEach(attr => {
	                if (attr.fullname === 'style') {
	                    const style = execStyle(attr.value);
	                    style.forEach(s => {
	                        if (regularAttr[s.fullname].maybeSizeNumber || regularAttr[s.fullname].maybeAccurateNumber) {
	                            pxReg.lastIndex = 0;
	                            // 移除 px ，同时移除 0 值的单位
	                            s.value = s.value.replace(pxReg, '$1$2').replace(/(^|\D)0[a-z]+/gi, '$10');
	                        }
	                    });
	                    attr.value = stringifyStyle(style);
	                }
	                else {
	                    if (regularAttr[attr.fullname].maybeSizeNumber || regularAttr[attr.fullname].maybeAccurateNumber) {
	                        pxReg.lastIndex = 0;
	                        // 移除 px ，同时移除 0 值的单位
	                        attr.value = attr.value.replace(pxReg, '$1$2').replace(/(^|\D)0[a-z]+/gi, '$10');
	                    }
	                }
	            });
	        }, dom);
	        if (dom.stylesheet) {
	            // 缩短 style 标签内的数值
	            const parsedCss = dom.stylesheet.stylesheet;
	            traversalObj(ramda.both(ramda.has('property'), ramda.has('value')), (cssRule) => {
	                cssRule.value = cssRule.value.replace(pxReg, '$1$2');
	            }, parsedCss.rules);
	        }
	    }
	    resolve();
	});

	const rmUnnecessary = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { tags } = rule[1];
	        if (tags.length) {
	            traversalNode(node => tags.includes(node.nodeName) && unnecessaryElements.includes(node.nodeName), rmNode, dom);
	        }
	    }
	    resolve();
	});

	const rmVersion = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        traversalNode(ramda.propEq('nodeName', 'svg'), node => {
	            node.removeAttribute('version');
	        }, dom);
	    }
	    resolve();
	});

	const rmViewBox = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        traversalNode(node => node.hasAttribute('viewBox'), node => {
	            const size = ['0', '0', '0', '0'];
	            const viewBox = execNumberList(node.getAttribute('viewBox'));
	            // viewBox 属性的长度必须为 4，且 width 和 height 不能为负
	            if (viewBox.length !== 4 || viewBox[2] < 0 || viewBox[3] < 0) {
	                node.removeAttribute('viewBox');
	                return;
	            }
	            node.attributes.forEach(attr => {
	                if (node.nodeName === 'marker') {
	                    if (attr.fullname === 'markerWidth') {
	                        size[2] = attr.value.replace(/px$/, '');
	                    }
	                    else if (attr.fullname === 'markerHeight') {
	                        size[3] = attr.value.replace(/px$/, '');
	                    }
	                }
	                else {
	                    switch (attr.fullname) {
	                        case 'x':
	                            size[0] = attr.value.replace(/px$/, '');
	                            break;
	                        case 'y':
	                            size[1] = attr.value.replace(/px$/, '');
	                            break;
	                        case 'width':
	                            size[2] = attr.value.replace(/px$/, '');
	                            break;
	                        case 'height':
	                            size[3] = attr.value.replace(/px$/, '');
	                            break;
	                    }
	                }
	            });
	            // x、y、width、height 可以是不同的单位，只有当单位是 px 且和 viewBox 各个位置相等时，才可以移除 viewBox
	            if (ramda.equals(size, viewBox.map(s => `${s}`))) {
	                node.removeAttribute('viewBox');
	            }
	        }, dom);
	    }
	    resolve();
	});

	const rmXMLDecl = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        traversalNode(ramda.propEq('nodeType', NodeType.XMLDecl), rmNode, dom);
	    }
	    resolve();
	});

	const rmXMLNS = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const traversalNode = (node, nsStack) => {
	            if (isTag(node)) {
	                const xmlnsObj = {};
	                Object.assign(xmlnsObj, nsStack[nsStack.length - 1]);
	                // 首先判断节点是否存在命名空间
	                if (node.namespace) {
	                    if (xmlnsObj.hasOwnProperty(node.namespace)) {
	                        xmlnsObj[node.namespace].count++;
	                    }
	                    else {
	                        rmNode(node);
	                        return;
	                    }
	                }
	                // 遍历节点属性的命名空间
	                for (let i = node.attributes.length; i--;) {
	                    const attr = node.attributes[i];
	                    if (attr.namespace === 'xmlns') {
	                        xmlnsObj[attr.name] = {
	                            target: node,
	                            count: 0,
	                        };
	                    }
	                    else if (attr.namespace) {
	                        if (xmlnsObj.hasOwnProperty(attr.namespace)) {
	                            xmlnsObj[attr.namespace].count++;
	                        }
	                        else {
	                            node.removeAttribute(attr.fullname);
	                        }
	                    }
	                }
	                // 压栈，并遍历子节点
	                nsStack.push(xmlnsObj);
	                node.childNodes.forEach(childNode => {
	                    traversalNode(childNode, nsStack);
	                });
	                Object.keys(xmlnsObj).forEach(ns => {
	                    if (xmlnsObj[ns].count === 0 && xmlnsObj[ns].target === node) {
	                        node.removeAttribute(`xmlns:${ns}`);
	                    }
	                });
	                nsStack.pop();
	            }
	        };
	        dom.childNodes.forEach(node => {
	            traversalNode(node, [{}]);
	        });
	    }
	    resolve();
	});

	// 验证 animateMotion 的合法性
	const checkAnimateMotion = (node, dom) => {
	    return node.hasAttribute('path')
	        ||
	            node.childNodes.some(subNode => {
	                if (subNode.nodeName !== 'mpath') {
	                    return false;
	                }
	                const id = subNode.getAttribute('href') || subNode.getAttribute('xlink:href');
	                if (!id) {
	                    return false;
	                }
	                const target = getById(id, dom);
	                if (!target) {
	                    return false;
	                }
	                return shapeElements.includes(target.nodeName);
	            });
	};

	const shortenAnimate = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { remove } = rule[1];
	        // tslint:disable-next-line: cyclomatic-complexity
	        traversalNode(node => animationElements.includes(node.nodeName), (node) => {
	            if (remove) {
	                rmNode(node);
	                return;
	            }
	            // 不管 href 能不能找到目标，都移除该属性，改为设置成 target 的子元素
	            const href = node.hasAttribute('href') ? node.getAttribute('href') : node.getAttribute('xlink:href');
	            if (href) {
	                const target = getById(href, dom);
	                if (target) {
	                    target.appendChild(node);
	                }
	            }
	            node.removeAttribute('href');
	            node.removeAttribute('xlink:href');
	            // 处理 attributeName 属性
	            if (animationAttrElements.includes(node.nodeName)) {
	                // 先取出来 attributeName 属性
	                const attributeName = node.getAttribute('attributeName') || '';
	                if (!attributeName || !regularAttr[attributeName].animatable) {
	                    // attributeName 指定了不能实现动画的属性，视为无效
	                    rmNode(node);
	                    return;
	                }
	                // attributeName 和父元素不匹配
	                const parentName = node.parentNode.nodeName;
	                if (!regularAttr[attributeName].applyTo.includes(parentName) && !regularTag[parentName].ownAttributes.includes(attributeName)) {
	                    rmNode(node);
	                    return;
	                }
	                // animateTransform 只能修改 tranform 类型的属性
	                // https://svgwg.org/specs/animations/#SVGExtensionsToSMILAnimation
	                if (node.nodeName === 'animateTransform' && attributeName !== 'transform' && attributeName !== 'patternTransform') {
	                    rmNode(node);
	                    return;
	                }
	                for (const attr of node.attributes) {
	                    // 对动画属性 from、to、by、values 的值进行合法性验证
	                    if (animationAttributes.includes(attr.fullname)) {
	                        // 动画属性不合法
	                        if ((attr.fullname !== 'values' && !legalValue(regularAttr[attributeName], attr))) {
	                            node.removeAttribute(attr.fullname);
	                            continue;
	                        }
	                        // values 是以分号分隔的，需要分隔后对每一项进行合法性验证
	                        const values = attr.value.split(';');
	                        if (values.every(val => !legalValue(regularAttr[attributeName], {
	                            name: 'values',
	                            fullname: 'values',
	                            namespace: '',
	                            value: val.trim(),
	                        }))) {
	                            node.removeAttribute(attr.fullname);
	                        }
	                    }
	                }
	                if (node.nodeName === 'set' && !node.getAttribute('to')) {
	                    rmNode(node);
	                    return;
	                }
	                if (!animationAttributes.some(key => node.hasAttribute(key))) {
	                    rmNode(node);
	                    return;
	                }
	            }
	            // animateMotion 如果没有 path 属性，则必须包含有效的 mpath ，规则是 href 或 xlink:href 指向 path 或 shape 元素
	            if (node.nodeName === 'animateMotion') {
	                if (!checkAnimateMotion(node, dom)) {
	                    rmNode(node);
	                    return;
	                }
	            }
	        }, dom);
	    }
	    resolve();
	});

	const letterList = 'abcdefghijklmnopqrstuvwxyz';
	const numberList = '0123456789';
	const startChar = `${letterList}${letterList.toUpperCase()}_`;
	const nameChar = `${startChar}${numberList}-`;
	const startLen = startChar.length;
	const nameLen = nameChar.length;
	const sList = startChar.split('');
	let slen = startLen;
	let pi = 0;
	const createShortenID = (si) => {
	    while (si >= slen) {
	        sList.push.apply(sList, nameChar.split('').map(s => sList[pi] + s));
	        slen += nameLen;
	        pi++;
	    }
	    return sList[si];
	};

	const classSelectorReg = /\.([^,\*#>+~:{\s\[\.]+)/gi;
	const shortenClass = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const parsedCss = dom.stylesheet;
	        if (parsedCss) {
	            let si = 0;
	            const classList = {};
	            const shorten = (key) => {
	                if (classList.hasOwnProperty(key)) {
	                    return classList[key][0];
	                }
	                const sid = createShortenID(si++);
	                classList[key] = [sid, false];
	                return sid;
	            };
	            // 取出所有被引用的 class ，并缩短
	            const cssRules = parsedCss.stylesheet;
	            traversalObj(ramda.has('selectors'), (ruleItem) => {
	                const selectors = ruleItem.selectors;
	                if (selectors) {
	                    selectors.forEach((selector, selectorIndex) => {
	                        selectors[selectorIndex] = selector.replace(classSelectorReg, (m, p) => `.${shorten(p)}`);
	                    });
	                }
	            }, cssRules.rules);
	            // 查找 dom 树，找到被引用的 class ，替换为缩短后的值
	            traversalNode(isTag, node => {
	                const classAttr = node.getAttribute('class');
	                if (classAttr !== null) {
	                    const className = mixWhiteSpace(classAttr.trim()).split(/\s+/);
	                    for (let ci = className.length; ci--;) {
	                        if (classList.hasOwnProperty(className[ci])) {
	                            const cName = classList[className[ci]][0];
	                            classList[className[ci]][1] = true;
	                            className[ci] = cName;
	                        }
	                        else {
	                            className.splice(ci, 1);
	                        }
	                    }
	                    if (className.length) {
	                        node.setAttribute('class', className.join(' '));
	                    }
	                    else {
	                        node.removeAttribute('class');
	                    }
	                }
	            }, dom);
	            // 最后移除不存在的 class 引用
	            Object.values(classList).forEach(item => {
	                if (item[1]) {
	                    return;
	                }
	                const reg = new RegExp(`\\.${item[0]}(?=[,\\*#>+~:{\\s\\[\\.]|$)`);
	                traversalObj(ramda.has('selectors'), (ruleItem, path) => {
	                    const selectors = ruleItem.selectors;
	                    if (selectors) {
	                        for (let i = selectors.length; i--;) {
	                            if (reg.test(selectors[i])) {
	                                selectors.splice(i, 1);
	                            }
	                        }
	                        if (!selectors.length) {
	                            const parent = path[path.length - 1];
	                            parent.splice(parent.indexOf(ruleItem), 1);
	                        }
	                    }
	                }, cssRules.rules);
	            });
	        }
	        else {
	            // 如果不存在样式表，则直接移除所有的 class 属性
	            traversalNode(isTag, node => {
	                node.removeAttribute('class');
	            }, dom);
	        }
	    }
	    resolve();
	});

	const rgb2hsl = (rgb) => {
	    const r = rgb.r / FF;
	    const g = rgb.g / FF;
	    const b = rgb.b / FF;
	    const max = Math.max(r, g, b);
	    const min = Math.min(r, g, b);
	    const diff = max - min;
	    const l = (max + min) / 2;
	    const h = diff === 0 ?
	        0 :
	        max === r ?
	            (g - b) / diff :
	            max === g ?
	                (b - r) / diff + 2 :
	                (r - g) / diff + 4;
	    const s = diff === 0 ?
	        0 :
	        l < HALF ?
	            diff / (l * 2) :
	            diff / (2 - l * 2);
	    return { h: validNum(CIRC, (h + CIRC) % 6 * (CIRC / 6)), s: validNum(Hundred, s * Hundred), l: validNum(Hundred, l * Hundred) };
	};

	const fillIn = ramda.curry((digit, s) => s.length >= digit ? s : fillIn(digit, `0${s}`));

	const HEX = 16;
	const TEN = 10;
	const toHex = (s) => parseInt(`${s}`, TEN).toString(HEX);

	const operateHex = ramda.pipe(toHex, ramda.toLower, fillIn(2));
	const alphaMap$1 = {
	    '100': 255,
	    '99': 252,
	    '98': 250,
	    '97': 247,
	    '96': 245,
	    '95': 242,
	    '94': 240,
	    '93': 237,
	    '92': 235,
	    '91': 232,
	    '90': 230,
	    '89': 227,
	    '88': 224,
	    '87': 222,
	    '86': 219,
	    '85': 217,
	    '84': 214,
	    '83': 212,
	    '82': 209,
	    '81': 207,
	    '80': 204,
	    '79': 201,
	    '78': 199,
	    '77': 196,
	    '76': 194,
	    '75': 191,
	    '74': 189,
	    '73': 186,
	    '72': 184,
	    '71': 181,
	    '70': 179,
	    '69': 176,
	    '68': 173,
	    '67': 171,
	    '66': 168,
	    '65': 166,
	    '64': 163,
	    '63': 161,
	    '62': 158,
	    '61': 156,
	    '60': 153,
	    '59': 150,
	    '58': 148,
	    '57': 145,
	    '56': 143,
	    '55': 140,
	    '54': 138,
	    '53': 135,
	    '52': 133,
	    '51': 130,
	    '50': 128,
	    '49': 125,
	    '48': 122,
	    '47': 120,
	    '46': 117,
	    '45': 115,
	    '44': 112,
	    '43': 110,
	    '42': 107,
	    '41': 105,
	    '40': 102,
	    '39': 99,
	    '38': 97,
	    '37': 94,
	    '36': 92,
	    '35': 89,
	    '34': 87,
	    '33': 84,
	    '32': 82,
	    '31': 79,
	    '30': 77,
	    '29': 74,
	    '28': 71,
	    '27': 69,
	    '26': 66,
	    '25': 64,
	    '24': 61,
	    '23': 59,
	    '22': 56,
	    '21': 54,
	    '20': 51,
	    '19': 48,
	    '18': 46,
	    '17': 43,
	    '16': 41,
	    '15': 38,
	    '14': 36,
	    '13': 33,
	    '12': 31,
	    '11': 28,
	    '10': 26,
	    '9': 23,
	    '8': 20,
	    '7': 18,
	    '6': 15,
	    '5': 13,
	    '4': 10,
	    '3': 8,
	    '2': 5,
	    '1': 3,
	    '0': 0,
	};
	const shortenMap = {
	    '#f0ffff': 'azure',
	    '#f5f5dc': 'beige',
	    '#ffe4c4': 'bisque',
	    '#a52a2a': 'brown',
	    '#ff7f50': 'coral',
	    '#ffd700': 'gold',
	    '#808080': 'gray',
	    '#008000': 'green',
	    '#4b0082': 'indigo',
	    '#fffff0': 'ivory',
	    '#f0e68c': 'khaki',
	    '#faf0e6': 'linen',
	    '#800000': 'maroon',
	    '#000080': 'navy',
	    '#808000': 'olive',
	    '#ffa500': 'orange',
	    '#da70d6': 'orchid',
	    '#cd853f': 'peru',
	    '#ffc0cb': 'pink',
	    '#dda0dd': 'plum',
	    '#800080': 'purple',
	    '#f00': 'red',
	    '#fa8072': 'salmon',
	    '#a0522d': 'sienna',
	    '#c0c0c0': 'silver',
	    '#fffafa': 'snow',
	    '#d2b48c': 'tan',
	    '#008080': 'teal',
	    '#ff6347': 'tomato',
	    '#ee82ee': 'violet',
	    '#f5deb3': 'wheat',
	};
	const shortenReg = new RegExp(`(?:${Object.keys(shortenMap).join('|')})(?=[^0-9a-f]|$)`, 'gi');
	const formatColor = (rgba, str, digit) => {
	    const color = execColor(str, digit);
	    let s = color.origin;
	    if (color.valid) {
	        if (color.a < 1) {
	            // tslint:disable:prefer-conditional-expression
	            if (rgba) {
	                s = `#${operateHex(color.r)}${operateHex(color.g)}${operateHex(color.b)}${ramda.has(`${color.a * Hundred}`, alphaMap$1) ? operateHex(alphaMap$1[`${color.a * Hundred}`]) : operateHex(Math.round(color.a * FF))}`;
	            }
	            else {
	                if (color.r === 0 && color.g === 0 && color.b === 0 && color.a === 0) {
	                    s = 'transparent';
	                }
	                else {
	                    const hslColor = rgb2hsl(color);
	                    const alpha = shortenAlpha(digit, color.a);
	                    const rgb = `rgb(${color.r},${color.g},${color.b},${alpha})`;
	                    const hsl = `hsl(${hslColor.h},${hslColor.s}%,${hslColor.l}%,${alpha})`;
	                    s = hsl.length < rgb.length ? hsl : rgb;
	                }
	            }
	        }
	        else {
	            s = `#${operateHex(color.r)}${operateHex(color.g)}${operateHex(color.b)}`;
	        }
	        s = s.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3(?=[^0-9a-f]|$)/gi, '#$1$2$3');
	        s = s.replace(shortenReg, $0 => `${shortenMap[$0]}`);
	        if (rgba) {
	            s = s.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3([0-9a-f])\4(?=[^0-9a-f]|$)/gi, '#$1$2$3$4');
	            s = s.replace(/^transparent$/i, '#0000');
	        }
	    }
	    // 如果处理后结果不理想，还返回原始字符串
	    if (s.length > color.origin.length) {
	        return color.origin;
	    }
	    return s;
	};
	const shortenColor = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { rrggbbaa, opacityDigit } = rule[1];
	        const digit = Math.min(opacityDigit, OPACITY_DIGIT);
	        traversalNode(isTag, node => {
	            node.attributes.forEach(attr => {
	                if (regularAttr[attr.fullname].maybeColor) {
	                    attr.value = formatColor(rrggbbaa, attr.value, digit);
	                }
	                else if (attr.fullname === 'style') {
	                    const style = execStyle(attr.value);
	                    style.forEach(s => {
	                        if (regularAttr[s.fullname].maybeColor) {
	                            s.value = formatColor(rrggbbaa, s.value, digit);
	                        }
	                    });
	                    attr.value = stringifyStyle(style);
	                }
	            });
	        }, dom);
	        if (dom.stylesheet) {
	            // 缩短 style 标签内的颜色
	            const parsedCss = dom.stylesheet.stylesheet;
	            traversalObj(ramda.both(ramda.has('property'), ramda.has('value')), (cssRule) => {
	                if (regularAttr[cssRule.property].maybeColor) { // 可能为颜色的属性
	                    cssRule.value = formatColor(rrggbbaa, cssRule.value, digit);
	                }
	            }, parsedCss.rules);
	        }
	    }
	    resolve();
	});

	// 移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号
	const doShorten = ramda.curry((digit, val) => shortenNumberList(val.replace(numberGlobal, s => `${shortenNumber(toFixed(digit, parseFloat(s)))}`)));
	const shortenDecimalDigits = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { sizeDigit, angelDigit } = rule[1];
	        const fuzzyDigit = doShorten(sizeDigit);
	        const accurateDigit = doShorten(angelDigit);
	        const shortenValue = (key, value) => {
	            const define = regularAttr[key];
	            if (define.maybeAlpha) { // alpha 值采用特殊处理逻辑
	                const alpha = execAlpha(value);
	                if (typeof alpha === 'number') {
	                    return shortenAlpha(angelDigit, alpha);
	                }
	            }
	            else if (define.maybeSizeNumber) { // 可以模糊处理的数字
	                return fuzzyDigit(value);
	            }
	            else if (define.maybeAccurateNumber) { // 需要较精确的数字
	                return accurateDigit(value);
	            }
	            return value;
	        };
	        if (dom.stylesheet) {
	            // 缩短 style 标签内的数值
	            const parsedCss = dom.stylesheet.stylesheet;
	            traversalObj(ramda.both(ramda.has('property'), ramda.has('value')), (cssRule) => {
	                cssRule.value = shortenValue(cssRule.property, cssRule.value);
	            }, parsedCss.rules);
	        }
	        traversalNode(isTag, node => {
	            // 先取出来 attributeName 属性
	            const attributeName = node.getAttribute('attributeName');
	            // 缩短节点属性的数值
	            node.attributes.forEach(attr => {
	                numberGlobal.lastIndex = 0;
	                if (animationAttributes.includes(attr.fullname) && animationAttrElements.includes(node.nodeName)) { // 动画处理的属性，需要根据 attributeName 属性判断
	                    if (attributeName) {
	                        attr.value = shortenValue(attributeName, attr.value);
	                    }
	                }
	                else if (attr.fullname === 'style') { // css 样式处理，和属性类似
	                    const style = execStyle(attr.value);
	                    style.forEach(s => {
	                        numberGlobal.lastIndex = 0;
	                        s.value = shortenValue(s.fullname, s.value);
	                    });
	                    attr.value = stringifyStyle(style);
	                }
	                else {
	                    attr.value = shortenValue(attr.fullname, attr.value);
	                }
	            });
	        }, dom);
	    }
	    resolve();
	});

	const checkSub = (node, IDList, isDefs = false) => {
	    let hasId = false;
	    if (!isDefs) {
	        const id = node.getAttribute('id');
	        if (id) {
	            if (IDList[id]) {
	                hasId = true;
	                IDList[id].tag = node;
	            }
	        }
	    }
	    if (!hasId) {
	        for (let ci = node.childNodes.length; ci--;) {
	            const childNode = node.childNodes[ci];
	            if (isTag(childNode)) {
	                checkSub(childNode, IDList);
	            }
	            else {
	                rmNode(childNode);
	            }
	        }
	        if (!node.childNodes.length) {
	            rmNode(node);
	        }
	        else if (!isDefs) {
	            node.parentNode.replaceChild(node, ...node.childNodes);
	        }
	    }
	};
	const checkDefsApply = (item, dom) => {
	    const [node, attrName] = item.iri[0];
	    // 只有 href 和 xlink:href 才能应用
	    if (attrName !== 'href' && attrName !== 'xlink:href') {
	        return;
	    }
	    switch (node.nodeName) {
	        case 'use':
	            // TODO 有 x 和 y 的暂不做应用（实际效果应该相当于 translate，待验证）
	            if (node.hasAttribute('x') || node.hasAttribute('y')) {
	                return;
	            }
	            // 具有 viewport ，且 use 定义了宽高，不进行应用
	            if (['svg', 'symbol'].includes(item.tag.nodeName) && (node.hasAttribute('width') || node.hasAttribute('height'))) {
	                return;
	            }
	            const originStyle = {};
	            const originAttr = {};
	            for (const [key, val] of Object.entries(node.styles)) {
	                // 如果 use 元素被 style 命中，不能进行应用
	                if (val.from === 'styletag') {
	                    return;
	                }
	                if (val.from === 'attr') {
	                    originAttr[key] = val.value;
	                }
	                if (val.from === 'inline') {
	                    originStyle[key] = val.value;
	                }
	            }
	            const useTag = item.tag;
	            node.parentNode.replaceChild(node, useTag);
	            const styleArray = useTag.hasAttribute('style') ? execStyle(useTag.getAttribute('style')) : [];
	            for (const [key, val] of Object.entries(originAttr)) {
	                if (!useTag.hasAttribute(key) && !styleArray.some(sItem => sItem.fullname === key)) {
	                    useTag.setAttribute(key, val);
	                }
	            }
	            for (const [key, val] of Object.entries(originStyle)) {
	                if (!useTag.hasAttribute(key) && !styleArray.some(sItem => sItem.fullname === key)) {
	                    styleArray.push({
	                        name: key,
	                        fullname: key,
	                        value: val,
	                    });
	                }
	            }
	            if (styleArray.length) {
	                useTag.setAttribute('style', stringifyStyle(styleArray));
	            }
	            return;
	        case 'mpath':
	            const pathTag = item.tag;
	            const mpathParent = node.parentNode;
	            if (!shapeElements.includes(pathTag.nodeName)) {
	                rmNode(node);
	                rmNode(pathTag);
	                if (!checkAnimateMotion(mpathParent, dom)) {
	                    rmNode(mpathParent);
	                }
	                return;
	            }
	            // 只针对路径元素进行应用
	            if (pathTag.nodeName === 'path') {
	                const d = pathTag.getAttribute('d');
	                if (d) {
	                    mpathParent.setAttribute('path', d);
	                    rmNode(node);
	                    rmNode(pathTag);
	                }
	            }
	            return;
	    }
	};
	const shortenDefs = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        let firstDefs;
	        // 首先合并 defs 标签
	        traversalNode(ramda.propEq('nodeName', 'defs'), node => {
	            if (firstDefs) {
	                for (const childNode of node.childNodes) {
	                    // 合并时只把标签类元素挪过去
	                    if (isTag(childNode)) {
	                        firstDefs.appendChild(childNode);
	                    }
	                }
	                rmNode(node);
	            }
	            else {
	                firstDefs = node;
	                for (let ci = node.childNodes.length; ci--;) {
	                    const childNode = node.childNodes[ci];
	                    // 只保留标签类的子元素
	                    if (!isTag(childNode)) {
	                        rmNode(childNode);
	                    }
	                }
	            }
	        }, dom);
	        if (firstDefs) {
	            // 取出所有被引用的 ID
	            const IDList = {};
	            traversalNode(isTag, node => {
	                node.attributes.forEach(attr => {
	                    if (regularAttr[attr.fullname].maybeFuncIRI) {
	                        const firi = funcIRIToID.exec(attr.value);
	                        if (firi) {
	                            if (!IDList[firi[2]]) {
	                                IDList[firi[2]] = {
	                                    iri: [],
	                                };
	                            }
	                            IDList[firi[2]].iri.push([node, attr.fullname]);
	                        }
	                    }
	                    else if (regularAttr[attr.fullname].maybeIRI) {
	                        const iri = IRIFullMatch.exec(attr.value);
	                        if (iri) {
	                            if (!IDList[iri[1]]) {
	                                IDList[iri[1]] = {
	                                    iri: [],
	                                };
	                            }
	                            IDList[iri[1]].iri.push([node, attr.fullname]);
	                        }
	                    }
	                });
	            }, dom);
	            checkSub(firstDefs, IDList, true);
	            execStyleTree(dom);
	            Object.values(IDList).forEach(item => {
	                if (item.tag) {
	                    // 有可能引用对象存在于 defs 内部，并且已被移除
	                    for (let i = item.iri.length; i--;) {
	                        const [tag] = item.iri[i];
	                        // 判断是否已从文档中移除
	                        if (!getAncestor(tag, (node) => node.nodeName === '#document')) {
	                            item.iri.splice(i, 1);
	                        }
	                    }
	                    if (!item.iri.length) {
	                        rmNode(item.tag);
	                    }
	                    if (item.iri.length === 1) {
	                        checkDefsApply(item, dom);
	                    }
	                }
	            });
	        }
	    }
	    resolve();
	});

	const feFuncAttr = ['tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset'];
	const feTypeNeed = {
	    identity: [],
	    table: ['tableValues'],
	    discrete: ['tableValues'],
	    linear: ['slope', 'intercept'],
	    gamma: ['amplitude', 'exponent', 'offset'],
	};
	const checkFeAttrs = (type, rmAttrs) => {
	    if (feTypeNeed.hasOwnProperty(type)) {
	        feTypeNeed[type].forEach(val => {
	            const index = rmAttrs.indexOf(val);
	            if (index !== -1) {
	                rmAttrs.splice(index, 1);
	            }
	        });
	    }
	};
	const shortenFilter = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        traversalNode(isTag, (node) => {
	            if (filterPrimitiveElements.includes(node.nodeName) || node.nodeName === 'filter') {
	                const width = node.getAttribute('width');
	                const height = node.getAttribute('height');
	                // 滤镜元素的 region 尺寸必须合法
	                if ((width && parseFloat(width) <= 0) || (height && parseFloat(height) <= 0)) {
	                    rmNode(node);
	                    return;
	                }
	            }
	            // filter 没有子元素没有意义
	            if (node.nodeName === 'filter') {
	                let hasFilterSub = false;
	                node.childNodes.forEach(subNode => {
	                    if (filterPrimitiveElements.includes(subNode.nodeName)) {
	                        hasFilterSub = true;
	                    }
	                });
	                if (!hasFilterSub) {
	                    rmNode(node);
	                    return;
	                }
	            }
	            // feComponentTransfer 的同一个类型的 transferFunctionElement 子元素不允许多次出现
	            if (node.nodeName === 'feComponentTransfer') {
	                const funcUnique = {};
	                for (let i = node.childNodes.length; i--;) {
	                    const childNode = node.childNodes[i];
	                    if (funcUnique[childNode.nodeName]) {
	                        rmNode(childNode);
	                        continue;
	                    }
	                    if (transferFunctionElements.includes(childNode.nodeName)) {
	                        funcUnique[childNode.nodeName] = true;
	                    }
	                }
	            }
	            // transferFunctionElement 不同的 type 所需的属性不一样，其它不必要的属性都可以删掉
	            // https://drafts.fxtf.org/filter-effects/#element-attrdef-fecomponenttransfer-type
	            if (transferFunctionElements.includes(node.nodeName)) {
	                const type = node.getAttribute('type') || '';
	                const animateAttrs = getAnimateAttr(node).filter(item => item.attributeName === 'type');
	                if (!type && !animateAttrs.length) {
	                    rmNode(node);
	                    return;
	                }
	                const rmAttrs = feFuncAttr.slice();
	                // 保留当前 type 必备的属性
	                checkFeAttrs(type, rmAttrs);
	                // 遍历并保留每一个 animate type 的必备属性
	                animateAttrs.forEach(item => {
	                    item.values.forEach(val => {
	                        checkFeAttrs(val, rmAttrs);
	                    });
	                });
	                // 最后移除掉不必要的属性
	                rmAttrs.forEach(attr => {
	                    node.removeAttribute(attr);
	                });
	            }
	        }, dom);
	    }
	    resolve();
	});

	const shortenStyle = (s) => mixWhiteSpace(s.trim()).replace(/\s*([@='"#\.\*+>~\[\]\(\){}:,;])\s*/g, '$1').replace(/;$/, '');

	const idSelectorReg = /#([^,\*#>+~:{\s\[\.]+)/gi;
	const style2value = ramda.pipe(stringifyStyle, shortenStyle);
	const shortenID = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        let si = 0;
	        const IDList = {};
	        const shorten = (node, attrname, key) => {
	            if (IDList.hasOwnProperty(key)) {
	                return IDList[key][0];
	            }
	            const sid = createShortenID(si++);
	            IDList[key] = [sid, node, attrname];
	            return sid;
	        };
	        let cssRules;
	        // 取出 ID 选择器，并缩短
	        if (dom.stylesheet) {
	            cssRules = dom.stylesheet.stylesheet;
	            traversalObj(ramda.has('selectors'), (ruleItem) => {
	                const selectors = ruleItem.selectors;
	                if (selectors) {
	                    selectors.forEach((selector, selectorIndex) => {
	                        selectors[selectorIndex] = selector.replace(idSelectorReg, (m, p) => `#${shorten(dom.styletag, null, p)}`);
	                    });
	                }
	            }, cssRules.rules);
	        }
	        // 取出所有被属性引用的 ID ，并缩短
	        traversalNode(isTag, node => {
	            node.attributes.forEach(attr => {
	                if (regularAttr[attr.fullname].maybeFuncIRI) {
	                    const firi = funcIRIToID.exec(attr.value);
	                    if (firi) {
	                        attr.value = `url(#${shorten(node, attr.fullname, firi[2])})`;
	                    }
	                }
	                else if (regularAttr[attr.fullname].maybeIRI) {
	                    const iri = IRIFullMatch.exec(attr.value);
	                    if (iri) {
	                        attr.value = `#${shorten(node, attr.fullname, iri[1])}`;
	                    }
	                }
	                else if (attr.fullname === 'style') {
	                    const styleObj = execStyle(attr.value);
	                    styleObj.forEach(styleItem => {
	                        if (regularAttr[styleItem.fullname].maybeFuncIRI) {
	                            const firi = funcIRIToID.exec(styleItem.value);
	                            if (firi) {
	                                styleItem.value = `url(#${shorten(node, `style|${styleItem.fullname}`, firi[2])})`;
	                            }
	                        }
	                    });
	                    attr.value = style2value(styleObj);
	                }
	            });
	        }, dom);
	        // 查找 dom 树，找到被引用的 ID ，替换为缩短后的值
	        traversalNode(isTag, (node) => {
	            const ID = node.getAttribute('id');
	            if (ID !== null) {
	                if (IDList.hasOwnProperty(ID)) {
	                    const id = IDList[ID][0];
	                    // tslint:disable-next-line:no-dynamic-delete
	                    delete IDList[ID];
	                    node.setAttribute('id', id);
	                }
	                else {
	                    node.removeAttribute('id');
	                }
	            }
	        }, dom);
	        // 最后移除不存在的 ID 引用
	        Object.values(IDList).forEach(item => {
	            const attrName = item[2];
	            if (typeof attrName === 'string') {
	                if (attrName.startsWith('style|')) {
	                    const styleObj = execStyle(item[1].getAttribute('style')).filter(styleItem => styleItem.fullname !== attrName.slice(6));
	                    if (styleObj.length) {
	                        item[1].setAttribute('style', style2value(styleObj));
	                    }
	                    else {
	                        item[1].removeAttribute('style');
	                    }
	                }
	                else {
	                    item[1].removeAttribute(attrName);
	                }
	            }
	            else {
	                const reg = new RegExp(`#${item[0]}(?=[,\\*#>+~:{\\s\\[\\.]|$)`);
	                traversalObj(ramda.has('selectors'), (ruleItem, path) => {
	                    const selectors = ruleItem.selectors;
	                    if (selectors) {
	                        for (let i = selectors.length; i--;) {
	                            if (reg.test(selectors[i])) {
	                                selectors.splice(i, 1);
	                            }
	                        }
	                        if (!selectors.length) {
	                            const parent = path[path.length - 1];
	                            parent.splice(parent.indexOf(ruleItem), 1);
	                        }
	                    }
	                }, cssRules.rules);
	            }
	        });
	    }
	    resolve();
	});

	// 去除 style 标签最后的分号
	const shortenTag = (s) => s.replace(/;}/g, '}');

	const createNode = (node) => {
	    let xml = '';
	    const textContent = node.textContent;
	    switch (node.nodeType) {
	        case NodeType.Tag:
	            xml += createTag(node);
	            break;
	        case NodeType.Text:
	            xml += textContent;
	            break;
	        case NodeType.XMLDecl:
	            xml += `<?xml${mixWhiteSpace(` ${textContent}`).replace(/\s(?="|=|$)/g, '')}?>`;
	            break;
	        case NodeType.Comments:
	            const comments = mixWhiteSpace(textContent).trim();
	            if (comments) {
	                xml += `<!--${comments}-->`;
	            }
	            break;
	        case NodeType.CDATA:
	            if (!textContent.includes('<')) {
	                xml += textContent;
	            }
	            else {
	                xml += `<![CDATA[${textContent}]]>`;
	            }
	            break;
	        case NodeType.DocType:
	            xml += `<!DOCTYPE${mixWhiteSpace(` ${textContent.trim()}`)}>`;
	            break;
	    }
	    return xml;
	};
	const createTag = (node) => {
	    let xml = '';
	    xml += `<${node.namespace ? `${node.namespace}:` : ''}${node.nodeName}`;
	    if (node.attributes.length) {
	        for (const { name, value, namespace } of node.attributes) {
	            if (value.trim()) {
	                xml += ` ${namespace ? `${namespace}:` : ''}${name}="${mixWhiteSpace(value.trim()).replace(/"/g, '&quot;')}"`;
	            }
	        }
	    }
	    if (node.childNodes.length) {
	        xml += '>';
	        node.childNodes.forEach(childNode => {
	            xml += createNode(childNode);
	        });
	        xml += `</${node.namespace ? `${node.namespace}:` : ''}${node.nodeName}>`;
	    }
	    else {
	        xml += '/>';
	    }
	    return xml;
	};
	const createXML = (dom) => {
	    if (!dom) {
	        return '';
	    }
	    let result = '';
	    if (dom.stylesheet) {
	        const cssText = shortenTag(css.stringify(dom.stylesheet, { compress: true }));
	        if (cssText) {
	            dom.styletag.childNodes[0].textContent = cssText;
	        }
	        else {
	            rmNode(dom.styletag);
	        }
	    }
	    dom.childNodes.forEach(node => {
	        result += createNode(node);
	    });
	    return result;
	};

	const startWithNumber = new RegExp(`^(${numberPattern})`);
	const notNone = ramda.complement(ramda.equals('none'));
	const formatRect = (node) => {
	    let width = getAttr(node, 'width', '0');
	    let height = getAttr(node, 'height', '0');
	    const widthExec = startWithNumber.exec(width);
	    const heightExec = startWithNumber.exec(height);
	    // 如果 width 或 height 不合规范，直接移除
	    if (!widthExec || !heightExec || +widthExec[1] <= 0 || +heightExec[1] <= 0) {
	        node.nodeName = 'remove';
	        return;
	    }
	    // 如果 rx 或 ry 存在，不能转换为 path
	    const rx = getAttr(node, 'rx', 'auto');
	    const ry = getAttr(node, 'ry', 'auto');
	    // rx 和 ry 相同，移除 ry
	    if (rx === ry || ry === 'auto') {
	        rmAttrs(node, ['ry']);
	    }
	    if (rx === 'auto') {
	        rmAttrs(node, ['rx']);
	    }
	    const rxExec = startWithNumber.exec(rx);
	    const ryExec = startWithNumber.exec(ry);
	    if (rxExec && +rxExec[1] > 0 && (!ryExec || +ryExec[1] !== 0)) {
	        return;
	    }
	    if (ryExec && +ryExec[1] > 0 && (!rxExec || +rxExec[1] !== 0)) {
	        return;
	    }
	    let x = getAttr(node, 'x', '0');
	    let y = getAttr(node, 'y', '0');
	    // 如果不是 px 单位，不能转换为 path
	    if (!pureNumOrWithPx.test(width) || !pureNumOrWithPx.test(height) || !pureNumOrWithPx.test(x) || !pureNumOrWithPx.test(y)) {
	        return;
	    }
	    rmAttrs(node, ['x', 'y', 'width', 'height', 'rx', 'ry']);
	    width = shortenNumber(+widthExec[1]);
	    height = shortenNumber(+heightExec[1]);
	    x = shortenNumber(+x.replace('px', ''));
	    y = shortenNumber(+y.replace('px', ''));
	    node.nodeName = 'path';
	    // 此处考虑到宽和高的字节数差异，应该取较小的那种
	    const hvh = shortenNumberList(`M${x},${y}h${width}v${height}h-${width}z`);
	    const vhv = shortenNumberList(`M${x},${y}v${height}h${width}v-${height}z`);
	    node.setAttribute('d', vhv.length < hvh.length ? vhv : hvh);
	};
	const formatLine = (node) => {
	    const strokeWidth = getAttr(node, 'stroke-width', '1');
	    const swExec = startWithNumber.exec(strokeWidth);
	    const animateAttrs = getAnimateAttr(node);
	    // 是否存在 marker 引用
	    const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none'
	        || getAttr(node, 'marker-mid', 'none') !== 'none'
	        || getAttr(node, 'marker-end', 'none') !== 'none'
	        || checkAnimateAttr(animateAttrs, 'marker-start', notNone)
	        || checkAnimateAttr(animateAttrs, 'marker-mid', notNone)
	        || checkAnimateAttr(animateAttrs, 'marker-end', notNone);
	    // 是否存在 stroke
	    const hasStroke = (getAttr(node, 'stroke', 'none') !== 'none' || checkAnimateAttr(animateAttrs, 'stroke', notNone)) && (strokeWidth !== '0' || checkAnimateAttr(animateAttrs, 'stroke-width', ramda.complement(ramda.equals('0'))));
	    // 如果 stroke 或 stroke-width 不合规范，直接移除
	    if (!hasMarker && (!hasStroke || !swExec || +swExec[1] <= 0)) {
	        node.nodeName = 'remove';
	        return;
	    }
	    const shapeAttr = {
	        x1: '0',
	        y1: '0',
	        x2: '0',
	        y2: '0',
	    };
	    Object.keys(shapeAttr).forEach(key => {
	        const value = node.getAttribute(key);
	        if (value && startWithNumber.test(value)) {
	            shapeAttr[key] = value;
	        }
	        node.removeAttribute(key);
	    });
	    // 是否存在 stroke-linecap
	    const hasStrokeCap = getAttr(node, 'stroke-linecap', 'butt') !== 'butt' || checkAnimateAttr(animateAttrs, 'stroke-linecap', ramda.complement(ramda.equals('butt')));
	    // 如果没有发生移动，直接移除
	    if (shapeAttr.x1 === shapeAttr.x2 && shapeAttr.y1 === shapeAttr.y2 && !hasMarker && (!hasStroke || !hasStrokeCap)) {
	        node.nodeName = 'remove';
	        return;
	    }
	    // 如果不是 px 单位，不能转换为 path
	    if (pureNumOrWithPx.test(shapeAttr.x1) && pureNumOrWithPx.test(shapeAttr.y1) && pureNumOrWithPx.test(shapeAttr.x2) && pureNumOrWithPx.test(shapeAttr.y2)) {
	        node.nodeName = 'path';
	        node.setAttribute('d', shortenNumberList(`M${+shapeAttr.x1},${+shapeAttr.y1},${+shapeAttr.x2},${+shapeAttr.y2}`));
	    }
	};
	const formatPoly = (thinning, node, addZ) => {
	    node.nodeName = 'path';
	    let d = '';
	    if (node.hasAttribute('points')) {
	        let points = execNumberList(node.getAttribute('points'));
	        const animateAttrs = getAnimateAttr(node);
	        // 是否存在 marker 引用
	        const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none'
	            || getAttr(node, 'marker-mid', 'none') !== 'none'
	            || getAttr(node, 'marker-end', 'none') !== 'none'
	            || checkAnimateAttr(animateAttrs, 'marker-start', notNone)
	            || checkAnimateAttr(animateAttrs, 'marker-mid', notNone)
	            || checkAnimateAttr(animateAttrs, 'marker-end', notNone);
	        // 是否存在 stroke
	        const hasStroke = (getAttr(node, 'stroke', 'none') !== 'none' || checkAnimateAttr(animateAttrs, 'stroke', notNone)) && (getAttr(node, 'stroke-width', '1') !== '0' || checkAnimateAttr(animateAttrs, 'stroke-width', ramda.complement(ramda.equals('0'))));
	        // 是否存在 stroke-linecap
	        const hasStrokeCap = getAttr(node, 'stroke-linecap', 'butt') !== 'butt' || checkAnimateAttr(animateAttrs, 'stroke-linecap', ramda.complement(ramda.equals('butt')));
	        if (points.length % 2 === 1) {
	            points.pop();
	        }
	        if (thinning) {
	            points = douglasPeucker(thinning, points);
	        }
	        node.removeAttribute('points');
	        // 有两个以上节点，或者具有 marker 或者是具有 stroke-linecap 的 polygon
	        if (points.length > 2 || hasMarker || (hasStroke && hasStrokeCap && addZ)) {
	            d = shortenNumberList(`M${points.map(shortenNumber).join(',')}`);
	            if (addZ) {
	                d += 'z';
	            }
	        }
	    }
	    if (d) {
	        node.setAttribute('d', d);
	    }
	    else {
	        // 没有节点或者没有 points 属性，直接移除当前 node
	        node.nodeName = 'remove';
	    }
	};
	const ellipseToCircle = (node, r) => {
	    node.nodeName = 'circle';
	    node.setAttribute('r', r.replace(numberGlobal, s => shortenNumber(+s)));
	    rmAttrs(node, ['rx', 'ry']);
	};
	const formatEllipse = (node, originNode) => {
	    let rx = getAttr(node, 'rx', 'auto');
	    let ry = getAttr(node, 'ry', 'auto');
	    if (rx === 'auto') {
	        rx = ry;
	    }
	    if (ry === 'auto') {
	        ry = rx;
	    }
	    const rxExec = startWithNumber.exec(rx);
	    const ryExec = startWithNumber.exec(ry);
	    // 如果 rx 或 ry 不合规范，直接移除
	    if (!rxExec || !ryExec || +rxExec[1] <= 0 || +ryExec[1] <= 0) {
	        node.nodeName = 'remove';
	        return;
	    }
	    if (rx === ry) {
	        ellipseToCircle(node, rx);
	    }
	};
	const formatCircle = (node, originNode) => {
	    const r = getAttr(node, 'r', '');
	    const rExec = startWithNumber.exec(r);
	    if (!rExec || +rExec[1] <= 0) {
	        node.nodeName = 'remove';
	    }
	};
	const shortenShape = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        execStyleTree(dom);
	        const { thinning, } = rule[1];
	        traversalNode(node => shapeElements.includes(node.nodeName), (node) => {
	            const cloneNode = node.cloneNode();
	            cloneNode.styles = node.styles;
	            switch (node.nodeName) {
	                case 'rect':
	                    formatRect(cloneNode);
	                    break;
	                case 'line':
	                    formatLine(cloneNode);
	                    break;
	                case 'polyline':
	                    formatPoly(thinning, cloneNode, false);
	                    break;
	                case 'polygon':
	                    formatPoly(thinning, cloneNode, true);
	                    break;
	                case 'ellipse':
	                    formatEllipse(cloneNode);
	                    break;
	                case 'circle':
	                    formatCircle(cloneNode);
	                    break;
	                default:
	                    // 路径只要判断 d 属性是否存在即可
	                    cloneNode.nodeName = node.getAttribute('d') ? 'notneed' : 'remove';
	                    break;
	            }
	            if (cloneNode.nodeName === 'remove') {
	                rmNode(node);
	            }
	            else if (cloneNode.nodeName !== node.nodeName && createTag(cloneNode).length <= createTag(node).length) {
	                Object.assign(node, cloneNode);
	            }
	        }, dom);
	    }
	    resolve();
	});

	// TODO：目前只验证了 href 和 xlink:href，其它 IRI 或 funcIRI 属性是否也需要验证？
	// 遇到引用属性，还需要递归验证被引用对象是否可应用样式
	const getXlink = (styleDefine, idStr, dom, unique, fromStyleTag) => check$2(styleDefine, getById(idStr, dom), dom, unique, fromStyleTag);
	// 定义一个特殊的遍历方法，只接收一个 condition 方法，只有该方法返回 true 才继续遍历子元素
	const traversal$2 = (condition, node) => {
	    // 此处不能用 forEach ，for 循环可以避免当前节点被移除导致下一个节点不会被遍历到的问题
	    for (const childNode of node.childNodes) {
	        if (condition(childNode) && childNode.childNodes && childNode.childNodes.length) {
	            traversal$2(condition, childNode);
	        }
	    }
	};
	const check$2 = (styleDefine, node, dom, unique, fromStyleTag) => {
	    if (!node)
	        return false;
	    // 如果是检测 style 标签的样式，则只要遇到同名的 style 属性就返回 false
	    if (fromStyleTag) {
	        for (let i = node.attributes.length; i--;) {
	            const attr = node.attributes[i];
	            if (attr.fullname === 'style') {
	                const childStyle = execStyle(attr.value);
	                if (childStyle.some(style => style.fullname === styleDefine.name)) {
	                    return false;
	                }
	            }
	        }
	    }
	    if (styleDefine.applyTo.includes(node.nodeName))
	        return true;
	    // 因为递归可能存在循环引用，所以需要排重
	    if (unique.includes(node)) {
	        return false;
	    }
	    unique.push(node);
	    let result = false;
	    if (node.hasAttribute('href')) {
	        result = getXlink(styleDefine, node.getAttribute('href'), dom, unique, false);
	    }
	    else if (node.hasAttribute('xlink:href')) {
	        result = getXlink(styleDefine, node.getAttribute('xlink:href'), dom, unique, false);
	    }
	    // 已经命中就不需要再继续了
	    if (result)
	        return true;
	    // 逻辑在判断函数里做，不在回调函数里做
	    traversal$2((childNode) => {
	        // 已经命中就不再继续
	        if (result)
	            return false;
	        // 只验证元素节点
	        if (!isTag(childNode))
	            return false;
	        // 因为递归可能存在循环引用，所以需要排重
	        if (unique.includes(childNode))
	            return false;
	        unique.push(childNode);
	        // 检查属性看是否被覆盖，是就不再继续
	        for (let i = childNode.attributes.length; i--;) {
	            const attr = childNode.attributes[i];
	            if (attr.fullname === 'style') {
	                const childStyle = execStyle(attr.value);
	                if (childStyle.some(style => style.fullname === styleDefine.name)) {
	                    return false;
	                }
	            }
	            else if (attr.fullname === styleDefine.name) {
	                return false;
	            }
	        }
	        // 通过前面的验证，并符合样式应用条件，就找到了命中的结果
	        if (styleDefine.applyTo.includes(childNode.nodeName)) {
	            result = true;
	            return false; // 已经有命中的结果就不必再遍历了
	        }
	        else { // 否则继续遍历子元素
	            // 没有命中，但具有 IRI 引用，则继续
	            if (childNode.hasAttribute('href')) {
	                if (getXlink(styleDefine, childNode.getAttribute('href'), dom, unique, fromStyleTag)) {
	                    result = true;
	                    return false;
	                }
	            }
	            else if (childNode.hasAttribute('xlink:href')) {
	                if (getXlink(styleDefine, childNode.getAttribute('xlink:href'), dom, unique, fromStyleTag)) {
	                    result = true;
	                    return false;
	                }
	            }
	            return true;
	        }
	    }, node);
	    return result;
	};
	// 深度分析，判断样式继承链上是否存在可应用对象
	const checkApply = (styleDefine, node, dom, fromStyleTag = false) => check$2(styleDefine, node, dom, [], fromStyleTag);

	/*
	 * 遍历所有的 Node 节点，并对符合条件的节点执行操作，异步版本
	 * @param { function } 条件
	 * @param { function } 回调
	 * @param { Node } 目标节点
	 */
	const traversalNodeAsync = async (condition, cb, node) => new Promise((resolve, reject) => {
	    if (node.childNodes && node.childNodes.length) {
	        const list = [];
	        for (const childNode of node.childNodes) {
	            if (condition(childNode)) {
	                list.push(new Promise(resv => {
	                    Promise.resolve().then(async () => {
	                        await cb(childNode);
	                        if (childNode.parentNode === node) {
	                            await traversalNodeAsync(condition, cb, childNode);
	                        }
	                        resv();
	                    });
	                }));
	            }
	            else {
	                list.push(new Promise(resv => {
	                    Promise.resolve().then(async () => {
	                        await traversalNodeAsync(condition, cb, childNode);
	                        resv();
	                    });
	                }));
	            }
	        }
	        Promise.all(list).then(() => {
	            resolve();
	        }, reject); // tslint:disable-line no-floating-promises
	    }
	    else {
	        resolve();
	    }
	});

	// 属性转 style 的临界值
	const styleThreshold = 4;
	const style2value$1 = ramda.pipe(stringifyStyle, shortenStyle);
	// 一些元素的某些属性不能被转为 style
	const cantTrans = (define, attrName) => define.onlyAttr && define.onlyAttr.includes(attrName);
	const checkAttr$2 = async (node, dom, rmDefault) => new Promise(resolve => {
	    execStyleTree(dom);
	    const attrObj = {}; // 存储所有样式和可以转为样式的属性
	    const tagDefine = regularTag[node.nodeName];
	    // 逆序循环，并从后向前移除属性
	    for (let i = node.attributes.length; i--;) {
	        const attr = node.attributes[i];
	        const attrDefine = regularAttr[attr.fullname];
	        if (attr.fullname === 'style') {
	            const styleObj = execStyle(attr.value);
	            const styleUnique = {};
	            // 逆序循环，因为 CSS 的优先级是从后往前覆盖的
	            for (let si = styleObj.length; si--;) {
	                const styleItem = styleObj[si];
	                const styleDefine = regularAttr[styleItem.fullname];
	                if (!styleDefine.couldBeStyle // 不能做样式
	                    ||
	                        styleUnique[styleItem.fullname] // 排重
	                    ||
	                        !checkApply(styleDefine, node, dom) // 样式继承链上不存在可应用对象
	                ) {
	                    continue;
	                }
	                // 标记一下是否存在不能和属性互转的样式
	                const onlyCss = styleDefine.cantTrans || cantTrans(tagDefine, styleItem.fullname);
	                // 如果存在同名属性，要把被覆盖的属性移除掉
	                // 之所以要判断 attrObj 是否存在 key，是为了保证只移除已遍历过的属性（此处不考虑同名属性，同名属性无法通过 xml-parser 的解析规则）
	                if (!onlyCss && ramda.has(styleItem.fullname, attrObj)) {
	                    node.removeAttribute(styleItem.fullname);
	                }
	                if (rmDefault) {
	                    // 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
	                    const parentStyle = node.parentNode.styles;
	                    if (!styleDefine.inherited || !parentStyle || !parentStyle.hasOwnProperty(styleItem.fullname)) {
	                        if (attrIsEqual(styleDefine, styleItem.value, node.nodeName)) {
	                            continue;
	                        }
	                    }
	                }
	                styleUnique[styleItem.fullname] = true;
	                attrObj[styleItem.fullname] = {
	                    value: styleItem.value,
	                    fromStyle: true,
	                    onlyCss,
	                };
	            }
	            if (styleObj.length) {
	                attr.value = style2value$1(styleObj);
	            }
	            else {
	                node.removeAttribute(attr.fullname);
	            }
	        }
	        else if (attrDefine.couldBeStyle) {
	            if (attrDefine.cantBeAttr // 有一些样式不能被设置为属性
	            ) {
	                node.removeAttribute(attr.fullname);
	                continue;
	            }
	            if (attrDefine.cantTrans || cantTrans(tagDefine, attr.fullname)) { // 有一些元素的某些属性不能被转为 style，此类属性也不宜再按照 css 属性来验证
	                continue;
	            }
	            if (rmDefault) {
	                // 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
	                const parentStyle = node.parentNode.styles;
	                if (!attrDefine.inherited || !parentStyle || !parentStyle.hasOwnProperty(attr.fullname)) {
	                    if (attrIsEqual(attrDefine, attr.value, node.nodeName)) {
	                        node.removeAttribute(attr.fullname);
	                        continue;
	                    }
	                }
	            }
	            // 如果样式无法应用到当前元素，且所有子元素都无法应用或已覆盖，则可以移除
	            if (!attrDefine.applyTo.includes(node.nodeName) && attrDefine.inherited) {
	                const subTags = node.childNodes.filter(subNode => isTag(subNode) && subNode.styles);
	                if (subTags.length && subTags.every(subTag => subTag.styles[attr.fullname].from !== 'inherit' || !checkApply(attrDefine, subTag, dom))) {
	                    node.removeAttribute(attr.fullname);
	                    continue;
	                }
	            }
	            if (attrObj.hasOwnProperty(attr.fullname) // 已被 style 属性覆盖
	                ||
	                    !checkApply(attrDefine, node, dom) // 样式继承链上不存在可应用对象
	            ) {
	                node.removeAttribute(attr.fullname);
	            }
	            else {
	                attrObj[attr.fullname] = {
	                    value: attr.value,
	                };
	            }
	        }
	        else {
	            const attributeName = node.getAttribute('attributeName') || '';
	            if (animationAttributes.includes(attr.fullname) // 动画属性 from、to、by、values
	                &&
	                    animationAttrElements.includes(node.nodeName) // 存在于动画元素上
	                &&
	                    attr.fullname !== 'values'
	                &&
	                    attributeName) {
	                const animateDefine = regularAttr[attributeName];
	                if (animateDefine.couldBeStyle) {
	                    attrObj[attributeName] = {
	                        value: attr.value,
	                        animateAttr: attr.fullname,
	                    };
	                }
	            }
	        }
	    }
	    // 	// 在此处进行样式合法性验证
	    // 	let cssString = 'g{';
	    // 	Object.entries(attrObj).forEach(([key, { value }]) => {
	    // 		cssString += `${key}:${value};
	    // `;
	    // 	});
	    // 	cssString += '}';
	    // 	// 双重合法性验证
	    // const result = await legalCss(cssString);
	    // if (!result.validity) {
	    // 	result.errors.forEach(err => {
	    // 		if (err.type === 'zero') {
	    // 			return;
	    // 		}
	    // 		const key = Object.keys(attrObj)[err.line - 1] as string | undefined;
	    // 		if (key && err.message.includes(key)) { // cssValidator 有时候会报错行数，需要确保规则对得上
	    // 			const styleItem = attrObj[key];
	    // 			const styleDefine = regularAttr[key];
	    // 			// css 验证失败，还需要进行一次 svg-slimming 的合法性验证，确保没有问题
	    // 			if (!styleDefine.legalValues.length || !legalValue(styleDefine, {
	    // 				fullname: key,
	    // 				value: styleItem.value,
	    // 				name: '',
	    // 			})) {
	    // 				styleItem.value = '';
	    // 			}
	    // 		}
	    // 	});
	    // }
	    // 只做基本验证
	    Object.keys(attrObj).forEach(key => {
	        const styleItem = attrObj[key];
	        const styleDefine = regularAttr[key];
	        if (!styleDefine.cantTrans && !legalValue(styleDefine, {
	            fullname: key,
	            value: styleItem.value,
	            name: '',
	        })) {
	            styleItem.value = '';
	        }
	    });
	    Object.entries(attrObj).forEach(([key, attrItem]) => {
	        if (attrItem.animateAttr) { // 对于动画属性，验证完合法性后就应该移除缓存
	            if (!attrItem.value) {
	                node.removeAttribute(attrItem.animateAttr);
	            }
	            delete attrObj[key]; // tslint:disable-line no-dynamic-delete
	        }
	        else {
	            if (!attrItem.value) {
	                delete attrObj[key]; // tslint:disable-line no-dynamic-delete
	                node.removeAttribute(key);
	            }
	        }
	    });
	    if (!Object.values(attrObj).some(val => val.fromStyle)) {
	        node.removeAttribute('style');
	    }
	    // 进行动画属性的合法性验证
	    resolve({
	        attrObj,
	        tagDefine,
	    });
	});
	const shortenStyleAttr = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0]) {
	        const { exchange, rmDefault } = rule[1];
	        const hasStyleTag = !!dom.styletag;
	        traversalNodeAsync(isTag, async (node) => checkAttr$2(node, dom, rmDefault).then(({ attrObj, }) => {
	            // TODO css all 属性命中后要清空样式
	            // TODO 连锁属性的判断
	            if (!hasStyleTag || exchange) {
	                // [warning] svg 的样式覆盖规则是 style 属性 > style 标签 > 属性，所以以下代码可能导致不正确的样式覆盖！
	                // 如果存在只能放在 css 中的属性，则强制属性转 style @v1.5.0+
	                if (Object.values(attrObj).some(val => val.onlyCss) || Object.keys(attrObj).length > styleThreshold) {
	                    // 属性转 style
	                    Object.entries(attrObj).forEach(([key, val]) => {
	                        if (!val.onlyCss) {
	                            node.removeAttribute(key);
	                        }
	                    });
	                    // 执行一次 reverse 把顺序反转过来
	                    node.setAttribute('style', style2value$1(Object.keys(attrObj).reverse().map(key => {
	                        return {
	                            name: key,
	                            fullname: key,
	                            value: attrObj[key].value,
	                        };
	                    })));
	                }
	                else {
	                    // style 转属性
	                    node.removeAttribute('style');
	                    // 执行一次 reverse 把顺序反转过来
	                    Object.keys(attrObj).reverse().forEach(name => {
	                        node.setAttribute(name, attrObj[name].value);
	                    });
	                }
	            }
	        }), dom).then(() => {
	            resolve();
	        });
	    }
	    else {
	        resolve();
	    }
	});

	const rmCSSNode$1 = (cssNode, plist) => {
	    const index = plist.indexOf(cssNode);
	    if (index !== -1) {
	        plist.splice(index, 1);
	    }
	};
	const shortenStyleTag = async (rule, dom) => new Promise((resolve, reject) => {
	    if (rule[0] && dom.stylesheet) {
	        const { deepShorten, rmDefault } = rule[1];
	        const cssRules = dom.stylesheet.stylesheet;
	        // 遍历 style 解析对象，取得包含 css 定义的值
	        traversalObj(ramda.propEq('type', 'declaration'), (cssNode, parents) => {
	            const attrDefine = regularAttr[cssNode.property];
	            if (!attrDefine.couldBeStyle) {
	                rmCSSNode$1(cssNode, parents[parents.length - 1]);
	            }
	            else if (rmDefault) {
	                // 仅验证只有一种默认值的情况
	                if (typeof attrDefine.initValue === 'string' && valueIsEqual(attrDefine, cssNode.value, attrDefine.initValue)) {
	                    rmCSSNode$1(cssNode, parents[parents.length - 1]);
	                }
	            }
	        }, cssRules.rules, true);
	        // TODO css all 属性命中后要清空样式
	        // TODO 连锁属性的判断
	        // TODO 直接把 style 应用到元素
	        // 深度优化
	        if (deepShorten) {
	            const selectorUnique = {};
	            const declareUnique = {};
	            for (let i = 0, l = cssRules.rules.length; i < l; i++) {
	                const styleRule = cssRules.rules[i];
	                // TODO 目前只针对顶层的规则类，其实还可以进一步优化
	                if (styleRule.type === 'rule') {
	                    const theSelectors = styleRule.selectors;
	                    const declarations = styleRule.declarations;
	                    // 记录命中对象但存在无效属性的情况
	                    const usedRule = {};
	                    // 移除无效的选择器
	                    for (let si = theSelectors.length; si--;) {
	                        const matchNodes = getBySelector(dom, execSelector(theSelectors[si]));
	                        if (!matchNodes.length) {
	                            theSelectors.splice(si, 1);
	                        }
	                        else {
	                            let anyMatch = false;
	                            for (let mi = declarations.length; mi--;) {
	                                const ruleItem = declarations[mi];
	                                const property = ruleItem.property;
	                                // 判断每一条属性与每一个命中元素的匹配情况
	                                if (matchNodes.some(matchNode => checkApply(regularAttr[property], matchNode, dom, true))) {
	                                    // 只要有一条匹配存在，就证明该选择器有效
	                                    anyMatch = true;
	                                    // 同时标记该属性有效
	                                    usedRule[property] = true;
	                                }
	                            }
	                            if (!anyMatch) {
	                                theSelectors.splice(si, 1);
	                            }
	                        }
	                    }
	                    // 验证属性的有效性，移除无效的属性
	                    for (let ci = declarations.length; ci--;) {
	                        if (!usedRule[declarations[ci].property]) {
	                            declarations.splice(ci, 1);
	                        }
	                    }
	                    // 如果选择器列表经过筛选后为空，则移除该条规则
	                    if (!theSelectors.length) {
	                        cssRules.rules.splice(i, 1);
	                        i--;
	                        l--;
	                        continue;
	                    }
	                    // 合并相同选择器
	                    theSelectors.sort((a, b) => a < b ? -1 : 1);
	                    styleRule.selectors = theSelectors.map(s => mixWhiteSpace(s.trim()));
	                    const selectorKey = styleRule.selectors.join(',');
	                    if (selectorUnique.hasOwnProperty(selectorKey)) {
	                        const uDeclarations = selectorUnique[selectorKey].declarations.concat(styleRule.declarations);
	                        // 合并之后依然要排重
	                        const declared = {};
	                        for (let j = uDeclarations.length; j--;) {
	                            if (declared[uDeclarations[j].property]) {
	                                uDeclarations.splice(j, 1);
	                            }
	                            else {
	                                declared[uDeclarations[j].property] = true;
	                            }
	                        }
	                        selectorUnique[selectorKey].declarations = uDeclarations;
	                        cssRules.rules.splice(i, 1);
	                        i--;
	                        l--;
	                        continue;
	                    }
	                    else {
	                        selectorUnique[selectorKey] = styleRule;
	                    }
	                    // 合并相同规则
	                    styleRule.declarations.sort((a, b) => a.property < b.property ? -1 : 1);
	                    const declareKey = styleRule.declarations.map((d) => `${d.property}:${d.value}`).join(';');
	                    if (declareUnique.hasOwnProperty(declareKey)) {
	                        const selectors = declareUnique[declareKey].selectors.concat(styleRule.selectors);
	                        const selected = {};
	                        for (let j = selectors.length; j--;) {
	                            if (selected[selectors[j]]) {
	                                selectors.splice(j, 1);
	                            }
	                            else {
	                                selected[selectors[j]] = true;
	                            }
	                        }
	                        declareUnique[declareKey].selectors = selectors;
	                        cssRules.rules.splice(i, 1);
	                        i--;
	                        l--;
	                        continue;
	                    }
	                    else {
	                        declareUnique[declareKey] = styleRule;
	                    }
	                }
	            }
	        }
	    }
	    resolve();
	});

	// default rules
	const rules = [
	    [true, rmUseless],
	    [true, combineStyle],
	    [true, combineScript],
	    [false, rmXMLDecl, 'rm-xml-decl'],
	    [false, rmVersion, 'rm-version'],
	    [false, rmDocType, 'rm-doctype'],
	    [false, rmComments, 'rm-comments'],
	    [false, rmIrregularTag, 'rm-irregular-tag'],
	    [false, rmIrregularNesting, 'rm-irregular-nesting'],
	    [false, rmUnnecessary, 'rm-unnecessary'],
	    [false, rmViewBox, 'rm-viewbox'],
	    [false, shortenAnimate, 'shorten-animate'],
	    [false, shortenFilter, 'shorten-filter'],
	    [false, shortenClass, 'shorten-class'],
	    [false, collapseTextwrap, 'collapse-textwrap'],
	    [false, rmHidden, 'rm-hidden'],
	    [false, shortenStyleAttr, 'shorten-style-attr'],
	    [false, rmPx, 'rm-px'],
	    [false, rmAttribute, 'rm-attribute'],
	    [false, shortenDefs, 'shorten-defs'],
	    [false, shortenID, 'shorten-id'],
	    [false, shortenShape, 'shorten-shape'],
	    [false, combinePath, 'combine-path'],
	    [false, computePath, 'compute-path'],
	    [false, collapseG, 'collapse-g'],
	    [false, combineTransform, 'combine-transform'],
	    [false, shortenDecimalDigits, 'shorten-decimal-digits'],
	    [false, shortenColor, 'shorten-color'],
	    [false, shortenStyleTag, 'shorten-style-tag'],
	    [true, combineTextNode],
	    [false, rmXMLNS, 'rm-xmlns'],
	];

	const config = {
	    // 合并 g 标签
	    'collapse-g': [true],
	    // 塌陷无意义的文本节点
	    'collapse-textwrap': [true],
	    // 合并 path 标签
	    'combine-path': [true, {
	            disregardFill: false,
	            disregardOpacity: false,
	            keyOrder: ['disregardFill', 'disregardOpacity'],
	        }],
	    // 分析并合并 transform 属性
	    'combine-transform': [true, {
	            angelDigit: DEFAULT_ACCURATE_DIGIT,
	            sizeDigit: DEFAULT_SIZE_DIGIT,
	            trifuncDigit: DEFAULT_MATRIX_DIGIT,
	            keyOrder: ['trifuncDigit', 'sizeDigit', 'angelDigit'],
	        }],
	    // 计算 path 的 d 属性，使之变得更短
	    'compute-path': [true, {
	            angelDigit: DEFAULT_ACCURATE_DIGIT,
	            sizeDigit: DEFAULT_SIZE_DIGIT,
	            straighten: 0,
	            thinning: 0,
	            keyOrder: ['removed thinning switch@v1.5.0', 'thinning', 'size', 'angelDigit', 'straighten'],
	        }],
	    // 移除非规范的属性
	    'rm-attribute': [true, {
	            keepAria: false,
	            keepEvent: false,
	            rmDefault: true,
	            keyOrder: ['rmDefault', 'keepEvent', 'keepAria'],
	        }],
	    // 移除注释
	    'rm-comments': [true],
	    // 移除 DOCTYPE 声明
	    'rm-doctype': [true],
	    // 移除隐藏对象
	    'rm-hidden': [true],
	    // 移除不规范嵌套的标签
	    'rm-irregular-nesting': [true, {
	            ignore: [],
	            keyOrder: ['ignore'],
	        }],
	    // 移除非规范的标签
	    // 配置不移除的非规范标签
	    'rm-irregular-tag': [true, {
	            ignore: [],
	            keyOrder: ['ignore'],
	        }],
	    // 移除 px 单位
	    'rm-px': [true],
	    // 移除不必要的标签
	    // 配置需要移除的标签列表
	    'rm-unnecessary': [true, {
	            tags: ['desc', 'discard', 'foreignObject', 'video', 'audio', 'iframe', 'canvas', 'metadata', 'script', 'title', 'unknown', 'image'],
	            keyOrder: ['tags'],
	        }],
	    // 移除 svg 标签的 version 属性
	    'rm-version': [true],
	    // 是否强制移除 viewBox 属性
	    'rm-viewbox': [true],
	    // 移除 xml 声明
	    'rm-xml-decl': [true],
	    // 如有必要，移除 xml 命名空间
	    'rm-xmlns': [true],
	    // 缩短动画元素
	    'shorten-animate': [true, {
	            remove: false,
	        }],
	    // 缩短 className ，并移除不被引用的 className
	    'shorten-class': [true],
	    // 缩短颜色
	    'shorten-color': [true, {
	            opacityDigit: OPACITY_DIGIT,
	            rrggbbaa: false,
	            keyOrder: ['rrggbbaa', 'opacityDigit'],
	        }],
	    // 缩短小数点后位数
	    'shorten-decimal-digits': [true, {
	            angelDigit: DEFAULT_ACCURATE_DIGIT,
	            sizeDigit: DEFAULT_SIZE_DIGIT,
	            keyOrder: ['sizeDigit', 'angelDigit'],
	        }],
	    // 合并所有的 defs ，移除无效的 defs 定义
	    'shorten-defs': [true],
	    // 移除无效的滤镜元素，移除不必要的滤镜元素属性
	    'shorten-filter': [true],
	    // 缩短 ID ，并移除不被引用的 ID
	    'shorten-id': [true],
	    // 缩短 shape 类型的节点
	    'shorten-shape': [true, {
	            thinning: 0,
	            keyOrder: ['thinning'],
	        }],
	    // 缩短 style 属性
	    'shorten-style-attr': [true, {
	            exchange: false,
	            rmDefault: true,
	            keyOrder: ['exchange'],
	        }],
	    // 缩短 style 标签的内容（合并相同规则、移除无效样式）
	    // 深度分析，移除无效选择器、合并相同的选择器、合并相同规则
	    'shorten-style-tag': [true, {
	            deepShorten: true,
	            rmDefault: true,
	            keyOrder: ['deepShorten'],
	        }],
	};

	const mergeUserVal = (v, _v) => {
	    if (Array.isArray(v)) {
	        // 数组只要字符串项
	        if (Array.isArray(_v)) {
	            return _v.filter(s => typeof s === 'string');
	        }
	    }
	    else if (typeof v === typeof _v) {
	        if (typeof _v === 'number') {
	            // 数值项要忽略 NaN、Infinity 和负数，并下取整
	            // 数值精度最多保留 8 位
	            if (_v >= 0 && _v !== Infinity) {
	                return Math.floor(_v);
	            }
	        }
	        else {
	            return _v;
	        }
	    }
	    return v;
	};
	const mergeConfig = (userConfig) => {
	    const finalConfig = {};
	    // 首先把默认规则深拷贝合并过来
	    for (const [key, val] of Object.entries(config)) {
	        finalConfig[key] = [val[0]];
	        if (val[1]) {
	            const option = { keyOrder: val[1].keyOrder };
	            for (const [k, v] of Object.entries(val[1])) {
	                option[k] = Array.isArray(v) ? v.slice() : v;
	            }
	            finalConfig[key][1] = option;
	        }
	    }
	    if (typeof userConfig === 'object' && userConfig) {
	        for (const [key, val] of Object.entries(userConfig)) {
	            // 只合并存在的值
	            if (finalConfig.hasOwnProperty(key)) {
	                const conf = finalConfig[key];
	                // 布尔值直接设置开关位置
	                if (typeof val === 'boolean') {
	                    conf[0] = val;
	                }
	                else if (Array.isArray(val) && typeof val[0] === 'boolean') {
	                    // 如果开关位置不是布尔值，后续直接抛弃处理
	                    conf[0] = val[0];
	                    // 默认配置如果没有 option 则不必再验证，如果没有打开配置项，后续也不必再验证
	                    if (conf[0] && conf[1]) {
	                        if (typeof val[1] === 'object' && val[1] && !Array.isArray(val[1])) {
	                            // 如果拿到的是 IConfigOption 类型
	                            for (const [k, v] of Object.entries(val[1])) {
	                                if (k !== 'keyOrder' && conf[1].hasOwnProperty(k)) {
	                                    conf[1][k] = mergeUserVal(conf[1][k], v);
	                                }
	                            }
	                        }
	                        else {
	                            for (const k of Object.keys(conf[1])) {
	                                if (k !== 'keyOrder') {
	                                    const index = conf[1].keyOrder.indexOf(k) + 1;
	                                    conf[1][k] = mergeUserVal(conf[1][k], val[index]);
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }
	    return finalConfig;
	};

	const exportFunc = async (data, userConfig = null) => new Promise((resolve, reject) => {
	    Parser(data).then(async (dom) => {
	        const finalConfig = mergeConfig(userConfig);
	        for (const item of rules) {
	            if (item[0]) {
	                await (item[1])(dom);
	            }
	            else {
	                await (item[1])(finalConfig[item[2]], dom);
	            }
	        }
	        resolve(createXML(dom));
	    }, reject);
	});
	exportFunc.xmlParser = Parser;
	exportFunc.NodeType = NodeType;

	return exportFunc;

})));
