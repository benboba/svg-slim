(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["svg-slimming"] = factory();
	else
		root["svg-slimming"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/xml-parser/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/node/index.ts":
/*!***************************!*\
  !*** ./src/node/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/*\r\n * 除了 EndTag ，其它值都来自标准：\r\n * https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType\r\n */\r\nvar NodeType;\r\n(function (NodeType) {\r\n    NodeType[NodeType[\"EndTag\"] = -1] = \"EndTag\";\r\n    NodeType[NodeType[\"Tag\"] = 1] = \"Tag\";\r\n    NodeType[NodeType[\"Text\"] = 3] = \"Text\";\r\n    NodeType[NodeType[\"CDATA\"] = 4] = \"CDATA\";\r\n    NodeType[NodeType[\"OtherSect\"] = 5] = \"OtherSect\";\r\n    NodeType[NodeType[\"OtherDecl\"] = 6] = \"OtherDecl\";\r\n    NodeType[NodeType[\"XMLDecl\"] = 7] = \"XMLDecl\";\r\n    NodeType[NodeType[\"Comments\"] = 8] = \"Comments\";\r\n    NodeType[NodeType[\"Document\"] = 9] = \"Document\";\r\n    NodeType[NodeType[\"DocType\"] = 10] = \"DocType\";\r\n})(NodeType = exports.NodeType || (exports.NodeType = {}));\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/node/index.ts?");

/***/ }),

/***/ "./src/slimming/utils/mix-white-space.ts":
/*!***********************************************!*\
  !*** ./src/slimming/utils/mix-white-space.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.mixWhiteSpace = (str) => str.replace(/\\s+/g, ' ');\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/slimming/utils/mix-white-space.ts?");

/***/ }),

/***/ "./src/xml-parser/app.ts":
/*!*******************************!*\
  !*** ./src/xml-parser/app.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar index_1 = __webpack_require__(/*! ../node/index */ \"./src/node/index.ts\");\r\nexports.NodeType = index_1.NodeType;\r\nvar parser_1 = __webpack_require__(/*! ./parser */ \"./src/xml-parser/parser.ts\");\r\nexports.parse = parser_1.Parser;\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/xml-parser/app.ts?");

/***/ }),

