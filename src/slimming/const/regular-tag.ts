import { descriptiveElements, animationElements, paintServerElements, shapeElements, structuralElements, lightSourceElements, filterPrimitiveElements, gradientElements, textContentChildElements, conditionalProcessingAttributes, coreAttributes, deprecatedXlinkAttributes, animationAdditionAttributes, animationTimingAttributes, animationValueAttributes, rectAttributes, transferFunctionElementAttributes } from './definitions';

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
		containTextNode: false,
		legalChildElements: { childElements: baseChildren },
		ownAttributes: ['attributeName'].concat(animateAttributes),
	},
	'animateMotion': {
		containTextNode: false,
		legalChildElements: { childElements: ['mpath'].concat(baseChildren) },
		ownAttributes: ['path', 'keyPoints', 'rotate', 'origin'].concat(animateAttributes),
	},
	'animateTransform': {
		containTextNode: false,
		legalChildElements: { childElements: baseChildren },
		ownAttributes: ['attributeName', 'type'].concat(animateAttributes),
	},
	'audio': {
		containTextNode: false,
		legalChildElements: { childElements: [] },
		ownAttributes: [],
	},
	'canvas': {
		containTextNode: false,
		legalChildElements: { childElements: [] },
		ownAttributes: [],
	},
	'circle': {
		containTextNode: false,
		legalChildElements: { childElements: shapeChildren },
		ownAttributes: ['cx', 'cy', 'r'].concat(shapeAttributes),
	},
	'clipPath': {
		containTextNode: false,
		legalChildElements: { childElements: ['text', 'use'].concat(baseChildren, animationElements, shapeElements) },
		ownAttributes: ['externalResourcesRequired', 'transform', 'clipPathUnits'].concat(conditionAndCore)
	},
	'defs': {
		containTextNode: false,
		legalChildElements: { childElements: globalChildren },
		ownAttributes: coreAttributes,
	},
	'desc': {
		containTextNode: true,
		legalChildElements: { any: true, childElements: [] },
		ownAttributes: coreAttributes,
	},
	'discard': {
		containTextNode: false,
		legalChildElements: { childElements: baseChildren },
		ownAttributes: ['begin', 'href'].concat(conditionAndCore),
	},
	'ellipse': {
		containTextNode: false,
		legalChildElements: { childElements: shapeChildren },
		ownAttributes: ['cx', 'cy', 'rx', 'ry'].concat(shapeAttributes),
	},
	'feBlend': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in', 'in2', 'mode'].concat(feAttributes),
	},
	'feColorMatrix': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in', 'type', 'values'].concat(feAttributes),
	},
	'feComponentTransfer': {
		containTextNode: false,
		legalChildElements: { childElements: ['feFuncR', 'feFuncG', 'feFuncB', 'feFuncA'].concat(baseChildren) },
		ownAttributes: ['in'].concat(feAttributes),
	},
	'feComposite': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in', 'in2', 'operator', 'k1', 'k2', 'k3', 'k4'].concat(feAttributes),
	},
	'feConvolveMatrix': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in', 'order', 'kernelMatrix', 'divisor', 'bias', 'targetX', 'targetY', 'edgeMode', 'kernelUnitLength', 'preserveAlpha'].concat(feAttributes),
	},
	'feDiffuseLighting': {
		containTextNode: false,
		legalChildElements: { childElements: baseChildren.concat(lightSourceElements) },
		ownAttributes: ['in', 'surfaceScale', 'diffuseConstant', 'kernelUnitLength'].concat(feAttributes),
	},
	'feDisplacementMap': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in', 'in2', 'scale', 'xChannelSelector', 'yChannelSelector'].concat(feAttributes),
	},
	'feDistantLight': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['azimuth', 'elevation'].concat(coreAttributes),
	},
	'feFlood': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: feAttributes,
	},
	'feFuncA': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: feFuncAttributes,
	},
	'feFuncB': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: feFuncAttributes,
	},
	'feFuncG': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: feFuncAttributes,
	},
	'feFuncR': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: feFuncAttributes,
	},
	'feGaussianBlur': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in', 'stdDeviation', 'edgeMode'].concat(feAttributes),
	},
	'feImage': {
		containTextNode: false,
		legalChildElements: { childElements: ['animate', 'animateTransform', 'set'].concat(baseChildren) },
		ownAttributes: ['externalResourcesRequired', 'preserveAspectRatio', 'xlink:href', 'href', 'crossorigin'].concat(feAttributes),
	},
	'feMerge': {
		containTextNode: false,
		legalChildElements: { childElements: ['feMergeNode'].concat(baseChildren) },
		ownAttributes: feAttributes,
	},
	'feMergeNode': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in'].concat(coreAttributes),
	},
	'feMorphology': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in', 'operator', 'radius'].concat(feAttributes),
	},
	'feOffset': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in', 'dx', 'dy'].concat(feAttributes),
	},
	'fePointLight': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['x', 'y', 'z'].concat(coreAttributes),
	},
	'feSpecularLighting': {
		containTextNode: false,
		legalChildElements: { childElements: baseChildren.concat(lightSourceElements) },
		ownAttributes: ['in', 'surfaceScale', 'specularConstant', 'specularExponent', 'kernelUnitLength'].concat(feAttributes),
	},
	'feSpotLight': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['x', 'y', 'z'].concat(coreAttributes),
	},
	'feTile': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['in'].concat(feAttributes),
	},
	'feTurbulence': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren },
		ownAttributes: ['baseFrequency', 'numOctaves', 'seed', 'stitchTiles', 'type'].concat(feAttributes),
	},
	'filter': {
		containTextNode: false,
		legalChildElements: { childElements: feChildren.concat(filterPrimitiveElements) },
		ownAttributes: ['externalResourcesRequired', 'filterUnits', 'primitiveUnits'].concat(coreAttributes, rectAttributes),
	},
	'foreignObject': {
		containTextNode: false,
		legalChildElements: { any: true, childElements: [] },
		ownAttributes: rectAttributes.concat(conditionAndCore),
	},
	'g': {
		containTextNode: false,
		legalChildElements: { childElements: globalChildren },
		ownAttributes: conditionAndCore,
	},
	'iframe': {
		containTextNode: false,
		legalChildElements: { childElements: [] },
		ownAttributes: [],
	},
	'image': {
		containTextNode: false,
		legalChildElements: { childElements: ['clipPath', 'mask', 'style'].concat(animationElements, baseChildren) },
		ownAttributes: ['preserveAspectRatio', 'href', 'crossorigin'].concat(conditionAndCore, deprecatedXlinkAttributes, rectAttributes),
	},
	'line': {
		containTextNode: false,
		legalChildElements: { childElements: shapeChildren },
		ownAttributes: ['x1', 'y1', 'x2', 'y2'].concat(shapeAttributes),
	},
	'linearGradient': {
		containTextNode: false,
		legalChildElements: { childElements: gradientChildren },
		ownAttributes: ['x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'href'].concat(coreAttributes, deprecatedXlinkAttributes),
	},
	'marker': {
		containTextNode: false,
		legalChildElements: { childElements: globalChildren },
		ownAttributes: ['viewBox', 'preserveAspectRatio', 'refX', 'refY', 'markerUnits', 'markerWidth', 'markerHeight', 'orient'].concat(coreAttributes),
	},
	'mask': {
		containTextNode: false,
		legalChildElements: { childElements: ['a', 'clipPath', 'cursor', 'filter', 'foreignObject', 'image', 'marker', 'mask', 'pattern', 'style', 'switch', 'view', 'text'].concat(animationElements, baseChildren, shapeElements, structuralElements, gradientElements) },
		ownAttributes: ['maskUnits', 'maskContentUnits'].concat(rectAttributes, conditionAndCore),
	},
	'metadata': {
		containTextNode: true,
		legalChildElements: { any: true, childElements: [] },
		ownAttributes: coreAttributes,
	},
	'mpath': {
		containTextNode: false,
		legalChildElements: { childElements: baseChildren },
		ownAttributes: ['href'].concat(coreAttributes),
	},
	'path': {
		containTextNode: false,
		legalChildElements: { childElements: shapeChildren },
		ownAttributes: ['d'].concat(shapeAttributes),
	},
	'pattern': {
		containTextNode: false,
		legalChildElements: { childElements: globalChildren },
		ownAttributes: ['viewBox', 'preserveAspectRatio', 'patternUnits', 'patternContentUnits', 'patternTransform', 'href'].concat(coreAttributes, deprecatedXlinkAttributes, rectAttributes),
	},
	'polygon': {
		containTextNode: false,
		legalChildElements: { childElements: shapeChildren },
		ownAttributes: ['points'].concat(shapeAttributes),
	},
	'polyline': {
		containTextNode: false,
		legalChildElements: { childElements: shapeChildren },
		ownAttributes: ['points'].concat(shapeAttributes),
	},
	'radialGradient': {
		containTextNode: false,
		legalChildElements: { childElements: gradientChildren },
		ownAttributes: ['cx', 'cy', 'r', 'fx', 'fy', 'fr', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'href'].concat(coreAttributes, deprecatedXlinkAttributes),
	},
	'rect': {
		containTextNode: false,
		legalChildElements: { childElements: shapeChildren },
		ownAttributes: ['rx', 'ry'].concat(rectAttributes, shapeAttributes),
	},
	'script': {
		containTextNode: true,
		legalChildElements: { childElements: [] },
		ownAttributes: ['type', 'href', 'crossorigin'].concat(coreAttributes, deprecatedXlinkAttributes),
	},
	'set': {
		containTextNode: false,
		legalChildElements: { childElements: baseChildren },
		ownAttributes: ['to', 'attributeName'].concat(conditionAndCore, animationTimingAttributes),
	},
	'stop': {
		containTextNode: false,
		legalChildElements: { childElements: ['animate', 'script', 'set', 'style'] },
		ownAttributes: ['path', 'offset'].concat(coreAttributes),
	},
	'style': {
		containTextNode: true,
		legalChildElements: { childElements: [] },
		ownAttributes: ['type', 'media', 'title'].concat(coreAttributes),
	},
	'svg': {
		containTextNode: false,
		legalChildElements: { childElements: globalChildren },
		ownAttributes: ['viewBox', 'preserveAspectRatio', 'zoomAndPan', 'transform'].concat(conditionAndCore, rectAttributes),
	},
	'switch': {
		containTextNode: false,
		legalChildElements: { childElements: ['a', 'audio', 'canvas', 'foreignObject', 'g', 'iframe', 'image', 'svg', 'switch', 'text', 'use', 'video'].concat(animationElements, shapeElements) },
		ownAttributes: conditionAndCore,
	},
	'symbol': {
		containTextNode: false,
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
		containTextNode: false,
		legalChildElements: { any: true, childElements: [] },
		ownAttributes: conditionAndCore,
	},
	'use': {
		containTextNode: false,
		legalChildElements: { childElements: ['clipPath', 'mask', 'style'].concat(animationElements, baseChildren) },
		ownAttributes: ['href'].concat(rectAttributes, conditionAndCore, deprecatedXlinkAttributes),
	},
	'video': {
		containTextNode: false,
		legalChildElements: { childElements: [] },
		ownAttributes: [],
	},
	'view': {
		containTextNode: false,
		legalChildElements: { childElements: ['style'].concat(animationElements, baseChildren) },
		ownAttributes: ['viewBox', 'preserveAspectRatio', 'zoomAndPan'].concat(coreAttributes),
	},
};

const undefTag: IRegularTag = {
	isUndef: true,
	containTextNode: false,
	legalChildElements: {},
	ownAttributes: [],
};

export interface IRegularTag {
	isUndef?: boolean;
	containTextNode: boolean;
	legalChildElements: { transparent?: boolean; noself?: boolean; any?: boolean; childElements?: string[] };
	ownAttributes: string[];
}

export const regularTag = new Proxy(_regularTag, {
	get(obj, prop: string): IRegularTag {
		return prop in obj ? obj[prop] : undefTag;
	}
});
