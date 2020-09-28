import { parse } from 'svg-vdom';
import { rmHidden } from '../../src/rules/rm-hidden';
import { createXML } from '../../src/xml/create';

describe('rules/rm-hidden', () => {
	test('移除隐藏对象', async () => {
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
		const dom = await parse(xml);
		await rmHidden(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><mask width="auto"><text id="a">1<rect fill="none" stroke="none"/></text></mask><mask width="1"><circle r="5"/></mask><use href="#a"/></svg>');
	});

	test('textPath', async () => {
		const xml = `<svg>
		<rect id="a"/>
		<textPath id="b" path="M0,0L100H100z">123</textPath>
		<textPath>123</textPath>
		<textPath xlink:href="#a">123</textPath>
		<textPath href="#b">123</textPath>
		<textPath href="#c">123</textPath>
		</svg>`;
		const dom = await parse(xml);
		await rmHidden(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><rect id="a"/><textPath id="b" path="M0,0L100H100z">123</textPath><textPath xlink:href="#a">123</textPath></svg>');
	});

	test('check animate', async () => {
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
		const dom = await parse(xml);
		await rmHidden(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><rect display="none"><animate from="block" attributeName="display"/></rect></svg>');
	});
});
