import { parse } from 'svg-vdom';
import { collapseTextwrap } from '../../src/rules/collapse-textwrap';
import { createXML } from '../../src/xml/create';

describe('rules/collapse-textwrap', () => {
	test('塌陷文本容器', async () => {
		const xml = '<svg><text><tspan>1</tspan></text><text><tspan tx="1">2</tspan></text><text><tspan tx="">3</tspan></text></svg>';
		const dom = await parse(xml);
		await collapseTextwrap(dom);
		expect(createXML(dom)).toBe('<svg><text>1</text><text><tspan tx="1">2</tspan></text><text>3</text></svg>');
	});
});
