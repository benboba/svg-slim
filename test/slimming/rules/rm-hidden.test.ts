import chai = require('chai');
const should = chai.should();
import { rmHidden } from '../../../src/slimming/rules/rm-hidden';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/rm-hidden', () => {
	it('rule false branch', async () => {
		const xml = '<svg><polygon points="0,0 100,200,300,300,299,299" /></svg>';
		const dom = await parse(xml) as ITagNode;
		await rmHidden([false], dom);
		createXML(dom).should.equal('<svg><polygon points="0,0 100,200,300,300,299,299"/></svg>');
	});

	it('移除隐藏对象', async () => {
		const xml = `<svg>
			<g display="none" style="display:none"><text>1</text></g>
			<style></style>
			<mask width="auto"><text id="a">1<rect fill="none" stroke="none"/></text></mask>
			<mask width="0"/>
			<mask width="1"><circle r="5"/></mask>
			<use href="#use" id="use"/>
			<use href="#used"/>
			<use href="#a"/>
			<use xlink:href="a"/>
			<rect fill="none"/>
			<animate from="1" to="0" dur="5s" repeatCount="indefinite" />
			<set attributeName="fill" />
			<animateMotion />
			<animateTransform attributeName="fill" by="blue" />
			<use/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await rmHidden([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><mask width="auto"><text id="a">1<rect fill="none" stroke="none"/></text></mask><mask width="1"><circle r="5"/></mask><use href="#a"/><animateTransform attributeName="fill" by="blue"/></svg>');
	});
});
