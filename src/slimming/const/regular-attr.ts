import { containerElements, gradientElements, graphicsElements, newViewportsElements, shapeElements, textContentElements } from './definitions';
import { accumulateVal, additiveVal, alignXVal, alignYVal, blendModeVal, booleanVal, calcModelVal, crossoriginVal, durVal, edgeModeVal, inVal, lengthAdjustVal, markerUnitVal, methodVal, operaterVal, operaterVal1, orientVal, playbackorderVal, restartVal, rotateVal, sideVal, spacingVal, spreadMethodVal, stitchVal, targetVal, timelinebeginVal, unitVal, animateTransformType, feColorMatrixType, feFuncType, feTurbulenceType, channelVal, xmlSpaceVal, zoomAndPanVal } from './enum';
import { angelFullMatch, clockFullMatch, controlPointsFullMatch, cssNameFullMatch, cssNameSpaceSeparatedFullMatch, indentFullMatch, integerFullMatch, langFullMatch, lengthFullMatch, nameFullMatch, numberFullMatch, numberListFullMatch, numberOptionalFullMatch, numberSemiSepatatedFullMatch, pathFullMatch, percentageFullMatch, preservAspectRatioFullMatch, timeListFullMatch, transformListFullMatch, URIFullMatch, viewBoxFullMatch } from './syntax';

const shapeAndText = shapeElements.concat(textContentElements);
const viewport = ['pattern', 'marker'].concat(newViewportsElements);
const useContainerGraphics = ['use'].concat(containerElements, graphicsElements);
const colorApply = ['animate'].concat(useContainerGraphics, gradientElements);

interface IRegularAttrDefine {
	[propName: string]: IRegularAttr;
}

