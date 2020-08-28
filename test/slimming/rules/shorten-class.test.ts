const chai = require('chai');
const should = chai.should();
import { combineStyle } from '../../../src/slimming/default-rules/combine-style';
import { shortenClass } from '../../../src/slimming/rules/shorten-class';
import { createXML } from '../../../src/slimming/xml/create';
import { parse } from '../../../src/xml-parser';
import { IDomNode } from '../../../typings/node';


describe('rules/shorten-class', () => {
	it('缩短 className', async () => {
		const xml = `<svg>
		<style>
		@import('test.css');
		.thisIsRed {
			fill: red;
		}
		.thisIsGreen, .thisIsRed {
			fill: green;
			stroke: red;
		}
		.thisIsGreen {
			fill: green;
		}
		</style>
		<rect class="thisIsRed" width="100" height="100"/>
		<rect class="thisIsBlue" width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await combineStyle(dom);
		await shortenClass(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><style>@import ('test.css');.a{fill:red}.a{fill:green;stroke:red}</style><rect class="a" width="100" height="100"/><rect width="100" height="100"/></svg>`);
	});

	it('缩短 className 移除 style 的情况', async () => {
		const xml = `<svg>
		<style>
		.thisIsRed {
			fill: red;
		}
		</style>
		<rect width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await combineStyle(dom);
		await shortenClass(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect width="100" height="100"/></svg>');
	});

	it('缩短 className 无法解析 style 的情况', async () => {
		const xml = `<svg>
		<style>test</style>
		<rect width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await combineStyle(dom);
		await shortenClass(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect width="100" height="100"/></svg>');
	});

	it('缩短 className 无 style 的情况', async () => {
		const xml = `<svg>
		<rect width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await combineStyle(dom);
		await shortenClass(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect width="100" height="100"/></svg>');
	});
});
