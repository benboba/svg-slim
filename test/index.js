const tester = require('./tester');

tester(
	'default rules',
	`<?xml           version   =   "1.0"         encoding  =  "UTF-8"      ?>
    <svg>
        <!ENTITY nbsp "&#xA0;">
        <![ENTITY[test 1234]]>
        <style >#id{fill:red}</style>
        <script >console.log(1)</script>
        <style>.class{fill:blue}</style>
        <script>console.log(2)</script>
        <text   >
        1
        <![CDATA[abc]]>
        2
        <notext>    </notext>
        </text   >
    </svg>`,
	'<?xml version="1.0" encoding="UTF-8"?><svg><style>#id{fill:red}.class{fill:blue}</style><text> 1 abc 2 <notext/></text><script>console.log(1);console.log(2)</script></svg>'
);

tester(
	'collapse-g',
	`<svg>
        <g fill="red"><g><text>1</text></g></g>
        <g id="nonono"><text>2</text></g>
        <g style="fill:none"><g class="b"><text>3</text></g></g>
    </svg>`,
	'<svg><text fill="red">1</text><g id="nonono"><text>2</text></g><g style="fill:none"><g class="b"><text>3</text></g></g></svg>', {
		'collapse-g': true
	}
);

tester(
	'collapse-textwrap',
	`<svg>
    <text><tspan>1</tspan></text>
    </svg>`,
	'<svg><text>1</text></svg>', {
		'collapse-textwrap': true
	}
);

tester(
	'combine-path',
	`<svg>
    <path fill="none" stroke-opacity="0.5" d="M0,0h100V100H0Z"/>
    <path fill="none" stroke-opacity="0.5" d="M110,0l100,0,0,100,-100,0Z"/>
    <path d="M0,0h100V100H0Z"/>
    <path d="M110,0l100,0,0,100,-100,0Z"/>
    <rect />
    <path fill="none" d="M100.5.5H100Z" />
    <path fill="none" d="M200.5.5H100Z" />
    </svg>`,
	'<svg><path fill="none" stroke-opacity="0.5" d="M0,0h100V100H0Z"/><path fill="none" stroke-opacity="0.5" d="M110,0l100,0,0,100,-100,0Z"/><path d="M0,0h100V100H0Z"/><path d="M110,0l100,0,0,100,-100,0Z"/><rect/><path fill="none" d="M100.5.5H100ZM200.5.5H100Z"/></svg>', {
		'combine-path': true
	}
);

tester(
	'combine-path',
	`<svg>
    <path d="M0,0h100V100H0Z"/>
    <path d="M110,0l100,0,0,100,-100,0Z"/>
    </svg>`,
	'<svg><path d="M0,0h100V100H0ZM110,0l100,0,0,100,-100,0Z"/></svg>', {
		'combine-path': [true, true]
	}
);

tester(
	'combine-path',
	`<svg>
    <path fill="none" stroke-opacity="0.5" d="M0,0h100V100H0Z"/>
    <path fill="none" stroke-opacity="0.5" d="M110,0l100,0,0,100,-100,0Z"/>
    </svg>`,
	'<svg><path fill="none" stroke-opacity="0.5" d="M0,0h100V100H0ZM110,0l100,0,0,100,-100,0Z"/></svg>', {
		'combine-path': [true, false, true]
	}
);

tester(
	'combine-transform',
	`<svg>
    <text transform="scale(2) translate(100,100) skewX(-15) skewX(15) translate(-100-100) scale(0.5)">1</text>
    <text transform="scale(2.9999999)">2</text>
    <text transform="scale(1.32034) translate(10,0.1) rotate(90)">2</text>
    <text transform="matrix(2,0,0,3,0,0)">2</text>
    <text transform="matrix(1,0,0,1,1,0)">2</text>
    <text transform="matrix(0.988,-0.156,0.156,0.988,0,0)">2</text>
    </svg>`,
	'<svg><text>1</text><text transform="scale(3)">2</text><text transform="matrix(0,1.32-1.32,0,13.2.1)">2</text><text transform="scale(2,3)">2</text><text transform="translate(1)">2</text><text transform="rotate(-8.97)">2</text></svg>', {
		'combine-transform': [true, 3, 1]
	}
);

