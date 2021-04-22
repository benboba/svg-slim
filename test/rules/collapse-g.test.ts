import { parse } from 'svg-vdom';
import { collapseG } from '../../src/rules/collapse-g';
import { createXML } from '../../src/xml/create';

describe('rules/collapse-g', () => {
	test('g元素塌陷', async () => {
		const xml = '<svg><g fill="red"><g><text>1</text></g></g><g id="nonono"><text>2</text></g><g style="fill:red"><g><text>3</text><line/></g></g><g title="123"><g><text>3</text><line/></g></g><g></g></svg>';
		const dom = await parse(xml);
		await collapseG(dom);
		expect(createXML(dom)).toBe('<svg><text fill="red">1</text><g id="nonono"><text>2</text></g><g style="fill:red"><text>3</text><line/></g><g title="123"><text>3</text><line/></g></svg>');
	});

	test('属性塌陷', async () => {
		const xml = '<svg><g fill="red" transform="scale(1)"><text fill="blue" transform="rotate(30)">1</text></g></svg>';
		const dom = await parse(xml);
		await collapseG(dom);
		expect(createXML(dom)).toBe('<svg><text fill="blue" transform="scale(1) rotate(30)">1</text></svg>');
	});

	test('style 塌陷', async () => {
		const xml = `<svg>
		<g style="fill:red"><text>0</text></g>
		<g style="fill:red"><text style="stroke:blue">1</text></g>
		<g style="fill:red"><text style="fill:blue">2</text></g>
		<g style="fill:red"><text>3</text><text>4</text></g>
		<g style="transform:scale(1)"><text>5</text></g>
		</svg>`;
		const dom = await parse(xml);
		await collapseG(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><text style="fill:red">0</text><text style="stroke:blue;fill:red">1</text><text style="fill:blue">2</text><g style="fill:red"><text>3</text><text>4</text></g><g style="transform:scale(1)"><text>5</text></g></svg>');
	});
});
