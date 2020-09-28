import { checkAnimateAttr, findAnimateAttr, getAnimateAttr } from '../../src/xml/get-animate-attr';
import { parse, ITagNode } from 'svg-vdom';

describe('xml/get-animate-attr', () => {
	test('get-animate-attr', async () => {
		const dom = await parse(`<svg>
		<animate from="0" to="100" by="5" values=";   ;40;60;80;" attributeName="x"/>
		</svg>`);
		const animateAttr = getAnimateAttr(dom.childNodes[0] as ITagNode);
		expect(animateAttr[0]).toMatchObject({
			attributeName: 'x',
			keys: ['from', 'to', 'by', 'values'],
			values: ['0', '100', '5', '40', '60', '80'],
		});
		expect(checkAnimateAttr(animateAttr, 'y')).toBeFalsy;
		expect(checkAnimateAttr(animateAttr, 'x', (v: string) => v === '15')).toBeFalsy;
		expect(checkAnimateAttr(animateAttr, 'x')).toBeTruthy;
		expect(checkAnimateAttr(animateAttr, 'x', (v: string) => parseFloat(v) > 90)).toBeTruthy;
		expect(findAnimateAttr(animateAttr, 'y').length).toBe(0);
		expect(findAnimateAttr(animateAttr, 'x').length).toBe(1);
	});

	test('coverage', async () => {
		const dom = await parse(`<svg>
		<animateTransform from="0" attributeName="tranform"/>
		<animateTransform to="10" attributeName="patternTransform"/>
		<animateTransform to="10" attributeName="x"/>
		<animate by="5"/>
		</svg>`);
		const animateAttr = getAnimateAttr(dom.childNodes[0] as ITagNode);
		expect(animateAttr[0]).toMatchObject({
			attributeName: 'tranform',
			keys: ['from'],
			values: ['0'],
		});
		expect(animateAttr[1]).toMatchObject({
			attributeName: 'patternTransform',
			keys: ['to'],
			values: ['10'],
		});
		expect(animateAttr.length).toBe(2);
	});
});