tester(
	'compute-path',
	`<svg>
    <path d="m0,0,10,10,10,10,-20,-20V100,200,300,299,299" />
    <path d="M5e5.1L0,0,10,0,20,0,50,0,100,0,100,100,0,100Z" />
    <path d="M80 80 A 45 45, 0, 0, 0, 125 125 45 45, 0, 0, 0, 170 80 45 45, 0, 0, 0, 125 35 45 45, 0, 0, 0, 80 80 Z" />
    <path d="M0 0 Q0 100 100 100 Q 200 100 200 0 Z m0 0zZzZM100 100 m 30 30" />
    <path d="M 0 0 C 50 0 50 100 100 100 150 100 150 50 150 0Z" />
    </svg>`,
	'<svg><path d="M0,0L20,20,0,0V299"/><path d="M5e5.1L0,0H100V100H0z"/><path d="M80,80a45,45,0,1,0,45-45,45,45,0,0,0-45,45z"/><path d="M0,0Q0,100,100,100T200,0z"/><path d="M0,0C50,0,50,100,100,100S150,50,150,0z"/></svg>', {
		'compute-path': [true, true, 1]
	}
);

tester(
	'douglas-peucker',
	`<svg>
    <polyline points="0 0 10 10 20 -10 30 0" />
    </svg>`,
	'<svg><polyline points="0,0,30,0"/></svg>', {
		'douglas-peucker': [true, 30]
	}
);

tester(
	'rm-attribute',
	`<svg
        data-test="100"
        aria-colspan="3"
        onload="console.log(123)"
        version=""
    >
		<path d="M0,9,0" />
		<feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
    </svg>`,
	'<svg><path d="M0,9,0"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" in="shadowBlurOuter1"/></svg>', {
		'rm-attribute': [true, true, false, false]
	}
);

tester(
	'rm-comments',
	`<svg>
    <!--test-->
    </svg>`,
	'<svg/>', {
		'rm-comments': true
	}
);

tester(
	'rm-doctype',
	`<svg>
    <!DOCTYPE xml>
    </svg>`,
	'<svg/>', {
		'rm-doctype': true
	}
);

tester(
	'rm-hidden',
	`<svg>
    <g display="none"><text>1</text></g>
    <style></style>
    <rect width="0" height="100" />
    <circle cx="10" cy="10" />
    <ellipse rx="0" ry="1e5" />
    <line x1="1" y1="10" x2="1" y2="10" />
    <polygon points="100 100 200 200 300 300" fill="none" stroke="none" />
    <polyline  />
    </svg>`,
	'<svg/>', {
		'rm-hidden': true
	}
);

tester(
	'rm-irregular-nesting',
	`<svg>
    <circle><g><text>123</text></g></circle>
    </svg>`,
	'<svg><circle/></svg>', {
		'rm-irregular-nesting': true
	}
);

tester(
	'rm-irregular-tag',
	`<svg>
    <empty><rect width="100" height="100" fill="red" /></empty>
    </svg>`,
	'<svg/>', {
		'rm-irregular-tag': true
	}
);

tester(
	'rm-px',
	`<svg width="1000px" height="800px">
    </svg>`,
	'<svg width="1000" height="800"/>', {
		'rm-px': true
	}
);

tester(
	'rm-unnecessary',
	`<svg>
    <title>1111</title>
    <desc>2222</desc>
    <metadata>3333</metadata>
    </svg>`,
	'<svg><metadata>3333</metadata></svg>', {
		'rm-unnecessary': [true, ['title', 'desc']]
	}
);

tester(
	'rm-version',
	`<svg version="1.1">
    </svg>`,
	'<svg/>', {
		'rm-version': true
	}
);

tester(
	'rm-viewbox',
	`<svg width="100" height="100" viewBox="0 0 100 100">
    </svg>`,
	'<svg width="100" height="100"/>', {
		'rm-viewbox': true
	}
);

tester(
	'rm-xml-decl',
	`<?xml version="1.0" encoding="UTF-8" ?>
    <svg>
    </svg>`,
	'<svg/>', {
		'rm-xml-decl': true
	}
);

tester(
	'rm-xmlns',
	`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xml="http://www.w3.org/XML/1998/namespace">
    <a xlink:href="http://localhost"><s:text>123</s:text></a>
    </svg>`,
	'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="http://localhost"><s:text>123</s:text></a></svg>', {
		'rm-xmlns': true
	}
);

tester(
	'shape-to-path',
	`<svg>
    <rect fill="red" width="100" height="100"/>
    <rect fill="red" width="1000" height="100"/>
    </svg>`,
	'<svg><path fill="red" d="M0,0h100v100h-100z"/><path fill="red" d="M0,0v100h1000v-100z"/></svg>', {
		'shape-to-path': true
	}
);

tester(
	'shorten-class',
	`<svg>
    <style>.thisIsRed {
        fill: red;
    }
    </style>
    <rect class="thisIsRed" width="100" height="100"/>
    <rect class="thisIsRed thisIsBlue" width="100" height="100"/>
    </svg>`,
	'<svg><style>.a{fill:red}</style><rect class="a" width="100" height="100"/><rect class="a" width="100" height="100"/></svg>', {
		'shorten-class': true
	}
);