/***/ "./src/xml-parser/node.ts":
/*!********************************!*\
  !*** ./src/xml-parser/node.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst index_1 = __webpack_require__(/*! ../node/index */ \"./src/node/index.ts\");\r\nclass Node {\r\n    constructor(option) {\r\n        this.nodeName = option.nodeName;\r\n        this.nodeType = option.nodeType;\r\n        this.namespace = option.namespace;\r\n        this.selfClose = option.selfClose;\r\n        this.textContent = option.textContent;\r\n        if (this.nodeType === index_1.NodeType.Tag || this.nodeType === index_1.NodeType.Document) {\r\n            this._attributes = [];\r\n            this._childNodes = [];\r\n        }\r\n    }\r\n    get attributes() {\r\n        return this._attributes ? Object.freeze(this._attributes.slice()) : null;\r\n    }\r\n    get childNodes() {\r\n        return this._childNodes ? Object.freeze(this._childNodes.slice()) : null;\r\n    }\r\n    // 复制自身，但是不复制节点树关系链\r\n    cloneNode() {\r\n        const cloneNode = new Node({\r\n            nodeName: this.nodeName,\r\n            nodeType: this.nodeType,\r\n            namespace: this.namespace,\r\n            textContent: this.textContent\r\n        });\r\n        if (this._attributes) {\r\n            // 属性需要深拷贝\r\n            cloneNode._attributes = this._attributes.map(attr => {\r\n                return {\r\n                    name: attr.name,\r\n                    value: attr.value,\r\n                    fullname: attr.fullname,\r\n                    namespace: attr.namespace,\r\n                };\r\n            });\r\n        }\r\n        return cloneNode;\r\n    }\r\n    // 追加子节点\r\n    appendChild(childNode) {\r\n        if (this._childNodes) {\r\n            // 如果子节点原本有父节点，则先从原本的父节点中移除\r\n            if (childNode.parentNode && childNode.parentNode !== this) {\r\n                const pindex = childNode.parentNode.childNodes.indexOf(childNode);\r\n                if (pindex !== -1) {\r\n                    childNode.parentNode.removeChild(childNode);\r\n                }\r\n            }\r\n            // 如果已在自己的子节点列表中，则先移除再追加到末尾\r\n            const index = this._childNodes.indexOf(childNode);\r\n            if (index !== -1) {\r\n                this._childNodes.splice(index, 1);\r\n            }\r\n            this._childNodes.push(childNode);\r\n            childNode.parentNode = this;\r\n        }\r\n    }\r\n    // 插入到子节点之前\r\n    insertBefore(childNode, previousTarget) {\r\n        if (this._childNodes) {\r\n            // 首先判断目标节点是否在自己的子节点列表中\r\n            let pindex = this._childNodes.indexOf(previousTarget);\r\n            if (pindex !== -1) {\r\n                // 首先判断子节点是否在自己的子节点列表中，如果在，则先移除\r\n                const index = this._childNodes.indexOf(childNode);\r\n                if (index !== -1) {\r\n                    this._childNodes.splice(index, 1);\r\n                }\r\n                childNode.parentNode = null;\r\n            }\r\n        }\r\n    }\r\n    // 替换子节点\r\n    replaceChild(childNode, ...children) {\r\n        if (this._childNodes) {\r\n            const index = this._childNodes.indexOf(childNode);\r\n            if (index !== -1) {\r\n                this._childNodes.splice(index, 1, ...children);\r\n                childNode.parentNode = null;\r\n                children.forEach(child => {\r\n                    child.parentNode = this;\r\n                });\r\n            }\r\n        }\r\n    }\r\n    // 移除子节点\r\n    removeChild(childNode) {\r\n        if (this._childNodes) {\r\n            const index = this._childNodes.indexOf(childNode);\r\n            if (index !== -1) {\r\n                this._childNodes.splice(index, 1);\r\n                childNode.parentNode = null;\r\n            }\r\n        }\r\n    }\r\n    // 是否存在属性\r\n    hasAttribute(name, namespace) {\r\n        if (this._attributes) {\r\n            for (const attr of this._attributes) {\r\n                if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {\r\n                    return true;\r\n                }\r\n            }\r\n        }\r\n        return false;\r\n    }\r\n    getAttribute(name, namespace) {\r\n        if (this._attributes) {\r\n            for (const attr of this._attributes) {\r\n                if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {\r\n                    return attr.value;\r\n                }\r\n            }\r\n        }\r\n        return null;\r\n    }\r\n    setAttribute(name, value, namespace) {\r\n        if (this._attributes) {\r\n            for (const attr of this._attributes) {\r\n                if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {\r\n                    attr.value = value;\r\n                    return;\r\n                }\r\n            }\r\n            const newAttr = {\r\n                name,\r\n                value,\r\n                fullname: name\r\n            };\r\n            if (namespace) {\r\n                newAttr.fullname = `${namespace}:${name}`;\r\n                newAttr.namespace = namespace;\r\n            }\r\n            this._attributes.push(newAttr);\r\n        }\r\n    }\r\n    removeAttribute(name, namespace) {\r\n        if (this._attributes) {\r\n            for (let i = this._attributes.length; i--;) {\r\n                const attr = this._attributes[i];\r\n                if ((!namespace && attr.fullname === name) || (attr.name === name && attr.namespace === namespace)) {\r\n                    this._attributes.splice(i, 1);\r\n                    break;\r\n                }\r\n            }\r\n        }\r\n    }\r\n}\r\nexports.Node = Node;\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/xml-parser/node.ts?");

/***/ }),

