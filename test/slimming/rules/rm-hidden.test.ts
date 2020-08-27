const chai = require('chai');
const should = chai.should();
import { rmHidden } from '../../../src/slimming/rules/rm-hidden';
import { parse } from '../../../src/xml-parser';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/rm-hidden', () => {
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
			<use/>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await rmHidden(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><mask width="auto"><text id="a">1<rect fill="none" stroke="none"/></text></mask><mask width="1"><circle r="5"/></mask><use href="#a"/></svg>');
	});

	it('textPath', async () => {
		const xml = `<svg>
		<rect id="a"/>
		<textPath id="b" path="M0,0L100H100z">123</textPath>
		<textPath>123</textPath>
		<textPath xlink:href="#a">123</textPath>
		<textPath href="#b">123</textPath>
		<textPath href="#c">123</textPath>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await rmHidden(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect id="a"/><textPath id="b" path="M0,0L100H100z">123</textPath><textPath xlink:href="#a">123</textPath></svg>');
	});

	it('check animate', async () => {
		const xml = `<svg>
			<rect display="none">
				<animate from="block" attributeName="display"/>
			</rect>
			<rect display="none">
				<animate from="1" attributeName="x"/>
			</rect>
			<rect fill="none">
				<animate to="none" attributeName="fill"/>
				<animate to="none" attributeName="stroke"/>
			</rect>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await rmHidden(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect display="none"><animate from="block" attributeName="display"/></rect></svg>');
	});
});
