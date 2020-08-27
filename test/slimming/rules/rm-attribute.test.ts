const chai = require('chai');
const should = chai.should();
import { rmAttribute } from '../../../src/slimming/rules/rm-attribute';
import { parse } from '../../../src/xml-parser';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/rm-attribute', () => {
	it('移除属性', async () => {
		const xml = `<svg
			data-test="100"
			aria-colspan="3"
			onload="console.log(123)"
			version=""
			width="100"
			style="width:40"
		>
		<a x="1"/>
		<circle stroke="none" cx="1" cy="0.0"/>
		<g fill="#000">
			<rect fill="black" stroke=""/>
			<g fill="none">
				<rect id="rect" fill="rgb(0,0,0,.5)" stroke="hsl(0,0%,0%)"/>
				<use href="#b" xlink:href="#rect"/>
				<use href="#b" width="-1" height="-1"/>
				<use href="#b" width="1" height="1"/>
			</g>
		</g>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await rmAttribute(dom, { params: { rmAttrEqDefault: true }, option: { keepEvent: false, keepAria: false } });
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg width="100" style="width:40"><a/><circle cx="1"/><g><rect/><g fill="none"><rect id="rect" fill="rgb(0,0,0,.5)" stroke="hsl(0,0%,0%)"/><use href="#b"/><use href="#b"/><use href="#b" width="1" height="1"/></g></g></svg>');
	});

	it('移除属性 - 反转规则', async () => {
		const xml = `<svg
			data-test="100"
			aria-colspan="3"
			onload="console.log(123)"
			version=""
		><text stroke="none"/><circle cx="1" cy="0"/></svg>`;
		const dom = await parse(xml) as IDomNode;
		await rmAttribute(dom, { params: { rmAttrEqDefault: false }, option: { keepEvent: true, keepAria: true } });
		createXML(dom).should.equal('<svg aria-colspan="3" onload="console.log(123)"><text stroke="none"/><circle cx="1" cy="0"/></svg>');
	});
});
