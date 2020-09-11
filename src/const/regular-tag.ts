import { IRegularTag } from '../../typings';
import { animationAdditionAttributes, animationElements, animationTimingAttributes, animationValueAttributes, conditionalProcessingAttributes, coreAttributes, deprecatedXlinkAttributes, descriptiveElements, filterPrimitiveElements, gradientElements, lightSourceElements, paintServerElements, rectAttributes, shapeElements, structuralElements, textContentChildElements, transferFunctionElementAttributes, transferFunctionElements } from './definitions';

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

interface IRegularTagDefine {
	[propName: string]: IRegularTag;
}

// tag define
const _regularTag: IRegularTagDefine = {
	'a': {
		containTextNode: true,
		legalChildElements: { transparent: true, noself: true, childElements: [] },
		ownAttributes: ['href', 'target', 'download', 'rel', 'hreflang', 'type'].concat(conditionAndCore, deprecatedXlinkAttributes),
	},
	'animate': {
		legalChildElements: { childElements: baseChildren },
		ownAttributes: ['attributeName'].concat(animateAttributes),
		onlyAttr: ['fill'], // 动画元素的 fill 属性有另外的含义
	},
	'animateMotion': {
		legalChildElements: { childElements: ['mpath'].concat(baseChildren) },
		ownAttributes: ['path', 'keyPoints', 'rotate', 'origin'].concat(animateAttributes),
		onlyAttr: ['fill'], // 动画元素的 fill 属性有另外的含义
	},
	'animateTransform': {
		legalChildElements: { childElements: baseChildren },
		ownAttributes: ['attributeName', 'type'].concat(animateAttributes),
		onlyAttr: ['fill'], // 动画元素的 fill 属性有另外的含义
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
		onlyAttr: ['fill'], // 动画元素的 fill 属性有另外的含义
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
		onlyAttr: ['width', 'height'], // 根元素的尺寸属性转 style 的话，在 css 中应用会导致尺寸问题
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

const undefTag: IRegularTag = {
	isUndef: true,
	legalChildElements: {},
	ownAttributes: [],
};

export const regularTag = new Proxy(_regularTag, {
	get(obj, prop: string) {
		return prop in obj ? obj[prop] : undefTag as IRegularTag;
	},
});
