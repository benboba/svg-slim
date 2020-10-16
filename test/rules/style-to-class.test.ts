import { parse } from 'svg-vdom';
import { styleToClass } from '../../src/rules/style-to-class';
import { shortenClass } from '../../src/rules/shorten-class';
import { createXML } from '../../src/xml/create';

describe('rules/style-to-class', () => {
	test('style to class', async () => {
        const xml = `<svg xmlns="http://www.w3.org/2000/svg">
        <rect/>
        <text style="font-family:Arial;font-size:13.31;font-stretch:Normal;font-weight:400;letter-spacing:0;word-spacing:0" dx="206.4" dy="285.43">70</text>
        <text style="font-family:Arial;font-size:13.31;font-stretch:Normal;font-weight:400;letter-spacing:0;word-spacing:0" dx="206.4" dy="253.69">80</text>
        <text style="font-family:Arial;font-size:13.31;font-stretch:Normal;font-weight:400;letter-spacing:0;word-spacing:0" dx="206.4" dy="221.95">90</text>
        <text style="font-family:Arial;font-size:13.31;font-stretch:Normal;font-weight:400;letter-spacing:0;word-spacing:0" dx="198.7" dy="190.21">100</text>
                </svg>`;
		const dom = await parse(xml);
        await styleToClass(dom);
        await shortenClass(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg xmlns="http://www.w3.org/2000/svg"><style>.a{font-family:Arial;font-size:13.31px;font-stretch:Normal;font-weight:400;letter-spacing:0;word-spacing:0}</style><rect/><text dx="206.4" dy="285.43" class="a">70</text><text dx="206.4" dy="253.69" class="a">80</text><text dx="206.4" dy="221.95" class="a">90</text><text dx="198.7" dy="190.21" class="a">100</text></svg>');
	});
});
