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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/slimming/config/config.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/slimming/config/config.ts":
/*!***************************************!*\
  !*** ./src/slimming/config/config.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst const_1 = __webpack_require__(/*! ../const */ \"./src/slimming/const/index.ts\");\r\nexports.config = {\r\n    // 合并 g 标签\r\n    'collapse-g': [true],\r\n    // 塌陷无意义的文本节点\r\n    'collapse-textwrap': [true],\r\n    // 合并 path 标签\r\n    'combine-path': [true, {\r\n            disregardFill: false,\r\n            disregardOpacity: false,\r\n            keyOrder: ['disregardFill', 'disregardOpacity'],\r\n        }],\r\n    // 分析并合并 transform 属性\r\n    'combine-transform': [true, {\r\n            angelDigit: const_1.DEFAULT_ACCURATE_DIGIT,\r\n            sizeDigit: const_1.DEFAULT_SIZE_DIGIT,\r\n            trifuncDigit: const_1.DEFAULT_MATRIX_DIGIT,\r\n            keyOrder: ['trifuncDigit', 'sizeDigit', 'angelDigit'],\r\n        }],\r\n    // 计算 path 的 d 属性，使之变得更短\r\n    'compute-path': [true, {\r\n            angelDigit: const_1.DEFAULT_ACCURATE_DIGIT,\r\n            sizeDigit: const_1.DEFAULT_SIZE_DIGIT,\r\n            straighten: 0,\r\n            thinning: 0,\r\n            keyOrder: ['removed thinning switch@v1.5.0', 'thinning', 'size', 'angelDigit', 'straighten'],\r\n        }],\r\n    // 移除非规范的属性\r\n    'rm-attribute': [true, {\r\n            keepAria: false,\r\n            keepEvent: false,\r\n            rmDefault: true,\r\n            keyOrder: ['rmDefault', 'keepEvent', 'keepAria'],\r\n        }],\r\n    // 移除注释\r\n    'rm-comments': [true],\r\n    // 移除 DOCTYPE 声明\r\n    'rm-doctype': [true],\r\n    // 移除隐藏对象\r\n    'rm-hidden': [true],\r\n    // 移除不规范嵌套的标签\r\n    'rm-irregular-nesting': [true, {\r\n            ignore: [],\r\n            keyOrder: ['ignore'],\r\n        }],\r\n    // 移除非规范的标签\r\n    // 配置不移除的非规范标签\r\n    'rm-irregular-tag': [true, {\r\n            ignore: [],\r\n            keyOrder: ['ignore'],\r\n        }],\r\n    // 移除 px 单位\r\n    'rm-px': [true],\r\n    // 移除不必要的标签\r\n    // 配置需要移除的标签列表\r\n    'rm-unnecessary': [true, {\r\n            tags: ['desc', 'discard', 'foreignObject', 'video', 'audio', 'iframe', 'canvas', 'metadata', 'script', 'title', 'unknown', 'image'],\r\n            keyOrder: ['tags'],\r\n        }],\r\n    // 移除 svg 标签的 version 属性\r\n    'rm-version': [true],\r\n    // 是否强制移除 viewBox 属性\r\n    'rm-viewbox': [true],\r\n    // 移除 xml 声明\r\n    'rm-xml-decl': [true],\r\n    // 如有必要，移除 xml 命名空间\r\n    'rm-xmlns': [true],\r\n    // 缩短动画元素\r\n    'shorten-animate': [true, {\r\n            remove: false,\r\n        }],\r\n    // 缩短 className ，并移除不被引用的 className\r\n    'shorten-class': [true],\r\n    // 缩短颜色\r\n    'shorten-color': [true, {\r\n            opacityDigit: const_1.OPACITY_DIGIT,\r\n            rrggbbaa: false,\r\n            keyOrder: ['rrggbbaa', 'opacityDigit'],\r\n        }],\r\n    // 缩短小数点后位数\r\n    'shorten-decimal-digits': [true, {\r\n            angelDigit: const_1.DEFAULT_ACCURATE_DIGIT,\r\n            sizeDigit: const_1.DEFAULT_SIZE_DIGIT,\r\n            keyOrder: ['sizeDigit', 'angelDigit'],\r\n        }],\r\n    // 合并所有的 defs ，移除无效的 defs 定义\r\n    'shorten-defs': [true],\r\n    // 移除无效的滤镜元素，移除不必要的滤镜元素属性\r\n    'shorten-filter': [true],\r\n    // 缩短 ID ，并移除不被引用的 ID\r\n    'shorten-id': [true],\r\n    // 缩短 shape 类型的节点\r\n    'shorten-shape': [true, {\r\n            thinning: 0,\r\n            keyOrder: ['thinning'],\r\n        }],\r\n    // 缩短 style 属性\r\n    'shorten-style-attr': [true, {\r\n            exchange: false,\r\n            rmDefault: true,\r\n            keyOrder: ['exchange'],\r\n        }],\r\n    // 缩短 style 标签的内容（合并相同规则、移除无效样式）\r\n    // 深度分析，移除无效选择器、合并相同的选择器、合并相同规则\r\n    'shorten-style-tag': [true, {\r\n            deepShorten: true,\r\n            rmDefault: true,\r\n            keyOrder: ['deepShorten'],\r\n        }],\r\n};\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/slimming/config/config.ts?");

/***/ }),

/***/ "./src/slimming/const/index.ts":
/*!*************************************!*\
  !*** ./src/slimming/const/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.FF = 255;\r\nexports.Hundred = 100;\r\nexports.Hex = 16;\r\nexports.CIRC = 360;\r\nexports.HALF_CIRC = 180;\r\nexports.GRAD = 400;\r\nexports.RAD = Math.PI * 2;\r\nexports.matrixEPos = 4;\r\nexports.HALF = 0.5;\r\nexports.APOS_RX = 0;\r\nexports.APOS_RY = 1;\r\nexports.APOS_ROTATION = 2;\r\nexports.APOS_LARGE = 3;\r\nexports.APOS_SWEEP = 4;\r\nexports.APOS_X = 5;\r\nexports.APOS_Y = 6;\r\nexports.APOS_LEN = 7;\r\nexports.OPACITY_DIGIT = 3; // 浏览器对于颜色的 alpha 值只处理到小数点后第 3 位\r\nexports.DEFAULT_SIZE_DIGIT = 2;\r\nexports.DEFAULT_ACCURATE_DIGIT = 2;\r\nexports.DEFAULT_MATRIX_DIGIT = 3;\r\n// path 直线指令\r\nexports.LineTypes = 'LlHhVv';\r\nexports.CurveTypes = 'AaCcSsQqTt';\r\n\n\n//# sourceURL=webpack://svg-slimming/./src/slimming/const/index.ts?");

/***/ })

/******/ });
});