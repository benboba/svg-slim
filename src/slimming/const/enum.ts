// 存储所有的枚举值

export enum accumulateVal {
    none,
    sum,
}

export enum additiveVal {
    replace,
    sum,
}

export enum calcModelVal {
    discrete,
    linear,
    paced,
    spline,
}

export enum unitVal {
    userSpaceOnUse,
    objectBoundingBox,
}

export enum crossoriginVal {
    '',
    anonymous,
    'use-credentials',
}

export enum durVal {
    media,
    indefinite,
}

export enum edgeModeVal {
    duplicate,
    wrap,
    none,
}

export enum inVal {
    SourceGraphic,
    SourceAlpha,
    BackgroundImage,
    BackgroundAlpha,
    FillPaint,
    StrokePaint
}

export enum lengthAdjustVal {
    spacing,
    spacingAndGlyphs
}

export enum markerUnitVal {
    strokeWidth,
    userSpaceOnUse
}

export enum methodVal {
    align,
    stretch
}

export enum blendModeVal {
    normal,
    multiply,
    screen,
    overlay,
    darken,
    lighten,
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    difference,
    exclusion,
    hue,
    saturation,
    color,
    luminosity
}

export enum operaterVal {
    over,
    in,
    out,
    atop,
    xor,
    lighter,
    arithmetic
}

export enum operaterVal1 {
    erode,
    dilate
}

export enum orientVal {
    auto,
    'auto-start-reverse'
}

export enum playbackorderVal {
    forwardonly,
    all
}

export enum booleanVal {
    false,
    true
}

export enum alignXVal {
    left,
    center,
    right
}

export enum alignYVal {
    top,
    center,
    bottom
}

export enum restartVal {
    always,
    whenNotActive,
    never
}

export enum rotateVal {
    auto,
    'auto-reverse'
}

export enum sideVal {
    left,
    right
}

export enum spacingVal {
    auto,
    exact
}

export enum spreadMethodVal {
    pad,
    reflect,
    repeat
}

export enum stitchVal {
    stitch,
    noStitch
}

export enum targetVal {
    _self,
    _parent,
    _top,
    _blank
}

export enum timelinebeginVal {
    loadend,
    loadbegin
}

export enum animateTransformType {
    translate,
    scale,
    rotate,
    skewX,
    skewY
}

export enum feColorMatrixType {
    matrix,
    saturate,
    hueRotate,
    luminanceToAlpha
}

export enum feFuncType {
    identity,
    table,
    discrete,
    linear,
    gamma
}

export enum feTurbulenceType {
    fractalNoise,
    turbulence
}

export enum channelVal {
    R,
    G,
    B,
    A
}

export enum xmlSpaceVal {
    default,
    preserve
}

export enum zoomAndPanVal {
    disable,
    magnify
}

export enum alignmentBaseline {
    auto,
    baseline,
    'before-edge',
    'text-before-edge',
    middle,
    central,
    'after-edge',
    'text-after-edge',
    ideographic,
    alphabetic,
    hanging,
    mathematical
}

export enum baselineShift {
    baseline,
    sub,
    super
}

export enum clipBox {
    'border-box',
    'padding-box',
    'content-box',
    'margin-box',
    'fill-box',
    'stroke-box',
    'view-box'
}

export enum clipRule {
    nonzero,
    evenodd
}

export enum colorKeywords {
    inherit,
    currentColor,
    transparent
}

export enum x11Colors {
    aliceblue, antiquewhite, aqua, aquamarine, azure, beige, bisque, black, blanchedalmond, blue, blueviolet, brown, burlywood, cadetblue, chartreuse, chocolate, coral, cornflowerblue, cornsilk, crimson, cyan, darkblue, darkcyan, darkgoldenrod, darkgray, darkgreen, darkgrey, darkkhaki, darkmagenta, darkolivegreen, darkorange, darkorchid, darkred, darksalmon, darkseagreen, darkslateblue, darkslategray, darkslategrey, darkturquoise, darkviolet, deeppink, deepskyblue, dimgray, dimgrey, dodgerblue, firebrick, floralwhite, forestgreen, fuchsia, gainsboro, ghostwhite, gold, goldenrod, gray, green, greenyellow, grey, honeydew, hotpink, indianred, indigo, ivory, khaki, lavender, lavenderblush, lawngreen, lemonchiffon, lightblue, lightcoral, lightcyan, lightgoldenrodyellow, lightgray, lightgreen, lightgrey, lightpink, lightsalmon, lightseagreen, lightskyblue, lightslategray, lightslategrey, lightsteelblue, lightyellow, lime, limegreen, linen, magenta, maroon, mediumaquamarine, mediumblue, mediumorchid, mediumpurple, mediumseagreen, mediumslateblue, mediumspringgreen, mediumturquoise, mediumvioletred, midnightblue, mintcream, mistyrose, moccasin, navajowhite, navy, oldlace, olive, olivedrab, orange, orangered, orchid, palegoldenrod, palegreen, paleturquoise, palevioletred, papayawhip, peachpuff, peru, pink, plum, powderblue, purple, red, rosybrown, royalblue, saddlebrown, salmon, sandybrown, seagreen, seashell, sienna, silver, skyblue, slateblue, slategray, slategrey, snow, springgreen, steelblue, tan, teal, thistle, tomato, turquoise, violet, wheat, white, whitesmoke, yellow, yellowgreen
}

export enum colorInterpolation {
    auto,
    sRGB,
    linearRGB
}

export enum colorRendering {
    auto,
    optimizeSpeed,
    optimizeQuality
}