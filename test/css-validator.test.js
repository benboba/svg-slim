const validateCss = require('css-validator');
validateCss({
    text: `text {
        alignment-baseline: baseline;
        baseline-shift: 100rem;
        clip-rule: evenodd;
        color: hsl(25, 100%, 50%, 5%);
        color-rendering: optimizeQuality;
        fill: url(#image);
        mask-composite: add, exclude;
        mask-image: url(trapeze.svg), url(circle.svg), url(rect.svg);
        transform: translate(100px, 100px);
        glyph-orientation-vertical: upright;
    }`,
    profile: 'css3svg',
    warning: 'no',
}, (err, data) => {
    console.log(data);
});