tester(
	'shorten-color',
	`<svg>
    <rect fill="#ff0000" stroke="rebeccapurple" color="hsla(0,100%,100%,0)" width="100" height="100" />
    </svg>`,
	'<svg><rect fill="red" stroke="#639" color="#fff0" width="100" height="100"/></svg>', {
		'shorten-color': [true, true]
	}
);

tester(
	'shorten-decimal-digits',
	`<svg>
    <polygon stroke-width="1.999" opacity="0.00099999" points="200000 , 0.1   -1.1 0.5" />
    </svg>`,
	'<svg><polygon stroke-width="2" opacity=".001" points="2e5.1-1.1.5"/></svg>', {
		'shorten-decimal-digits': [true, 1, 3]
	}
);

tester(
	'shorten-defs',
	`<svg>
    <defs>
    <pattern id="TrianglePattern">
      <path d="M 0 0 L 7 0 L 3.5 7 z" />
    </pattern> 
  </defs>
  <ellipse fill="url(#TrianglePattern)" />
  <defs>
  <pattern>
    <path d="M 0 0 L 7 0 L 3.5 7 z" />
  </pattern> 
</defs>
<mask id="mask-2" fill="white">
    <use xlink:href="#path-1" />
</mask>
<defs>
    <polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"></polygon>
</defs>
    </svg>`,
	'<svg><defs><pattern id="TrianglePattern"><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern><polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/></defs><ellipse fill="url(#TrianglePattern)"/><mask id="mask-2" fill="white"><use xlink:href="#path-1"/></mask></svg>', {
		'shorten-defs': true
	}
);

tester(
	'shorten-id',
	`<svg>
    <defs>
    <pattern id="TrianglePattern">
      <path d="M 0 0 L 7 0 L 3.5 7 z" />
    </pattern> 
    <polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"></polygon>
  </defs>
  <ellipse fill="url(#TrianglePattern)" />
<mask id="mask-2" fill="white">
    <use xlink:href="#path-1" />
</mask>
    </svg>`,
	'<svg><defs><pattern id="a"><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern><polygon id="b" points="46 0 46 52 0 52 0 0 46 0"/></defs><ellipse fill="url(#a)"/><mask fill="white"><use xlink:href="#b"/></mask></svg>', {
		'shorten-id': true
	}
);

tester(
	'shorten-style-attr',
	`<svg>
	<g fill="none" style="fill:blue">
	<text fill="red" stroke="blue" style="font-family: &quot;微软雅黑&quot;;fill: rebeccapurple; stroke: blue; flex-grow: 1;">123</text>
	<g fill="#fff">
		<rect/>
	</g>
	</g>
    </svg>`,
	'<svg><g><text stroke="blue" fill="rebeccapurple" font-family="&quot;微软雅黑&quot;">123</text><g fill="#fff"><rect/></g></g></svg>', {
		'shorten-style-attr': true
	}
);

tester(
	'shorten-style-tag',
	`<svg>
    <style>
    #redText {
        fill: red;
        fill: blue;
        fill: yellow;
        flex-wrap: wrap;
    }
    text[id^=red] {
        fill: red;
        fill: blue;
        fill: yellow;
        flex-wrap: wrap;
	}
	a::first-letter {
		fill:blue;
	}
	text::before {
		fill:green;
	}
    </style>
    <a><text id="redText">123</text></a>
    </svg>`,
	'<svg><style>#redText,text[id^=red]{fill:yellow}a::first-letter{fill:blue}</style><a><text id="redText">123</text></a></svg>', {
		'shorten-style-tag': [true, true]
	}
);

tester(
	'shorten-style-tag',
	`<svg>
    <style>
    #redText {
        fill: yellow;
    }
    text[id^=red] {
        fill: red;
	}
	a::first-letter {
		fill:blue;
	}
    </style>
    <a><text id="redText" style="fill:blue">123</text></a>
    </svg>`,
	'<svg><a><text id="redText" style="fill:blue">123</text></a></svg>', {
		'shorten-style-tag': [true, true]
	}
);

tester(
	'shorten-style-tag',
	`<svg>
    <style>
    #redText {
		fill: yellow;
		marker-end: none;
    }
    </style>
    <text id="redText">123</text>
    </svg>`,
	'<svg><style>#redText{fill:yellow}</style><text id="redText">123</text></svg>', {
		'shorten-style-tag': [true, true]
	}
);
