import chai = require('chai');
const should = chai.should();
import { shortenStyleTag } from '../../../src/slimming/rules/shorten-style-tag';
import { combineStyle } from '../../../src/slimming/default-rules/combine-style';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';


describe('rules/shorten-style-tag', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
		<style>
		#redText {
			fill: red;
		}
		</style>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenStyleTag([false], dom);
		createXML(dom).should.equal('<svg> <style> #redText { fill: red; } </style> </svg>');
	});

	it('缩短 style 元素 - 解析错误', async () => {
		const xml = `<svg>
		<style>aaaa</style>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenStyleTag([true, { deepShorten: true }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg></svg>');
	});

	it('缩短 style 元素', async () => {
		const xml = `<svg>
		<style>
		@charset 'utf-8';
		/* comment */
		@import ('test.css');
		@keyframes empty {
		}
		@font-face {
		}
		@media empty {
		}
		@keyframes test {
			100% {
				fill: blue;
			}
		}
		@media test {
			text::before {
				amplitude: 0;
				fill:green;
			}
		}
		#redText {
			/* hahaha */
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
		</style>
		<a><text id="redText">123</text></a>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenStyleTag([true, { deepShorten: false }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><style>@charset 'utf-8';@import ('test.css');@keyframes test{100%{fill:blue}}@media test{text::before{fill:green}}#redText{fill:yellow}text[id^=red]{fill:yellow}a::first-letter{fill:blue}</style><a><text id="redText">123</text></a></svg>`);
	});

	it('缩短 style 元素 - 深度解析', async () => {
		const xml = `<svg>
		<style>
		#redText {
			stroke: blue;
			fill-rule: evenodd;
			fill: red;
			fill: blue;
			fill: yellow;
			flex-wrap: wrap;
		}
		@import ('test.css');
		text[id^=red], #redText, circle, a {
			fill: red;
			fill: blue;
			fill: yellow;
			flex-wrap: wrap;
			stroke: blue;
			fill-rule: evenodd;
		}
		a::first-letter {
			alignment-baseline: initial;
			fill:blue;
		}
		a::first-letter {
			display:;
			fill:red;
			width: 0;
			stroke: blue;
			text-decoration-line: underline;
		}
		text::before {
			fill:green;
		}
		text {
			displa:green;
		}
		a {
			alignment-baseline: unset;
		}
		</style>
		<a><text id="redText">123</text></a>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenStyleTag([true, { deepShorten: true }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><style>#redText,a,text[id^=red]{fill:yellow;fill-rule:evenodd;stroke:blue}@import ('test.css');a::first-letter{fill:red;stroke:blue;text-decoration-line:underline}</style><a><text id="redText">123</text></a></svg>`);
	});

	it('深度继承的情况', async () => {
		const xml = `<svg>
		<style>
		mask {
			fill: red;
		}
		</style>
		<defs>
			<pattern id="TrianglePattern">
				<path d="M 0 0 L 7 0 L 3.5 7 z"/>
			</pattern>
			<polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/>
		</defs>
		<ellipse id="ell" font-family="Arial" fill="url(#TrianglePattern)"/>
		<mask style="stroke: none;fill: blue;" font-family="Arial" id="mask-2"><use xlink:href="#path-1"/></mask>
		<mask style="stroke: none;" font-family="Arial" id="mask-3" xlink:href="#mask-3"/>
		<mask xlink:href="#use"><use id="use"/></mask>
		<mask href="#ell"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenStyleTag([true, { deepShorten: true }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><style>mask{fill:red}</style><defs><pattern id="TrianglePattern"><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern><polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/></defs><ellipse id="ell" font-family="Arial" fill="url(#TrianglePattern)"/><mask style="stroke: none;fill: blue;" font-family="Arial" id="mask-2"><use xlink:href="#path-1"/></mask><mask style="stroke: none;" font-family="Arial" id="mask-3" xlink:href="#mask-3"/><mask xlink:href="#use"><use id="use"/></mask><mask href="#ell"/></svg>');
	});

	it('移除默认值', async () => {
		const xml = `<svg>
		<style>
		rect {
			fill-opacity: 1;
		}
		</style>
		<rect/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenStyleTag([true, { deepShorten: true, rmDefault: true }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect/></svg>');
	});
});