const regular_attr: IRegularAttrDefine = {
	accumulate: {
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
	additive: {
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
	amplitude: {
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
	attributeName: {
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
	azimuth: {
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
	baseFrequency: {
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
	begin: {
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
	bias: {
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
	by: {
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
	calcMode: {
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
	class: {
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
	clipPathUnits: {
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
	crossorigin: {
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
	cx: {
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
	cy: {
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
	d: {
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
	diffuseConstant: {
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
	divisor: {
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
	download: {
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
	dur: {
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
	dx: {
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
	dy: {
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
	edgeMode: {
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
	elevation: {
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
	end: {
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
	exponent: {
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
	filterUnits: {
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
	fr: {
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
	from: {
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
	fx: {
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
	fy: {
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
	gradientTransform: {
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
	gradientUnits: {
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
	height: {
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
	href: {
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
	hreflang: {
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
	id: {
		couldBeStyle: false,
		animatable: false,
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
	in: {
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
	in2: {
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
	intercept: {
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
	k1: {
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
	k2: {
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
	k3: {
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
	k4: {
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
	kernelMatrix: {
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
	kernelUnitLength: {
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
	keyPoints: {
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
	keySplines: {
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
	keyTimes: {
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
	lang: {
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
	lengthAdjust: {
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
	limitingConeAngle: {
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
	markerHeight: {
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
	markerUnits: {
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
	markerWidth: {
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
	maskContentUnits: {
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
	maskUnits: {
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
	max: {
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
	media: {
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
	method: {
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
	min: {
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
	mode: {
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
	numOctaves: {
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
	offset: {
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
	operator: {
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
	order: {
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
	orient: {
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
	origin: {
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
	path: {
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
	pathLength: {
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
	patternContentUnits: {
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
	patternTransform: {
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
	patternUnits: {
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
	playbackorder: {
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
	points: {
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
	pointsAtX: {
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
	pointsAtY: {
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
	pointsAtZ: {
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
	preserveAlpha: {
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
	preserveAspectRatio: {
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
	primitiveUnits: {
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
	r: {
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
	radius: {
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
	refX: {
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
	refY: {
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
	rel: {
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
	repeatCount: {
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
	repeatDur: {
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
	requiredExtensions: {
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
	restart: {
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
	result: {
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
	rotate: {
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
	rx: {
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
	ry: {
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
	scale: {
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
	seed: {
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
	side: {
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
	slope: {
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
	spacing: {
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
	specularConstant: {
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
	specularExponent: {
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
	spreadMethod: {
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
	startOffset: {
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
	stdDeviation: {
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
	stitchTiles: {
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
	style: {
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
	surfaceScale: {
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
	systemLanguage: {
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
	tabindex: {
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
	tableValues: {
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
	target: {
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
	targetX: {
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
	targetY: {
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
	textLength: {
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
	timelinebegin: {
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
	title: {
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
	to: {
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
	transform: {
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
	type: {
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
	values: {
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
	viewBox: {
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
	width: {
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
	x: {
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
	x1: {
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
	x2: {
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
	xChannelSelector: {
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
	y: {
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
	y1: {
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
	y2: {
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
	yChannelSelector: {
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
	z: {
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
	zoomAndPan: {
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
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: ['tspan', 'textPath'],
	},
	'baseline-shift': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'baseline',
		applyTo: ['tspan', 'textPath'],
	},
	clip: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'auto',
		applyTo: viewport,
	},
	'clip-path': {
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
	'clip-rule': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'nonzero',
		applyTo: ['use'].concat(graphicsElements),
	},
	color: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: ['feFlood', 'feDiffuseLighting', 'feSpecularLighting', 'stop'].concat(shapeAndText),
	},
	'color-interpolation': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'sRGB',
		applyTo: colorApply,
	},
	'color-rendering': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'auto',
		applyTo: colorApply,
	},
	cursor: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'auto',
		applyTo: useContainerGraphics,
	},
	direction: {
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'ltr',
		applyTo: textContentElements,
	},
	display: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'inline',
		applyTo: ['svg', 'g', 'switch', 'a', 'foreignObject', 'use'].concat(graphicsElements),
	},
	'dominant-baseline': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'auto',
		applyTo: textContentElements,
	},
	fill: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '#000',
		applyTo: shapeAndText,
	},
	'fill-opacity': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [],
		initValue: '1',
		applyTo: shapeAndText,
	},
	'fill-rule': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'nonzero',
		applyTo: shapeAndText,
	},
	filter: {
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
	'flood-color': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '#000',
		applyTo: ['feFlood'],
	},
	'flood-opacity': {
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [],
		initValue: '',
		applyTo: ['feFlood'],
	},
	font: {
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
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'medium',
		applyTo: textContentElements,
	},
	'font-size-adjust': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: textContentElements,
	},
	'font-stretch': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-style': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-variant': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'font-weight': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'glyph-orientation-vertical': {
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [],
		initValue: 'auto',
		applyTo: textContentElements,
	},
	'image-rendering': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'auto',
		applyTo: ['image'],
	},
	'letter-spacing': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'lighting-color': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '#fff',
		applyTo: ['feDiffuseLighting', 'feSpecularLighting'],
	},
	'line-height': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: ['text'],
	},
	marker: {
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
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: shapeElements,
	},
	'marker-mid': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: shapeElements,
	},
	'marker-start': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: shapeElements,
	},
	mask: {
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
	opacity: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [],
		initValue: '1',
		applyTo: ['svg', 'g', 'symbol', 'marker', 'a', 'switch', 'use', 'unknown'].concat(graphicsElements),
	},
	overflow: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '',
		applyTo: viewport,
	},
	'paint-order': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: shapeAndText,
	},
	'pointer-events': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'visiblePainted',
		applyTo: useContainerGraphics,
	},
	'shape-rendering': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'auto',
		applyTo: shapeElements,
	},
	'stop-color': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '#000',
		applyTo: ['stop'],
	},
	'stop-opacity': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [],
		initValue: '1',
		applyTo: ['stop'],
	},
	stroke: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: true,
		maybeIRI: false,
		maybeFuncIRI: true,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: shapeAndText,
	},
	'stroke-dasharray': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: shapeAndText,
	},
	'stroke-dashoffset': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '0',
		applyTo: shapeAndText,
	},
	'stroke-linecap': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'butt',
		applyTo: shapeAndText,
	},
	'stroke-linejoin': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'miter',
		applyTo: shapeAndText,
	},
	'stroke-miterlimit': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '4',
		applyTo: shapeAndText,
	},
	'stroke-opacity': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: true,
		legalValues: [],
		initValue: '1',
		applyTo: shapeAndText,
	},
	'stroke-width': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: '1',
		applyTo: shapeAndText,
	},
	'text-anchor': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'start',
		applyTo: textContentElements,
	},
	'text-decoration': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: textContentElements,
	},
	'text-rendering': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'auto',
		applyTo: ['text'],
	},
	'unicode-bidi': {
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'vector-effect': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'none',
		applyTo: ['use'].concat(graphicsElements),
	},
	visibility: {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'visible',
		applyTo: ['use', 'a'].concat(graphicsElements),
	},
	'word-spacing': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: true,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'white-space': {
		couldBeStyle: true,
		animatable: true,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'normal',
		applyTo: textContentElements,
	},
	'writing-mode': {
		couldBeStyle: true,
		animatable: false,
		maybeColor: false,
		maybeIRI: false,
		maybeFuncIRI: false,
		maybeSizeNumber: false,
		maybeAccurateNumber: false,
		legalValues: [],
		initValue: 'lr-tb',
		applyTo: ['text'],
	}
};

const undefAttr: IRegularAttr = {
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
		val: string,
		tag: string[]
	}[];
	applyTo: string[];
}

export const regularAttr = new Proxy(regular_attr, {
    get(obj, prop: string): IRegularAttr {
        return prop in obj ? obj[prop] : undefAttr;
    }
});