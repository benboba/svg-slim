import { containerElements, gradientElements, graphicsElements, newViewportsElements, shapeElements, textContentElements } from './definitions';
import { absoluteSize, accumulateVal, additiveVal, alignmentBaseline, alignXVal, alignYVal, animateTransformType, baselineShift, blendModeVal, booleanVal, calcModelVal, channelVal, clipBox, colorInterpolation, colorKeywords, colorRendering, crossoriginVal, direction, display, dominantBaseline, durVal, edgeModeVal, feColorMatrixType, feFuncType, feTurbulenceType, fontStretch, fontStyle, fontVariant, inVal, lengthAdjustVal, linecap, linejoin, markerUnitVal, methodVal, nonzeroEvenodd, operaterVal, operaterVal1, orientVal, overflow, paintKeywords, paintOrder, playbackorderVal, pointerEvents, relativeSize, restartVal, rotateVal, shapeRendering, sideVal, spacingVal, spreadMethodVal, stitchVal, systemColor, targetVal, textAnchor, textDecoration, timelinebeginVal, unitVal, x11Colors, xmlSpaceVal, zoomAndPanVal, textOverflow, unicodeBidi, visibility, whitespace, writingMode } from './enum';
import { angelFullMatch, basicShapeFullMatch, childFuncFullMatch, clockFullMatch, colorFullMatch, controlPointsFullMatch, cssNameFullMatch, cssNameSpaceSeparatedFullMatch, cursorFullMatch, dasharrayFullMatch, filterListFullMatch, fontWeightFullMatch, funcIRIFullMatch, iccColorFullMatch, indentFullMatch, integerFullMatch, langFullMatch, lengthFullMatch, nameFullMatch, numberFullMatch, numberListFullMatch, numberOptionalFullMatch, numberSemiSepatatedFullMatch, pathFullMatch, percentageFullMatch, preservAspectRatioFullMatch, rectFullMatch, textOrientationFullMatch, timeListFullMatch, transformListFullMatch, URIFullMatch, viewBoxFullMatch, vectorEffectFullMatch } from './syntax';

const shapeAndText = shapeElements.concat(textContentElements);
const viewport = ['pattern', 'marker'].concat(newViewportsElements);
const useContainerGraphics = ['use'].concat(containerElements, graphicsElements);
const colorApply = ['animate'].concat(useContainerGraphics, gradientElements);

interface IRegularAttrDefine {
	[propName: string]: IRegularAttr;
}

