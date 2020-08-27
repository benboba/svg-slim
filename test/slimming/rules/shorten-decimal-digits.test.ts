const chai = require('chai');
const should = chai.should();
import { shortenDecimalDigits } from '../../../src/slimming/rules/shorten-decimal-digits';
import { combineStyle } from '../../../src/slimming/default-rules/combine-style';
import { parse } from '../../../src/xml-parser';
import { createXML } from '../../../src/slimming/xml/create';


describe('rules/shorten-decimal-digits', () => {
	it('缩短数字', async () => {
		const xml = `<svg>
		<style>
		@import('test.css');
		.a {
			fill-rule: evenodd;
			fill-opacity: inherit;
			opacity: 0.09;
			width: 500000
		}
		</style>
		<animate to="-0.55" attributeName="x"/>
		<animate to="0.5001" attributeName="opacity"/>
		<animate to="0.55" attributeName="title"/>
		<animate to="0.55"/>
		<rect opacity="1.999" style="x:1.15;y:-0;title:a" amplitude="2.0001" />
		<polygon stroke-width="1.999" style="opacity:0.00099999" points="200000 , 0.1   -1.1 0.5" />
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await combineStyle(dom);
		await shortenDecimalDigits(dom, { params: { sizeDigit: 1, angelDigit: 3 } });
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><style>@import ('test.css');.a{fill-rule:evenodd;fill-opacity:inherit;opacity:9%;width:5e5}</style><animate to="-.6" attributeName="x"/><animate to=".5" attributeName="opacity"/><animate to="0.55" attributeName="title"/><animate to="0.55"/><rect opacity="1" style="x:1.2;y:0;title:a" amplitude="2"/><polygon stroke-width="2" style="opacity:.1%" points="2e5.1-1.1.5"/></svg>`);
	});

	it('badcase', async () => {
		const xml = `<svg>
		<style>bang!</style>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await combineStyle(dom);
		await shortenDecimalDigits(dom, { params: { sizeDigit: 2, angelDigit: 3 } });
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg></svg>`);
	});
});
