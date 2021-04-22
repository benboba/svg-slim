import { IRegularAttr, TDynamicObj, TLegalValueItem } from '../../typings';
import { hasProp } from '../utils/has-prop';
import { containerElements, filterPrimitiveElements, gradientElements, graphicsElements, newViewportsElements, shapeElements, textContentElements } from './definitions';
import { absoluteSize, alignmentBaseline, alignX, alignY, animateFill, animateTransformType, baselineShift, blendMode, calcMode, capsValues, channel, clipPath, colorInterpolation, colorKeyWords, colorRendering, commonLigValues, contextualAltValues, crossOrigin, direction, discretionaryLigValues, display, dominantBaseline, dur, eastAsianVariantValues, eastAsianWidthValues, edgeMode, feColorMatrixType, feFuncType, feTurbulenceType, fontStretch, fontStyle, fontWeight, historicalLigValues, inVal, isolationMode, lengthAdjust, markerUnit, method, nonzeroEvenodd, numericFigureValues, numericFractionValues, numericSpacingValues, operater, operater1, orient, overflow, paintKeywords, pointerEvents, referrer, relativeSize, restart, shapeRendering, spreadMethod, strokeLinecap, strokeLinejoin, systemColor, target, textAnchor, textRendering, unicodeBidi, units, visibility, writingMode, writingModeCSS3, x11Colors } from './enum';
import { angelFullMatch, basicShapeFullMatch, clipPathRect, clockFullMatch, colorFullMatch, controlPointsFullMatch, cssNameFullMatch, cssNameSpaceSeparatedFullMatch, cursorFullMatch, filterListFullMatch, funcIRIFullMatch, indentFullMatch, integerFullMatch, langFullMatch, lengthFullMatch, lengthPairFullMatch, lengthPairListFullMatch, lengthPercentageFullMatch, lengthPercentageListFullMatch, mediaTypeFullMatch, nameFullMatch, nonNegativeFullMatch, numberFullMatch, numberListFullMatch, numberOptionalFullMatch, numberSemiSepatatedFullMatch, pathFullMatch, percentageFullMatch, preservAspectRatioFullMatch, stopColorFullMatch, strokeDasharrayFullMatch, timeListFullMatch, transformListFullMatch, URIFullMatch, vectorEffectFullMatch, viewBoxFullMatch } from './syntax';

const shapeAndText = shapeElements.concat(textContentElements);
const viewport = ['pattern', 'marker'].concat(newViewportsElements);
const useContainerGraphics = ['use'].concat(containerElements, graphicsElements);
const colorApply = ['animate'].concat(useContainerGraphics, gradientElements);

const colorValue: TLegalValueItem[] = [{
	type: 'reg',
	value: colorFullMatch,
}, {
	type: 'enum',
	value: systemColor,
}, {
	type: 'enum',
	value: x11Colors,
}, {
	type: 'enum',
	value: colorKeyWords,
}];

const paintValue = colorValue.concat([{
	type: 'string',
	value: 'none',
}, {
	type: 'enum',
	value: paintKeywords,
}, {
	type: 'reg',
	value: funcIRIFullMatch,
}]);

const opacityValue: TLegalValueItem[] = [{
	type: 'reg',
	value: percentageFullMatch,
}, {
	type: 'reg',
	value: numberFullMatch,
}];

const markerValue: TLegalValueItem[] = [{
	type: 'string',
	value: 'none',
}, {
	type: 'reg',
	value: funcIRIFullMatch,
}];