// tslint:disable:max-file-line-count
const _regularAttr: IRegularAttrDefine = {
	'accumulate': {
		name: 'accumulate',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: accumulateVal
		}],
		initValue: 'none',
		applyTo: [],
	},
	'additive': {
		name: 'additive',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: additiveVal
		}],
		initValue: 'replace',
		applyTo: [],
	},
	'amplitude': {
		name: 'amplitude',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '1',
		applyTo: [],
	},
	'attributeName': {
		name: 'attributeName',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'attr'
		}],
		initValue: '',
		applyTo: [],
	},
	'azimuth': {
		name: 'azimuth',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'baseFrequency': {
		name: 'baseFrequency',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberOptionalFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'begin': {
		name: 'begin',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: timeListFullMatch
		}],
		initValue: '0s',
		applyTo: [],
	},
	'bias': {
		name: 'bias',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'by': {
		name: 'by',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'calcMode': {
		name: 'calcMode',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: calcModelVal
		}],
		initValue: '',
		applyTo: [],
	},
	'class': {
		name: 'class',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: cssNameSpaceSeparatedFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'clipPathUnits': {
		name: 'clipPathUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unitVal
		}],
		initValue: 'userSpaceOnUse',
		applyTo: [],
	},
	'crossorigin': {
		name: 'crossorigin',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: crossoriginVal
		}],
		initValue: '',
		applyTo: [],
	},
	'cx': {
		name: 'cx',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '50%',
			tag: ['radialGradient']
		}, {
			val: '0',
			tag: ['circle', 'ellipse']
		}],
		applyTo: [],
	},
	'cy': {
		name: 'cy',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '50%',
			tag: ['radialGradient']
		}, {
			val: '0',
			tag: ['circle', 'ellipse']
		}],
		applyTo: [],
	},
	'd': {
		name: 'd',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: pathFullMatch // TODO：这里用的是宽泛规则，严格正则是 pathFullMatchStrict ，但是浏览器存在纠错机制，使用严格正则可能导致意外的过滤
		}],
		initValue: '',
		applyTo: [],
	},
	'diffuseConstant': {
		name: 'diffuseConstant',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '1',
		applyTo: [],
	},
	'divisor': {
		name: 'divisor',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'download': {
		name: 'download',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'dur': {
		name: 'dur',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: clockFullMatch
		}, {
			type: 'enum',
			enum: durVal
		}],
		initValue: '',
		applyTo: [],
	},
	'dx': {
		name: 'dx',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch,
			tag: ['feOffset', 'filter']
		}, {
			type: 'reg',
			reg: lengthFullMatch,
			tag: ['tspan', 'text']
		}, {
			type: 'reg',
			reg: percentageFullMatch,
			tag: ['tspan', 'text']
		}],
		initValue: [{
			val: '2',
			tag: ['feOffset']
		}, {
			val: '0',
			tag: ['filter']
		}, {
			val: '',
			tag: ['tspan', 'text']
		}],
		applyTo: [],
	},
	'dy': {
		name: 'dy',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch,
			tag: ['feOffset', 'filter']
		}, {
			type: 'reg',
			reg: lengthFullMatch,
			tag: ['tspan', 'text']
		}, {
			type: 'reg',
			reg: percentageFullMatch,
			tag: ['tspan', 'text']
		}],
		initValue: [{
			val: '2',
			tag: ['feOffset']
		}, {
			val: '0',
			tag: ['filter']
		}, {
			val: '',
			tag: ['tspan', 'text']
		}],
		applyTo: [],
	},
	'edgeMode': {
		name: 'edgeMode',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: edgeModeVal
		}],
		initValue: [{
			val: 'duplicate',
			tag: ['feConvolveMatrix']
		}, {
			val: 'none',
			tag: ['feGaussianBlur']
		}],
		applyTo: [],
	},
	'elevation': {
		name: 'elevation',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'end': {
		name: 'end',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: timeListFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'exponent': {
		name: 'exponent',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '1',
		applyTo: [],
	},
	'filterUnits': {
		name: 'filterUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unitVal
		}],
		initValue: 'objectBoundingBox',
		applyTo: [],
	},
	'fr': {
		name: 'fr',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '0%',
		applyTo: [],
	},
	'from': {
		name: 'from',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'fx': {
		name: 'fx',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'fy': {
		name: 'fy',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'gradientTransform': {
		name: 'gradientTransform',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: transformListFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'gradientUnits': {
		name: 'gradientUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unitVal
		}],
		initValue: 'objectBoundingBox',
		applyTo: [],
	},
	'height': {
		name: 'height',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '100%',
			tag: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence']
		}, {
			val: '120%',
			tag: ['filter', 'mask']
		}, {
			val: '0',
			tag: ['pattern']
		}, {
			val: 'auto',
			tag: ['svg', 'image', 'rect', 'foreignObject']
		}],
		applyTo: [],
	},
	'href': {
		name: 'href',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: true,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: URIFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'hreflang': {
		name: 'hreflang',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: langFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'id': {
		name: 'id',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: nameFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'in': {
		name: 'in',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: inVal
		}, {
			type: 'reg',
			reg: indentFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'in2': {
		name: 'in2',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: inVal
		}, {
			type: 'reg',
			reg: indentFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'intercept': {
		name: 'intercept',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'k1': {
		name: 'k1',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'k2': {
		name: 'k2',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'k3': {
		name: 'k3',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'k4': {
		name: 'k4',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'kernelMatrix': {
		name: 'kernelMatrix',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberListFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'kernelUnitLength': {
		name: 'kernelUnitLength',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberOptionalFullMatch
		}],
		initValue: '2 2',
		applyTo: [],
	},
	'keyPoints': {
		name: 'keyPoints',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberSemiSepatatedFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'keySplines': {
		name: 'keySplines',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: controlPointsFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'keyTimes': {
		name: 'keyTimes',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberSemiSepatatedFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'lang': {
		name: 'lang',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: langFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'lengthAdjust': {
		name: 'lengthAdjust',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: lengthAdjustVal
		}],
		initValue: 'spacing',
		applyTo: [],
	},
	'limitingConeAngle': {
		name: 'limitingConeAngle',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'markerHeight': {
		name: 'markerHeight',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '3',
		applyTo: [],
	},
	'markerUnits': {
		name: 'markerUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: markerUnitVal
		}],
		initValue: 'strokeWidth',
		applyTo: [],
	},
	'markerWidth': {
		name: 'markerWidth',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '3',
		applyTo: [],
	},
	'maskContentUnits': {
		name: 'maskContentUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unitVal
		}],
		initValue: 'userSpaceOnUse',
		applyTo: [],
	},
	'maskUnits': {
		name: 'maskUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unitVal
		}],
		initValue: 'objectBoundingBox',
		applyTo: [],
	},
	'max': {
		name: 'max',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: clockFullMatch
		}, {
			type: 'string',
			string: 'media'
		}],
		initValue: '',
		applyTo: [],
	},
	'media': {
		name: 'media',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'method': {
		name: 'method',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: methodVal
		}],
		initValue: 'align',
		applyTo: [],
	},
	'min': {
		name: 'min',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: clockFullMatch
		}, {
			type: 'string',
			string: 'media'
		}],
		initValue: '0',
		applyTo: [],
	},
	'mode': {
		name: 'mode',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: blendModeVal
		}],
		initValue: 'normal',
		applyTo: [],
	},
	'numOctaves': {
		name: 'numOctaves',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: integerFullMatch
		}],
		initValue: '1',
		applyTo: [],
	},
	'offset': {
		name: 'offset',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch,
			tag: ['stop']
		}],
		initValue: '0',
		applyTo: [],
	},
	'operator': {
		name: 'operator',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: operaterVal,
			tag: ['feComposite']
		}, {
			type: 'enum',
			enum: operaterVal1,
			tag: ['feMorphology']
		}],
		initValue: [{
			val: 'over',
			tag: ['feComposite']
		}, {
			val: 'erode',
			tag: ['feMorphology']
		}],
		applyTo: [],
	},
	'order': {
		name: 'order',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberOptionalFullMatch
		}],
		initValue: '3',
		applyTo: [],
	},
	'orient': {
		name: 'orient',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'reg',
			reg: angelFullMatch
		}, {
			type: 'enum',
			enum: orientVal
		}],
		initValue: '0',
		applyTo: [],
	},
	'origin': {
		name: 'origin',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'default'
		}],
		initValue: 'default',
		applyTo: [],
	},
	'path': {
		name: 'path',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: pathFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'pathLength': {
		name: 'pathLength',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'patternContentUnits': {
		name: 'patternContentUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unitVal
		}],
		initValue: 'userSpaceOnUse',
		applyTo: [],
	},
	'patternTransform': {
		name: 'patternTransform',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: transformListFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'patternUnits': {
		name: 'patternUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unitVal
		}],
		initValue: 'objectBoundingBox',
		applyTo: [],
	},
	'playbackorder': {
		name: 'playbackorder',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: playbackorderVal
		}],
		initValue: 'all',
		applyTo: [],
	},
	'points': {
		name: 'points',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberListFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'pointsAtX': {
		name: 'pointsAtX',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'pointsAtY': {
		name: 'pointsAtY',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'pointsAtZ': {
		name: 'pointsAtZ',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'preserveAlpha': {
		name: 'preserveAlpha',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: booleanVal
		}],
		initValue: 'false',
		applyTo: [],
	},
	'preserveAspectRatio': {
		name: 'preserveAspectRatio',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: preservAspectRatioFullMatch
		}],
		initValue: 'xMidYMid meet',
		applyTo: [],
	},
	'primitiveUnits': {
		name: 'primitiveUnits',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unitVal
		}],
		initValue: 'userSpaceOnUse.',
		applyTo: [],
	},
	'r': {
		name: 'r',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '50%',
			tag: ['radialGradient']
		}, {
			val: '0',
			tag: ['circle']
		}],
		applyTo: [],
	},
	'radius': {
		name: 'radius',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberOptionalFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'refX': {
		name: 'refX',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}, {
			type: 'enum',
			enum: alignXVal
		}],
		initValue: [{
			val: '0',
			tag: ['marker']
		}],
		applyTo: [],
	},
	'refY': {
		name: 'refY',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}, {
			type: 'enum',
			enum: alignYVal
		}],
		initValue: [{
			val: '0',
			tag: ['marker']
		}],
		applyTo: [],
	},
	'rel': {
		name: 'rel',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'repeatCount': {
		name: 'repeatCount',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'string',
			string: 'indefinite'
		}],
		initValue: '',
		applyTo: [],
	},
	'repeatDur': {
		name: 'repeatDur',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: clockFullMatch
		}, {
			type: 'string',
			string: 'indefinite'
		}],
		initValue: '',
		applyTo: [],
	},
	'requiredExtensions': {
		name: 'requiredExtensions',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'restart': {
		name: 'restart',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: restartVal
		}],
		initValue: 'always',
		applyTo: [],
	},
	'result': {
		name: 'result',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: cssNameFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'rotate': {
		name: 'rotate',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'enum',
			enum: rotateVal,
			tag: ['animateMotion']
		}],
		initValue: '0',
		applyTo: [],
	},
	'rx': {
		name: 'rx',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}, {
			type: 'string',
			string: 'auto'
		}],
		initValue: 'auto',
		applyTo: [],
	},
	'ry': {
		name: 'ry',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}, {
			type: 'string',
			string: 'auto'
		}],
		initValue: 'auto',
		applyTo: [],
	},
	'scale': {
		name: 'scale',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'seed': {
		name: 'seed',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'side': {
		name: 'side',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'enum',
			enum: sideVal
		}],
		initValue: 'left',
		applyTo: [],
	},
	'slope': {
		name: 'slope',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '1',
		applyTo: [],
	},
	'spacing': {
		name: 'spacing',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: spacingVal
		}],
		initValue: 'exact',
		applyTo: [],
	},
	'specularConstant': {
		name: 'specularConstant',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '1',
		applyTo: [],
	},
	'specularExponent': {
		name: 'specularExponent',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '1',
		applyTo: [],
	},
	'spreadMethod': {
		name: 'spreadMethod',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: spreadMethodVal
		}],
		initValue: 'pad',
		applyTo: [],
	},
	'startOffset': {
		name: 'startOffset',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'stdDeviation': {
		name: 'stdDeviation',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberOptionalFullMatch
		}],
		initValue: [{
			val: '2',
			tag: ['feDropShadow']
		}, {
			val: '0',
			tag: ['feGaussianBlur']
		}],
		applyTo: [],
	},
	'stitchTiles': {
		name: 'stitchTiles',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: stitchVal
		}],
		initValue: 'noStitch',
		applyTo: [],
	},
	'style': {
		name: 'style',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'surfaceScale': {
		name: 'surfaceScale',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '1',
		applyTo: [],
	},
	'systemLanguage': {
		name: 'systemLanguage',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'tabindex': {
		name: 'tabindex',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: integerFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'tableValues': {
		name: 'tableValues',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberListFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'target': {
		name: 'target',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: nameFullMatch
		}, {
			type: 'enum',
			enum: targetVal
		}],
		initValue: '_self',
		applyTo: [],
	},
	'targetX': {
		name: 'targetX',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: integerFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'targetY': {
		name: 'targetY',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: integerFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'textLength': {
		name: 'textLength',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'timelinebegin': {
		name: 'timelinebegin',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: timelinebeginVal
		}],
		initValue: 'loadend',
		applyTo: [],
	},
	'title': {
		name: 'title',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'to': {
		name: 'to',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'transform': {
		name: 'transform',
		couldBeStyle: false, // TODO 最新规则已经放到了 properties 但此属性使用率较高，且浏览器尚未支持，故此先设置为 false
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false, // 在 combine-transform 中单独处理
		legalValues: [{
			type: 'reg',
			reg: transformListFullMatch
		}],
		initValue: '',
		applyTo: ['svg', 'g', 'symbol', 'marker', 'a', 'switch', 'use', 'foreignObject', 'unknown'].concat(graphicsElements),
	},
	'type': {
		name: 'type',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: animateTransformType,
			tag: ['animateTransform']
		}, {
			type: 'enum',
			enum: feColorMatrixType,
			tag: ['feColorMatrix']
		}, {
			type: 'enum',
			enum: feFuncType,
			tag: ['feFuncA', 'feFuncB', 'feFuncG', 'feFuncR']
		}, {
			type: 'enum',
			enum: feTurbulenceType,
			tag: ['feTurbulence']
		}],
		initValue: [{
			val: 'translate',
			tag: ['animateTransform']
		}, {
			val: 'matrix',
			tag: ['feColorMatrix']
		}, {
			val: 'identity',
			tag: ['feFuncA', 'feFuncB', 'feFuncG', 'feFuncR']
		}, {
			val: 'turbulence',
			tag: ['feTurbulence']
		}],
		applyTo: [],
	},
	'values': {
		name: 'values',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberListFullMatch,
			tag: ['feColorMatrix']
		}],
		initValue: '',
		applyTo: [],
	},
	'viewBox': {
		name: 'viewBox',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: viewBoxFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'width': {
		name: 'width',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '100%',
			tag: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence']
		}, {
			val: '120%',
			tag: ['filter', 'mask']
		}, {
			val: '0',
			tag: ['pattern']
		}, {
			val: 'auto',
			tag: ['svg', 'image', 'rect', 'foreignObject']
		}],
		applyTo: [],
	},
	'x': {
		name: 'x',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch,
			tag: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text', 'tspan']
		}, {
			type: 'reg',
			reg: percentageFullMatch,
			tag: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text', 'tspan']
		}, {
			type: 'reg',
			reg: numberFullMatch,
			tag: ['fePointLight', 'feSpotLight']
		}],
		initValue: [{
			val: '0%',
			tag: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence']
		}, {
			val: '0',
			tag: ['fePointLight', 'feSpotLight', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text']
		}, {
			val: '-10%',
			tag: ['filter', 'mask']
		}, {
			val: '',
			tag: ['tspan']
		}],
		applyTo: [],
	},
	'x1': {
		name: 'x1',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '0',
			tag: ['line']
		}, {
			val: '0%',
			tag: ['linearGradient']
		}],
		applyTo: [],
	},
	'x2': {
		name: 'x2',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '0',
			tag: ['line']
		}, {
			val: '100%',
			tag: ['linearGradient']
		}],
		applyTo: [],
	},
	'xChannelSelector': {
		name: 'xChannelSelector',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: channelVal
		}],
		initValue: 'A',
		applyTo: [],
	},
	'xlink:href': {
		name: 'xlink:href',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: true,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: URIFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'xlink:title': {
		name: 'xlink:title',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: [],
	},
	'xml:space': {
		name: 'xml:space',
		isUndef: true, // 此属性与本优化工具有冲突，没有实际意义
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: xmlSpaceVal
		}],
		initValue: 'default',
		applyTo: [],
	},
	'xmlns': {
		name: 'xmlns',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: URIFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'xmlns:xml': {
		name: 'xmlns:xml',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: URIFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'xmlns:xlink': {
		name: 'xmlns:xlink',
		couldBeStyle: false,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: URIFullMatch
		}],
		initValue: '',
		applyTo: [],
	},
	'y': {
		name: 'y',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch,
			tag: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text', 'tspan']
		}, {
			type: 'reg',
			reg: percentageFullMatch,
			tag: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'mask', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text', 'tspan']
		}, {
			type: 'reg',
			reg: numberFullMatch,
			tag: ['fePointLight', 'feSpotLight']
		}],
		initValue: [{
			val: '0%',
			tag: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence']
		}, {
			val: '0',
			tag: ['fePointLight', 'feSpotLight', 'pattern', 'svg', 'rect', 'image', 'foreignObject', 'text']
		}, {
			val: '-10%',
			tag: ['filter', 'mask']
		}, {
			val: '',
			tag: ['tspan']
		}],
		applyTo: [],
	},
	'y1': {
		name: 'y1',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '0',
			tag: ['line']
		}, {
			val: '0%',
			tag: ['linearGradient']
		}],
		applyTo: [],
	},
	'y2': {
		name: 'y2',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: [{
			val: '0',
			tag: ['line']
		}, {
			val: '0%',
			tag: ['linearGradient']
		}],
		applyTo: [],
	},
	'yChannelSelector': {
		name: 'yChannelSelector',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: channelVal
		}],
		initValue: 'A',
		applyTo: [],
	},
	'z': {
		name: 'z',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '0',
		applyTo: [],
	},
	'zoomAndPan': {
		name: 'zoomAndPan',
		couldBeStyle: false,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: zoomAndPanVal
		}],
		initValue: 'disable',
		applyTo: [],
	},

	// 下面是 property

	'alignment-baseline': {
		name: 'alignment-baseline',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: alignmentBaseline
		}],
		initValue: 'baseline',
		applyTo: ['tspan', 'textPath'],
	},
	'baseline-shift': {
		name: 'baseline-shift',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: baselineShift
		}, {
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '0',
		applyTo: ['tspan', 'textPath'],
	},
	'clip': {
		name: 'clip',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'auto'
		}, {
			type: 'reg',
			reg: rectFullMatch
		}],
		initValue: 'auto',
		applyTo: viewport,
	},
	'clip-path': {
		name: 'clip-path',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [
			{
				type: 'string',
				string: 'none'
			},
			{
				type: 'enum',
				enum: clipBox
			},
			{
				type: 'reg',
				reg: funcIRIFullMatch
			},
			{
				type: 'reg',
				reg: basicShapeFullMatch
			}
		],
		initValue: 'none',
		applyTo: useContainerGraphics,
	},
	'clip-rule': {
		name: 'clip-rule',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: nonzeroEvenodd
		}],
		initValue: 'nonzero',
		applyTo: ['use'].concat(graphicsElements),
	},
	'color': {
		name: 'color',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorKeywords
		}, {
			type: 'enum',
			enum: systemColor
		}, {
			type: 'enum',
			enum: x11Colors
		}, {
			type: 'reg',
			reg: colorFullMatch
		}],
		initValue: '',
		applyTo: ['feFlood', 'feDiffuseLighting', 'feSpecularLighting', 'stop'].concat(shapeAndText),
	},
	'color-interpolation': {
		name: 'color-interpolation',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorInterpolation
		}],
		initValue: 'sRGB',
		applyTo: colorApply,
	},
	'color-interpolation-filters': {
		name: 'color-interpolation-filters',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorInterpolation
		}],
		initValue: 'auto',
		applyTo: colorApply,
	},
	'color-rendering': {
		name: 'color-rendering',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorRendering
		}],
		initValue: 'auto',
		applyTo: colorApply,
	},
	'cursor': {
		name: 'cursor',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: cursorFullMatch
		}],
		initValue: 'auto',
		applyTo: useContainerGraphics,
	},
	'direction': {
		name: 'direction',
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: direction
		}],
		initValue: 'ltr',
		applyTo: textContentElements,
	},
	'display': {
		name: 'display',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: display
		}],
		initValue: 'inline',
		applyTo: ['svg', 'g', 'switch', 'a', 'foreignObject', 'use'].concat(graphicsElements),
	},
	'dominant-baseline': {
		name: 'dominant-baseline',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: dominantBaseline
		}],
		initValue: 'auto',
		applyTo: textContentElements,
	},
	'fill': {
		name: 'fill',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorKeywords
		}, {
			type: 'enum',
			enum: systemColor
		}, {
			type: 'enum',
			enum: x11Colors
		}, {
			type: 'reg',
			reg: colorFullMatch
		}, {
			type: 'enum',
			enum: paintKeywords
		}, {
			type: 'reg',
			reg: funcIRIFullMatch
		}, {
			type: 'reg',
			reg: childFuncFullMatch
		}],
		initValue: 'black',
		applyTo: shapeAndText,
	},
	'fill-opacity': {
		name: 'fill-opacity',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: percentageFullMatch
		}, {
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '1',
		applyTo: shapeAndText,
	},
	'fill-rule': {
		name: 'fill-rule',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: nonzeroEvenodd
		}],
		initValue: 'nonzero',
		applyTo: shapeAndText,
	},
	'filter': {
		name: 'filter',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'none'
		}, {
			type: 'reg',
			reg: filterListFullMatch
		}],
		initValue: 'none',
		applyTo: useContainerGraphics,
	},
	'flood-color': {
		name: 'flood-color',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorKeywords
		}, {
			type: 'enum',
			enum: systemColor
		}, {
			type: 'enum',
			enum: x11Colors
		}, {
			type: 'reg',
			reg: colorFullMatch
		}],
		initValue: 'black',
		applyTo: ['feFlood'],
	},
	'flood-opacity': {
		name: 'flood-opacity',
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '1',
		applyTo: ['feFlood'],
	},
	'font': {
		name: 'font',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: textContentElements,
	},
	'font-family': {
		name: 'font-family',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: textContentElements,
	},
	'font-size': {
		name: 'font-size',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}, {
			type: 'enum',
			enum: absoluteSize
		}, {
			type: 'enum',
			enum: relativeSize
		}],
		initValue: 'medium',
		applyTo: textContentElements,
	},
	'font-size-adjust': {
		name: 'font-size-adjust',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'none'
		}, {
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: 'none',
		applyTo: textContentElements,
	},
	'font-stretch': {
		name: 'font-stretch',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: fontStretch
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-style': {
		name: 'font-style',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: fontStyle
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-variant': {
		name: 'font-variant',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: fontVariant
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-weight': {
		name: 'font-weight',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: fontWeightFullMatch
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'glyph-orientation-vertical': {
		name: 'glyph-orientation-vertical',
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: textOrientationFullMatch
		}],
		initValue: 'auto',
		applyTo: textContentElements,
	},
	'image-rendering': {
		name: 'image-rendering',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorRendering
		}],
		initValue: 'auto',
		applyTo: ['image'],
	},
	'letter-spacing': {
		name: 'letter-spacing',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'normal'
		}, {
			type: 'reg',
			reg: lengthFullMatch
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'lighting-color': {
		name: 'lighting-color',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorKeywords
		}, {
			type: 'enum',
			enum: systemColor
		}, {
			type: 'enum',
			enum: x11Colors
		}, {
			type: 'reg',
			reg: colorFullMatch
		}],
		initValue: 'white',
		applyTo: ['feDiffuseLighting', 'feSpecularLighting'],
	},
	'line-height': {
		name: 'line-height',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'normal'
		}, {
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}, {
			type: 'reg',
			reg: lengthFullMatch
		}],
		initValue: 'normal',
		applyTo: ['text'],
	},
	'marker': {
		name: 'marker',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: shapeElements,
	},
	'marker-end': {
		name: 'marker-end',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'none'
		}, {
			type: 'reg',
			reg: funcIRIFullMatch
		}],
		initValue: 'none',
		applyTo: shapeElements,
	},
	'marker-mid': {
		name: 'marker-mid',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'none'
		}, {
			type: 'reg',
			reg: funcIRIFullMatch
		}],
		initValue: 'none',
		applyTo: shapeElements,
	},
	'marker-start': {
		name: 'marker-start',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'none'
		}, {
			type: 'reg',
			reg: funcIRIFullMatch
		}],
		initValue: 'none',
		applyTo: shapeElements,
	},
	'mask': {
		name: 'mask',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: useContainerGraphics,
	},
	'opacity': {
		name: 'opacity',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '1',
		applyTo: ['svg', 'g', 'symbol', 'marker', 'a', 'switch', 'use', 'unknown'].concat(graphicsElements),
	},
	'overflow': {
		name: 'overflow',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: overflow
		}],
		initValue: 'visible',
		applyTo: viewport,
	},
	'paint-order': {
		name: 'paint-order',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: paintOrder
		}],
		initValue: 'normal',
		applyTo: shapeAndText,
	},
	'pointer-events': {
		name: 'pointer-events',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: pointerEvents
		}],
		initValue: 'visiblePainted',
		applyTo: useContainerGraphics,
	},
	'shape-rendering': {
		name: 'shape-rendering',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: shapeRendering
		}],
		initValue: 'auto',
		applyTo: shapeElements,
	},
	'stop-color': {
		name: 'stop-color',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorKeywords
		}, {
			type: 'enum',
			enum: systemColor
		}, {
			type: 'enum',
			enum: x11Colors
		}, {
			type: 'reg',
			reg: colorFullMatch
		}, {
			type: 'reg',
			reg: iccColorFullMatch
		}],
		initValue: 'black',
		applyTo: ['stop'],
	},
	'stop-opacity': {
		name: 'stop-opacity',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '1',
		applyTo: ['stop'],
	},
	'stroke': {
		name: 'stroke',
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: colorKeywords
		}, {
			type: 'enum',
			enum: systemColor
		}, {
			type: 'enum',
			enum: x11Colors
		}, {
			type: 'reg',
			reg: colorFullMatch
		}, {
			type: 'enum',
			enum: paintKeywords
		}, {
			type: 'reg',
			reg: funcIRIFullMatch
		}, {
			type: 'reg',
			reg: childFuncFullMatch
		}],
		initValue: 'none',
		applyTo: shapeAndText,
	},
	'stroke-dasharray': {
		name: 'stroke-dasharray',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'none'
		}, {
			type: 'reg',
			reg: dasharrayFullMatch
		}],
		initValue: 'none',
		applyTo: shapeAndText,
	},
	'stroke-dashoffset': {
		name: 'stroke-dashoffset',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '0',
		applyTo: shapeAndText,
	},
	'stroke-linecap': {
		name: 'stroke-linecap',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: linecap
		}],
		initValue: 'butt',
		applyTo: shapeAndText,
	},
	'stroke-linejoin': {
		name: 'stroke-linejoin',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: linejoin
		}],
		initValue: 'miter',
		applyTo: shapeAndText,
	},
	'stroke-miterlimit': {
		name: 'stroke-miterlimit',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}],
		initValue: '4',
		applyTo: shapeAndText,
	},
	'stroke-opacity': {
		name: 'stroke-opacity',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '1',
		applyTo: shapeAndText,
	},
	'stroke-width': {
		name: 'stroke-width',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'reg',
			reg: numberFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: '1',
		applyTo: shapeAndText,
	},
	'text-anchor': {
		name: 'text-anchor',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: textAnchor
		}],
		initValue: 'start',
		applyTo: textContentElements,
	},
	'text-decoration': {
		name: 'text-decoration',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: textDecoration
		}],
		initValue: 'none',
		applyTo: textContentElements,
	},
	'text-overflow': {
		name: 'text-overflow',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: textOverflow
		}],
		initValue: 'auto',
		applyTo: textContentElements,
	},
	'text-rendering': {
		name: 'text-rendering',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: shapeRendering
		}],
		initValue: 'auto',
		applyTo: ['text'],
	},
	'unicode-bidi': {
		name: 'unicode-bidi',
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: unicodeBidi
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'vector-effect': {
		name: 'vector-effect',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'none'
		}, {
			type: 'reg',
			reg: vectorEffectFullMatch
		}],
		initValue: 'none',
		applyTo: ['use'].concat(graphicsElements),
	},
	'visibility': {
		name: 'visibility',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: visibility
		}],
		initValue: 'inherit',
		applyTo: ['use', 'a'].concat(graphicsElements),
	},
	'white-space': {
		name: 'white-space',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: whitespace
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'word-spacing': {
		name: 'word-spacing',
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'string',
			string: 'normal'
		}, {
			type: 'reg',
			reg: lengthFullMatch
		}, {
			type: 'reg',
			reg: percentageFullMatch
		}],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'writing-mode': {
		name: 'writing-mode',
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [{
			type: 'enum',
			enum: writingMode
		}],
		initValue: 'lr-tb',
		applyTo: ['text'],
	}
};

const undefAttr: IRegularAttr = {
	name: '',
	isUndef: true,
	couldBeStyle: false,
	animatable: false,
	maybeColor: false,
	maybeIRI: false,
	maybeFuncIRI: false,
	maybeSizeNumber: false,
	maybeAccurateNumber: false,
	legalValues: [],
	initValue: '',
	applyTo: [],
};

export interface ILegalValueItem {
	type: 'enum' | 'reg' | 'attr' | 'string';
	reg?: RegExp;
	enum?: Object;
	tag?: string[];
	string?: string;
}

export interface IRegularAttr {
	name: string;
	isUndef?: boolean;
	couldBeStyle: boolean;
	animatable: boolean;
	maybeColor: boolean;
	maybeIRI: boolean;
	maybeFuncIRI: boolean;
	maybeSizeNumber: boolean;
	maybeAccurateNumber: boolean;
	legalValues: ILegalValueItem[];
	initValue: string | {
		val: string;
		tag: string[];
	}[];
	applyTo: string[];
}

export const regularAttr = new Proxy(_regularAttr, {
	get(obj, prop: string): IRegularAttr {
		return prop in obj ? obj[prop] : undefAttr;
	}
});
