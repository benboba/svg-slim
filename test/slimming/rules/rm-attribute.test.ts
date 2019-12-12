import chai = require('chai');
const should = chai.should();
import { rmAttribute } from '../../../src/slimming/rules/rm-attribute';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/rm-attribute', () => {
	it('rule false branch', async () => {
		const xml = '<svg><polygon points="0,0 100,200,300,300,299,299" /></svg>';
		const dom = await parse(xml) as ITagNode;
		await rmAttribute([false], dom);
		createXML(dom).should.equal('<svg><polygon points="0,0 100,200,300,300,299,299"/></svg>');
	});

	it('移除属性', async () => {
		const xml = `<svg
			data-test="100"
			aria-colspan="3"
			onload="console.log(123)"
			version=""
		>
		<a x="1"/>
		<circle stroke="none" cx="1" cy="0.0"/>
		<animate to="1"/>
		<animate to="1" attributeName="title"/>
		<g fill="#000">
			<rect fill="black" stroke=""/>
			<g fill="none">
				<rect fill="rgb(0,0,0,.5)" stroke="hsl(0,0%,0%)"/>
			</g>
		</g>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await rmAttribute([true, true, false, false], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><a/><circle cx="1"/><animate/><animate/><g><rect/><g fill="none"><rect fill="rgb(0,0,0,.5)" stroke="hsl(0,0%,0%)"/></g></g></svg>');
	});

	it('移除属性 - 反转规则', async () => {
		const xml = `<svg
			data-test="100"
			aria-colspan="3"
			onload="console.log(123)"
			version=""
		><text stroke="none"/><circle cx="1" cy="0"/></svg>`;
		const dom = await parse(xml) as ITagNode;
		await rmAttribute([true, false, true, true], dom);
		createXML(dom).should.equal('<svg aria-colspan="3" onload="console.log(123)"><text stroke="none"/><circle cx="1" cy="0"/></svg>');
	});
});