/***/ "./src/xml-parser/parser.ts":
/*!**********************************!*\
  !*** ./src/xml-parser/parser.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst index_1 = __webpack_require__(/*! ../node/index */ \"./src/node/index.ts\");\r\nconst node_1 = __webpack_require__(/*! ./node */ \"./src/xml-parser/node.ts\");\r\nconst regs_1 = __webpack_require__(/*! ./regs */ \"./src/xml-parser/regs.ts\");\r\nexports.REG_XML_DECL = regs_1.REG_XML_DECL;\r\nexports.REG_CDATA_SECT = regs_1.REG_CDATA_SECT;\r\nexports.REG_OTHER_SECT = regs_1.REG_OTHER_SECT;\r\nexports.REG_DOCTYPE = regs_1.REG_DOCTYPE;\r\nexports.REG_OTHER_DECL = regs_1.REG_OTHER_DECL;\r\nexports.REG_COMMENTS = regs_1.REG_COMMENTS;\r\nexports.REG_START_TAG = regs_1.REG_START_TAG;\r\nexports.REG_END_TAG = regs_1.REG_END_TAG;\r\nexports.REG_ATTR = regs_1.REG_ATTR;\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/xml-parser/utils.ts\");\r\nconst mix_white_space_1 = __webpack_require__(/*! ../slimming/utils/mix-white-space */ \"./src/slimming/utils/mix-white-space.ts\");\r\nconst configs = [\r\n    [1, 'xml-decl', regs_1.REG_XML_DECL, index_1.NodeType.XMLDecl],\r\n    [1, 'cdata', regs_1.REG_CDATA_SECT, index_1.NodeType.CDATA],\r\n    [2, regs_1.REG_OTHER_SECT, index_1.NodeType.OtherSect],\r\n    [1, 'doctype', regs_1.REG_DOCTYPE, index_1.NodeType.DocType],\r\n    [2, regs_1.REG_OTHER_DECL, index_1.NodeType.OtherDecl],\r\n    [1, 'comments', regs_1.REG_COMMENTS, index_1.NodeType.Comments],\r\n];\r\nconst updStatus = (pos, str, status) => {\r\n    for (; status.lastpos < pos; status.lastpos++) {\r\n        if (str[status.lastpos] === '\\n') {\r\n            status.line++;\r\n            status.pos = 0;\r\n        }\r\n        else {\r\n            status.pos++;\r\n        }\r\n    }\r\n};\r\n// 应对一个捕获组的状况\r\nconst Process1 = (conf, str) => {\r\n    const reg = conf[2];\r\n    if (reg.test(str)) {\r\n        const execResult = reg.exec(str);\r\n        return {\r\n            node: new node_1.Node({\r\n                nodeType: conf[3],\r\n                nodeName: `#${conf[1]}`,\r\n                textContent: execResult[1]\r\n            }),\r\n            str: str.slice(execResult[0].length)\r\n        };\r\n    }\r\n    return null;\r\n};\r\n// 应对两个捕获组的状况\r\nconst Process2 = (conf, str) => {\r\n    const reg = conf[1];\r\n    if (reg.test(str)) {\r\n        const execResult = reg.exec(str);\r\n        return {\r\n            node: new node_1.Node({\r\n                nodeType: conf[2],\r\n                nodeName: `#${execResult[1].toLowerCase()}`,\r\n                textContent: execResult[2]\r\n            }),\r\n            str: str.slice(execResult[0].length)\r\n        };\r\n    }\r\n    return null;\r\n};\r\n// 处理标签\r\nconst ProcessTag = (str, status) => {\r\n    if (regs_1.REG_START_TAG.test(str)) {\r\n        const tempStatus = { line: status.line, pos: status.pos, lastpos: 0 };\r\n        const execResult = regs_1.REG_START_TAG.exec(str);\r\n        const result = {\r\n            node: new node_1.Node({\r\n                nodeType: index_1.NodeType.Tag,\r\n                nodeName: execResult[1],\r\n                namespace: '',\r\n                selfClose: execResult[3] === '/'\r\n            }),\r\n            str: str.slice(execResult[0].length)\r\n        };\r\n        // 标签的 namespace\r\n        if (execResult[1].indexOf(':') !== -1) {\r\n            const tagName = execResult[1].split(':');\r\n            if (!tagName[1]) {\r\n                throw new Error(`错误的开始标签！ 在第 ${status.line} 行第 ${status.pos} 位`);\r\n            }\r\n            else {\r\n                result.node.nodeName = tagName[1];\r\n                if (tagName[0]) {\r\n                    result.node.namespace = tagName[0];\r\n                }\r\n            }\r\n        }\r\n        updStatus(execResult[1].length + 1, execResult[0], tempStatus);\r\n        // ** 重要 ** 重置匹配位置！\r\n        regs_1.REG_ATTR.lastIndex = 0;\r\n        let attrExec = regs_1.REG_ATTR.exec(execResult[2]);\r\n        const attrUnique = {};\r\n        while (attrExec) {\r\n            updStatus(attrExec.index + execResult[1].length + 1, execResult[0], tempStatus);\r\n            // 属性名排重\r\n            if (attrUnique[attrExec[1]]) {\r\n                throw new Error(`属性名重复！ 在第 ${tempStatus.line} 行第 ${tempStatus.pos} 位`);\r\n            }\r\n            attrUnique[attrExec[1]] = true;\r\n            if (attrExec[1].indexOf(':') !== -1) {\r\n                const attrName = attrExec[1].split(':');\r\n                if (attrName[1]) {\r\n                    result.node.setAttribute(attrName[1], utils_1.collapseQuot(attrExec[2]).trim(), attrName[0]);\r\n                }\r\n                else {\r\n                    throw new Error(`错误的属性名！ 在第 ${tempStatus.line + status.line - 1} 行第 ${tempStatus.line > 1 ? tempStatus.pos : status.pos + tempStatus.pos} 位`);\r\n                }\r\n            }\r\n            else {\r\n                result.node.setAttribute(attrExec[1], utils_1.collapseQuot(attrExec[2]).trim());\r\n            }\r\n            attrExec = regs_1.REG_ATTR.exec(execResult[2]);\r\n        }\r\n        return result;\r\n    }\r\n    return null;\r\n};\r\nconst ProcessEndTag = (str, status) => {\r\n    if (regs_1.REG_END_TAG.test(str)) {\r\n        const execResult = regs_1.REG_END_TAG.exec(str);\r\n        const result = {\r\n            node: new node_1.Node({\r\n                nodeType: index_1.NodeType.EndTag,\r\n                nodeName: execResult[1],\r\n                namespace: '',\r\n            }),\r\n            str: str.slice(execResult[0].length)\r\n        };\r\n        if (execResult[1].indexOf(':') !== -1) {\r\n            const tagName = execResult[1].split(':');\r\n            if (!tagName[1]) {\r\n                throw new Error(`错误的结束标签！ 在第 ${status.line} 行第 ${status.pos} 位`);\r\n            }\r\n            else {\r\n                result.node.nodeName = tagName[1];\r\n                if (tagName[0]) {\r\n                    result.node.namespace = tagName[0];\r\n                }\r\n            }\r\n        }\r\n        return result;\r\n    }\r\n    return null;\r\n};\r\nconst parse = (str, status) => {\r\n    const startCharPos = str.indexOf('<');\r\n    if (startCharPos === 0) { // 以 < 开始的情况都按节点处理\r\n        for (const cfg of configs) {\r\n            if (cfg[0] === 1) {\r\n                const processResult1 = Process1(cfg, str);\r\n                if (processResult1) {\r\n                    return processResult1;\r\n                }\r\n            }\r\n            else {\r\n                const processResult2 = Process2(cfg, str);\r\n                if (processResult2) {\r\n                    return processResult2;\r\n                }\r\n            }\r\n        }\r\n        const processTag = ProcessTag(str, status);\r\n        if (processTag) {\r\n            return processTag;\r\n        }\r\n        const processEndTag = ProcessEndTag(str, status);\r\n        if (processEndTag) {\r\n            return processEndTag;\r\n        }\r\n        throw new Error(`解析标签失败！ 在第 ${status.line} 行第 ${status.pos} 位`);\r\n    }\r\n    else { // 非 < 开始的都按文本处理\r\n        return {\r\n            node: new node_1.Node({\r\n                nodeType: index_1.NodeType.Text,\r\n                nodeName: '#text',\r\n                textContent: mix_white_space_1.mixWhiteSpace(str.slice(0, startCharPos)),\r\n            }),\r\n            str: startCharPos === -1 ? '' : str.slice(startCharPos)\r\n        };\r\n    }\r\n};\r\nfunction Parser(str) {\r\n    return new Promise((resolve, reject) => {\r\n        const doc = new node_1.Node({\r\n            nodeType: index_1.NodeType.Document,\r\n            nodeName: '#document'\r\n        });\r\n        const stack = [];\r\n        const status = {\r\n            line: 1,\r\n            pos: 0,\r\n            lastpos: 0\r\n        };\r\n        let current;\r\n        try {\r\n            current = parse(str.slice(str.indexOf('<')), status); // 第一个 < 之前的全部字符都忽略掉\r\n        }\r\n        catch (e) {\r\n            reject(e);\r\n        }\r\n        doc.appendChild(current.node);\r\n        if (current.node.nodeType === index_1.NodeType.Tag && !current.node.selfClose) {\r\n            stack.push(current.node);\r\n        }\r\n        while (current.str) {\r\n            updStatus(str.indexOf(current.str), str, status);\r\n            try {\r\n                current = parse(current.str, status); // 第一个 < 之前的全部字符都忽略掉\r\n            }\r\n            catch (e) {\r\n                reject(e);\r\n                break;\r\n            }\r\n            const stackLen = stack.length;\r\n            if (current.node.nodeType === index_1.NodeType.EndTag) {\r\n                // 遇到结束标签的处理逻辑\r\n                if (stackLen) {\r\n                    // 结束标签和开始标签匹配\r\n                    if (stack[stackLen - 1].nodeName === current.node.nodeName && stack[stackLen - 1].namespace === current.node.namespace) {\r\n                        // 无子节点，则转为自闭合节点\r\n                        if (!stack[stackLen - 1].childNodes.length) {\r\n                            stack[stackLen - 1].selfClose = true;\r\n                        }\r\n                        stack.pop();\r\n                    }\r\n                    else {\r\n                        reject(new Error(`开始和结束标签无法匹配！ 在第 ${status.line} 行第 ${status.pos} 位`));\r\n                    }\r\n                }\r\n                else {\r\n                    // 没有开始标签而出现了结束标签\r\n                    reject(new Error(`意外的结束标签！ 在第 ${status.line} 行第 ${status.pos} 位`));\r\n                }\r\n            }\r\n            else {\r\n                if (stackLen) {\r\n                    // 插入子节点\r\n                    stack[stackLen - 1].appendChild(current.node);\r\n                }\r\n                else if (current.node.nodeType === index_1.NodeType.Text || current.node.nodeType === index_1.NodeType.CDATA) {\r\n                    // 没有节点而出现了非空文本节点\r\n                    if (current.node.textContent.replace(/\\s/g, '')) {\r\n                        reject(new Error(`意外的文本节点！ 在第 ${status.line} 行第 ${status.pos} 位`));\r\n                    }\r\n                }\r\n                else {\r\n                    // 直接扔到根下\r\n                    doc.appendChild(current.node);\r\n                }\r\n                // 遇到未闭合的节点，扔到stack内\r\n                if (current.node.nodeType === index_1.NodeType.Tag && !current.node.selfClose) {\r\n                    stack.push(current.node);\r\n                }\r\n            }\r\n            if (!current.str) {\r\n                updStatus(str.length, str, status);\r\n            }\r\n        }\r\n        if (stack.length) {\r\n            reject(new Error(`文档结构错误！ 在第 ${status.line} 行第 ${status.pos} 位`));\r\n        }\r\n        resolve(doc);\r\n    });\r\n}\r\nexports.Parser = Parser;\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/xml-parser/parser.ts?");

