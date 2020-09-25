// 用于属性合法性验证的枚举类型（此处存储方便直接转换为正则的字符串形式）

export const calcMode = 'discrete|linear|paced|spline';

export const units = 'userSpaceOnUse|objectBoundingBox';

export const crossOrigin = 'anonymous|use-credentials';

export const dur = 'media|indefinite';

export const edgeMode = 'duplicate|wrap|none';

export const inVal = 'SourceGraphic|SourceAlpha|BackgroundImage|BackgroundAlpha|FillPaint|StrokePaint';

export const lengthAdjust = 'spacing|spacingAndGlyphs';

export const markerUnit = 'strokeWidth|userSpaceOnUse';

export const method = 'align|stretch';

export const blendMode = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity';

export const operater = 'over|in|out|atop|xor|lighter|arithmetic';
export const operater1 = 'erode|dilate';

export const orient = 'auto|auto-start-reverse';

export const alignX = 'left|center|right';
export const alignY = 'top|center|bottom';

export const referrer = 'no-referrer|no-referrer-when-downgrade|same-origin|origin|strict-origin|origin-when-cross-origin|strict-origin-when-cross-origin|unsafe-url';

export const restart = 'always|whenNotActive|never';

export const spreadMethod = 'pad|reflect|repeat';

export const target = '_self|_parent|_top|_blank';

export const animateTransformType = 'translate|scale|rotate|skewX|skewY';

export const feColorMatrixType = 'matrix|saturate|hueRotate|luminanceToAlpha';

export const feFuncType = 'identity|table|discrete|linear|gamma';

export const feTurbulenceType = 'fractalNoise|turbulence';

export const channel = 'R|G|B|A';

export const isolationMode = 'auto|isolate';

// 下面是 properties
export const CSSDefault = 'initial|inherit|unset|revert';

export const alignmentBaseline = 'auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical';

export const baselineShift = 'baseline|sub|super';

export const clipPath = 'border-box|padding-box|content-box|margin-box|fill-box|stroke-box|view-box';

export const nonzeroEvenodd = 'nonzero|evenodd';

export const colorKeyWords = 'currentColor|transparent';
export const x11Colors = 'aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen';
export const systemColor = 'ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText';

export const colorInterpolation = 'auto|sRGB|linearRGB';

export const colorRendering = 'auto|optimizeSpeed|optimizeQuality';

export const direction = 'ltr|rtl';

export const display = 'inline|block|list-item|run-in|compact|marker|table|inline-table|table-row-group|table-header-group|table-footer-group|table-row|table-column-group|table-column|table-cell|table-caption|none';

export const dominantBaseline = 'auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge';

export const paintKeywords = 'context-fill|context-stroke';

export const absoluteSize = 'xx-small|x-small|small|medium|large|x-large|xx-large';
export const relativeSize = 'larger|smaller';
export const fontStretch = 'normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded';
export const fontStyle = 'normal|italic|oblique';

// font variant
export const commonLigValues = 'common-ligatures|no-common-ligatures';
export const discretionaryLigValues = 'discretionary-ligatures|no-discretionary-ligatures';
export const historicalLigValues = 'historical-ligatures|no-historical-ligatures';
export const contextualAltValues = 'contextual|no-contextual';
export const capsValues = 'small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps';
export const numericFigureValues = 'lining-nums|oldstyle-nums';
export const numericSpacingValues = 'proportional-nums|tabular-nums';
export const numericFractionValues = 'diagonal-fractions|stacked-fractions';
export const eastAsianVariantValues = 'jis78|jis83|jis90|jis04|simplified|traditional';
export const eastAsianWidthValues = 'full-width|proportional-width';

export const fontWeight = 'normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900';

export const overflow = 'visible|hidden|scroll|auto';

export const pointerEvents = 'bounding-box|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|none';

export const shapeRendering = 'auto|optimizeSpeed|crispEdges|geometricPrecision';

export const strokeLinecap = 'butt|round|square';

export const strokeLinejoin = 'miter|miter-clip|round|bevel|arcs';

export const textAnchor = 'start|middle|end';

export const textRendering = 'auto|optimizeSpeed|optimizeLegibility|geometricPrecision';

export const unicodeBidi = 'normal|embed|isolate|bidi-override|isolate-override|plaintext';

export const visibility = 'visible|hidden|collapse';

export const whiteSpace = 'normal|pre|nowrap|pre-wrap|break-spaces|pre-line';

export const writingMode = 'lr|lr-tb|rl|rl-tb|tb|tb-rl';
export const writingModeCSS3 = 'horizontal-tb|vertical-rl|vertical-lr';