const _regularAttr: TDynamicObj<IRegularAttr> = {
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
			value: pathFullMatch, // 这里用的是宽泛规则，严格正则是 pathFullMatchStrict ，但是浏览器存在纠错机制，使用严格正则会导致意外的过滤，纠错机制已在 compute-path 中
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
	'isolation': { // https://www.w3.org/TR/SVG/styling.html#RequiredProperties
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
	'transform': {
		name: 'transform',
		animatable: true,
		legalValues: [{
			type: 'reg',
			value: transformListFullMatch,
		}],
		initValue: '',
		applyTo: useContainerGraphics,
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
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'reg',
			value: lengthPercentageFullMatch,
			tag: filterPrimitiveElements.concat(['filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'use']),
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
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'reg',
			value: lengthPercentageFullMatch,
			tag: filterPrimitiveElements.concat(['filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'use']),
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
		legalValues: [{
			type: 'enum',
			value: alignmentBaseline,
		}],
		initValue: 'baseline',
		applyTo: ['tspan', 'textPath'],
	},
	'baseline-shift': {
		name: 'baseline-shift',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'enum',
			value: baselineShift,
		}, {
			type: 'reg',
			value: lengthPercentageFullMatch,
		}],
		initValue: '0',
		applyTo: ['tspan', 'textPath'],
	},
	'clip': {
		name: 'clip',
		couldBeStyle: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'string',
			value: 'auto',
		}, {
			type: 'reg',
			value: clipPathRect,
		}],
		initValue: 'auto',
		applyTo: viewport,
	},
	'clip-path': {
		name: 'clip-path',
		couldBeStyle: true,
		animatable: true,
		maybeFuncIRI: true,
		legalValues: [{
			type: 'string',
			value: 'none',
		}, {
			type: 'reg',
			value: funcIRIFullMatch,
		}, {
			type: 'reg',
			value: basicShapeFullMatch,
		}, {
			type: 'enum',
			value: clipPath,
		}],
		initValue: 'none',
		applyTo: useContainerGraphics,
	},
	'clip-rule': {
		name: 'clip-rule',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: nonzeroEvenodd,
		}],
		initValue: 'nonzero',
		applyTo: ['use'].concat(graphicsElements),
	},
	'color': {
		name: 'color',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeColor: true,
		legalValues: colorValue,
		initValue: '',
		applyTo: ['feFlood', 'feDiffuseLighting', 'feSpecularLighting', 'stop'].concat(shapeAndText),
	},
	'color-interpolation': {
		name: 'color-interpolation',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: colorInterpolation,
		}],
		initValue: 'sRGB',
		applyTo: colorApply,
	},
	'color-interpolation-filters': {
		name: 'color-interpolation-filters',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: colorInterpolation,
		}],
		initValue: 'auto',
		applyTo: ['feSpotLight'].concat(filterPrimitiveElements),
	},
	'color-rendering': {
		name: 'color-rendering',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: colorRendering,
		}],
		initValue: 'auto',
		applyTo: colorApply,
	},
	'cursor': {
		name: 'cursor',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeFuncIRI: true,
		legalValues: [{
			type: 'reg',
			value: cursorFullMatch,
		}],
		initValue: 'auto',
		applyTo: useContainerGraphics,
	},
	'direction': {
		name: 'direction',
		couldBeStyle: true,
		inherited: true,
		legalValues: [{
			type: 'enum',
			value: direction,
		}],
		initValue: 'ltr',
		applyTo: textContentElements,
	},
	'display': {
		name: 'display',
		couldBeStyle: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: display,
		}],
		initValue: 'inline',
		applyTo: ['svg', 'g', 'switch', 'a', 'foreignObject', 'use'].concat(graphicsElements),
	},
	'dominant-baseline': {
		name: 'dominant-baseline',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: dominantBaseline,
		}],
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
		legalValues: paintValue.concat([{
			type: 'enum',
			value: animateFill,
			tag: ['animate', 'animateMotion', 'animateTransform', 'set'],
		}]),
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
		legalValues: opacityValue,
		initValue: '1',
		applyTo: shapeAndText,
	},
	'fill-rule': {
		name: 'fill-rule',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: nonzeroEvenodd,
		}],
		initValue: 'nonzero',
		applyTo: ['path', 'polygon', 'polyline'].concat(textContentElements),
	},
	'filter': {
		name: 'filter',
		couldBeStyle: true,
		animatable: true,
		maybeFuncIRI: true,
		legalValues: [{
			type: 'string',
			value: 'none',
		}, {
			type: 'reg',
			value: filterListFullMatch,
		}],
		initValue: 'none',
		applyTo: useContainerGraphics,
	},
	'flood-color': {
		name: 'flood-color',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		legalValues: colorValue,
		initValue: 'black',
		applyTo: ['feFlood'],
	},
	'flood-opacity': {
		name: 'flood-opacity',
		couldBeStyle: true,
		maybeAlpha: true,
		legalValues: opacityValue,
		initValue: '1',
		applyTo: ['feFlood'],
	},
	'font-family': {
		name: 'font-family',
		couldBeStyle: true,
		inherited: true,
		legalValues: [],
		initValue: '',
		applyTo: textContentElements,
	},
	'font-size': {
		name: 'font-size',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'reg',
			value: lengthPercentageFullMatch,
		}, {
			type: 'enum',
			value: absoluteSize,
		}, {
			type: 'enum',
			value: relativeSize,
		}],
		initValue: 'medium',
		applyTo: textContentElements,
	},
	'font-size-adjust': {
		name: 'font-size-adjust',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'string',
			value: 'none',
		}, {
			type: 'reg',
			value: numberFullMatch,
		}],
		initValue: 'none',
		applyTo: textContentElements,
	},
	'font-stretch': {
		name: 'font-stretch',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: fontStretch,
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-style': {
		name: 'font-style',
		couldBeStyle: true,
		inherited: true,
		legalValues: [{
			type: 'enum',
			value: fontStyle,
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-variant': {
		name: 'font-variant',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'string',
			value: 'normal',
		}, {
			type: 'string',
			value: 'none',
		}, {
			type: 'mix',
			value: {
				type: '|',
				unit: [commonLigValues, discretionaryLigValues, historicalLigValues, contextualAltValues, capsValues, numericFigureValues, numericSpacingValues, numericFractionValues, 'ordinal', 'slashed-zero', eastAsianVariantValues, eastAsianWidthValues, 'ruby', 'sub|super'],
			},
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-weight': {
		name: 'font-weight',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: fontWeight,
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'image-rendering': {
		name: 'image-rendering',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: colorRendering,
		}],
		initValue: 'auto',
		applyTo: ['image'],
	},
	'letter-spacing': {
		name: 'letter-spacing',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'string',
			value: 'normal'
		}, {
			type: 'reg',
			value: lengthFullMatch,
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'lighting-color': {
		name: 'lighting-color',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		legalValues: colorValue,
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
		legalValues: [{
			type: 'string',
			value: 'normal',
		}, {
			type: 'reg',
			value: lengthPercentageFullMatch,
		}],
		initValue: 'normal',
		applyTo: ['text'],
	},
	'marker': {
		name: 'marker',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeFuncIRI: true,
		legalValues: markerValue,
		initValue: 'none',
		applyTo: shapeElements,
	},
	'marker-end': {
		name: 'marker-end',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeFuncIRI: true,
		legalValues: markerValue,
		initValue: 'none',
		applyTo: shapeElements,
	},
	'marker-mid': {
		name: 'marker-mid',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeFuncIRI: true,
		legalValues: markerValue,
		initValue: 'none',
		applyTo: shapeElements,
	},
	'marker-start': {
		name: 'marker-start',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeFuncIRI: true,
		legalValues: markerValue,
		initValue: 'none',
		applyTo: shapeElements,
	},
	'mask': {
		name: 'mask',
		couldBeStyle: true,
		animatable: true,
		maybeFuncIRI: true,
		legalValues: [], // TODO
		initValue: 'none',
		applyTo: useContainerGraphics,
	},
	'opacity': {
		name: 'opacity',
		couldBeStyle: true,
		animatable: true,
		maybeAlpha: true,
		legalValues: opacityValue,
		initValue: '1',
		applyTo: ['svg', 'g', 'symbol', 'marker', 'a', 'switch', 'use', 'unknown'].concat(graphicsElements),
	},
	'overflow': {
		name: 'overflow',
		couldBeStyle: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: overflow,
		}],
		initValue: 'visible',
		applyTo: viewport,
	},
	'paint-order': {
		name: 'paint-order',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'string',
			value: 'normal',
		}, {
			type: 'mix',
			value: {
				type: '|',
				unit: ['fill', 'stroke', 'markers'],
			}
		}],
		initValue: 'normal',
		applyTo: shapeAndText,
	},
	'pointer-events': {
		name: 'pointer-events',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: pointerEvents,
		}],
		initValue: 'visiblePainted',
		applyTo: useContainerGraphics,
	},
	'shape-rendering': {
		name: 'shape-rendering',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: shapeRendering,
		}],
		initValue: 'auto',
		applyTo: shapeElements,
	},
	'stop-color': {
		name: 'stop-color',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		legalValues: [{
			type: 'string',
			value: 'currentColor',
		}, {
			type: 'reg',
			value: stopColorFullMatch,
		}],
		initValue: 'black',
		applyTo: ['stop'],
	},
	'stop-opacity': {
		name: 'stop-opacity',
		couldBeStyle: true,
		animatable: true,
		maybeAlpha: true,
		legalValues: opacityValue,
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
		legalValues: paintValue,
		initValue: 'none',
		applyTo: shapeAndText,
	},
	'stroke-dasharray': {
		name: 'stroke-dasharray',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'string',
			value: 'none',
		}, {
			type: 'reg',
			value: strokeDasharrayFullMatch,
		}],
		initValue: 'none',
		applyTo: shapeAndText,
	},
	'stroke-dashoffset': {
		name: 'stroke-dashoffset',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'reg',
			value: lengthPercentageFullMatch,
		}],
		initValue: '0',
		applyTo: shapeAndText,
	},
	'stroke-linecap': {
		name: 'stroke-linecap',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: strokeLinecap,
		}],
		initValue: 'butt',
		applyTo: shapeAndText,
	},
	'stroke-linejoin': {
		name: 'stroke-linejoin',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: strokeLinejoin,
		}],
		initValue: 'miter',
		applyTo: shapeAndText,
	},
	'stroke-miterlimit': {
		name: 'stroke-miterlimit',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'reg',
			value: nonNegativeFullMatch,
		}],
		initValue: '4',
		applyTo: shapeAndText,
	},
	'stroke-opacity': {
		name: 'stroke-opacity',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeAlpha: true,
		legalValues: opacityValue,
		initValue: '1',
		applyTo: shapeAndText,
	},
	'stroke-width': {
		name: 'stroke-width',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'reg',
			value: lengthPercentageFullMatch,
		}],
		initValue: '1',
		applyTo: shapeAndText,
	},
	'text-anchor': {
		name: 'text-anchor',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: textAnchor,
		}],
		initValue: 'start',
		applyTo: textContentElements,
	},
	'text-decoration': {
		name: 'text-decoration',
		couldBeStyle: true,
		animatable: true,
		legalValues: [{
			type: 'string',
			value: 'none',
		}, {
			type: 'mix',
			value: {
				type: '|',
				unit: ['underline', 'overline', 'line-through', 'blink '],
			},
		}],
		initValue: '',
		applyTo: textContentElements,
	},
	'text-rendering': {
		name: 'text-rendering',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: textRendering,
		}],
		initValue: 'auto',
		applyTo: ['text'],
	},
	'unicode-bidi': {
		name: 'unicode-bidi',
		couldBeStyle: true,
		legalValues: [{
			type: 'enum',
			value: unicodeBidi,
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'vector-effect': {
		name: 'vector-effect',
		couldBeStyle: true,
		animatable: true,
		legalValues: [{
			type: 'string',
			value: 'none',
		}, {
			type: 'reg',
			value: vectorEffectFullMatch,
		}],
		initValue: 'none',
		applyTo: ['use'].concat(graphicsElements),
	},
	'visibility': {
		name: 'visibility',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		legalValues: [{
			type: 'enum',
			value: visibility,
		}],
		initValue: 'visible',
		applyTo: ['use', 'a'].concat(graphicsElements),
	},
	// 'white-space': { // 经验证，chrome 85 下此规则在属性中无效
	// 	name: 'white-space',
	// 	couldBeStyle: true,
	// 	inherited: true,
	// 	animatable: true,
	// 	legalValues: [{
	// 		type: 'enum',
	// 		value: whiteSpace,
	// 	}],
	// 	initValue: 'normal',
	// 	applyTo: textContentElements,
	// },
	'word-spacing': {
		name: 'word-spacing',
		couldBeStyle: true,
		inherited: true,
		animatable: true,
		maybeSizeNumber: true,
		legalValues: [{
			type: 'string',
			value: 'normal',
		}, {
			type: 'reg',
			value: lengthFullMatch,
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'writing-mode': {
		name: 'writing-mode',
		couldBeStyle: true,
		inherited: true,
		legalValues: [{
			type: 'enum',
			value: writingModeCSS3,
		}, {
			type: 'enum',
			value: writingMode,
		}],
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

const undefAttr: IRegularAttr = {
	name: '',
	isUndef: true,
	legalValues: [],
	initValue: '',
	applyTo: [],
};

export const regularAttr = new Proxy(_regularAttr, {
	get(obj, prop: string): IRegularAttr {
		return hasProp(obj, prop) ? obj[prop] : undefAttr;
	},
});