/***/ }),

/***/ "./src/xml-parser/regs.ts":
/*!********************************!*\
  !*** ./src/xml-parser/regs.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nlet support_unicode = true;\r\ntry {\r\n    support_unicode = /\\u{20BB7}/u.test('𠮷');\r\n}\r\ncatch (e) {\r\n    support_unicode = false;\r\n}\r\nconst NameStartChar = `:A-Z_a-z\\\\u00C0-\\\\u00D6\\\\u00D8-\\\\u00F6\\\\u00F8-\\\\u02FF\\\\u0370-\\\\u037D\\\\u037F-\\\\u1FFF\\\\u200C-\\\\u200D\\\\u2070-\\\\u218F\\\\u2C00-\\\\u2FEF\\\\u3001-\\\\uD7FF\\\\uF900-\\\\uFDCF\\\\uFDF0-\\\\uFFFD${support_unicode ? '\\\\u{10000}-\\\\u{EFFFF}' : ''}`;\r\nconst NameChar = `${NameStartChar}\\\\-\\\\.0-9\\\\u00B7\\\\u0300-\\\\u036F\\\\u203F-\\\\u2040`;\r\nconst Name = `[${NameStartChar}][${NameChar}]*`;\r\nconst Eq = '\\\\s*=\\\\s*';\r\nconst VersionNum = '1\\\\.[0-9]+';\r\nconst EncName = '[A-Za-z](?:[A-Za-z0-9\\\\._]|-)*';\r\nconst VersionInfo = `\\\\s+version${Eq}(?:'${VersionNum}'|\"${VersionNum}\")`;\r\nconst EncodingDecl = `\\\\s+encoding${Eq}(?:'${EncName}'|\"${EncName}\")`;\r\nconst SDDecl = `\\\\s+standalone${Eq}(?:'(?:yes|no)'|\"(?:yes|no)\")`;\r\nconst Reference = `(?:&${Name};|&#[0-9]+;|&#x[0-9a-fA-F]+;)`;\r\nconst AttrVal = `\"(?:[^<&\"]|${Reference})*\"|'(?:[^<&']|${Reference})*'`;\r\nconst DeclContent = `(?:[^<>]+|[^<>]*'[^']*'[^<>]*|[^<>]*\"[^\"]*\"[^<>]*|[^<>]*<[^<>]*>[^<>]*)+?`;\r\nexports.REG_XML_DECL = new RegExp(`^<\\\\?xml((?:${VersionInfo}|${EncodingDecl}|${SDDecl})*\\\\s*)\\\\?>`);\r\nexports.REG_CDATA_SECT = /^<!\\[CDATA\\[([\\d\\D]*?)\\]\\]>/;\r\nexports.REG_OTHER_SECT = /^<!\\[\\s?([A-Z]+)\\s?\\[([\\d\\D]*?)\\]\\]>/;\r\nexports.REG_DOCTYPE = new RegExp(`^<!DOCTYPE\\\\s+(${DeclContent})>`);\r\nexports.REG_OTHER_DECL = new RegExp(`^<!([A-Z]+)\\\\s+(${DeclContent})>`);\r\nexports.REG_COMMENTS = /^<!--([\\d\\D]*?)-->/;\r\nexports.REG_START_TAG = new RegExp(`^<(${Name})((?:\\\\s+${Name}${Eq}(?:${AttrVal}))*)\\\\s*(\\\\/?)>`, support_unicode ? 'u' : '');\r\nexports.REG_END_TAG = new RegExp(`^</(${Name})\\\\s*>`, support_unicode ? 'u' : '');\r\nexports.REG_ATTR = new RegExp(`(${Name})${Eq}(${AttrVal})`, support_unicode ? 'gu' : 'g');\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/xml-parser/regs.ts?");

/***/ }),

/***/ "./src/xml-parser/utils.ts":
/*!*********************************!*\
  !*** ./src/xml-parser/utils.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.collapseQuot = (str) => str.slice(1, -1);\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/xml-parser/utils.ts?");

/***/ })

/******/ });
});