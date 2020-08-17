const chai = require('chai');
const should = chai.should();
import { shortenColor } from '../../../src/slimming/rules/shorten-color';
import { combineStyle } from '../../../src/slimming/default-rules/combine-style';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';


describe('rules/shorten-color', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
		<rect fill="#f00"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenColor([false], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect fill="#f00"/></svg>');
	});

	it('缩短颜色', async () => {
		const xml = `<svg>
		<style>
		.a {
			color: rgb(0,0,0,0);
			fill: currentColor;
			stroke: rgba(0,0,0,0.5);
			x: 100;
		}
		</style>
		<text fill="hsl(9,9%,9%,0.01)" stroke="rgba(0,250,0,1%)" color="rgba(0,0,250,10%)">123</text>
		<rect style="fill:#ff0000" stroke="rebeccapurple" color="hsla(0,100%,100%,0)" />
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenColor([true, { rrggbbaa: false, opacityDigit: 4 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><style>.a{color:transparent;fill:currentColor;stroke:rgb(0,0,0,.5);x:100}</style><text fill="hsl(9,9%,9%,1%)" stroke="rgb(0,250,0,1%)" color="rgb(0,0,250,.1)">123</text><rect style="fill:red" stroke="#639" color="hsl(0,0%,100%,0)"/></svg>');
	});

	it('rgba 及 style 无法解析', async () => {
		const xml = `<svg>
		<style>oops</style>
		<rect width="100" style="fill:#ff000000;height:100" stroke="rgba(101,234,113,0.322)" color="transparent" />
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenColor([true, { rrggbbaa: true, opacityDigit: 3 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect width="100" style="fill:#f000;height:100" stroke="#65ea7152" color="#0000"/></svg>');
	});
});
