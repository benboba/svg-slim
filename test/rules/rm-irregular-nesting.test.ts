import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { rmIrregularNesting } from '../../src/rules/rm-irregular-nesting';
import { createXML } from '../../src/xml/create';

describe('rules/rm-irregular-nesting', () => {
	test('移除不正确的嵌套', async () => {
		const xml = `<svg>
		<desc>
		<circle>
		<g>
		<text>123</text>
		</g>
		</circle>
		<a><a><line/></a></a>
		</desc>
		<rect><a><g></g></a></rect>
		<switch><a><line/></a></switch>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			rules: {
				'rm-irregular-nesting': [true, {
					ignore: ['rect'],
				}],
			},
		}), 'rm-irregular-nesting');
		await rmIrregularNesting(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><desc><circle></circle><a/></desc><rect/><switch><a><line/></a></switch></svg>');
	});

	test('测试用例补全', async () => {
		const dom1 = await parse(`<switch><a><line/></a></switch>`);
		const config = createRuleConfig(mergeConfig(null), 'rm-irregular-nesting');
		await rmIrregularNesting(dom1, config);
		expect(createXML(dom1)).toBe('<switch><a><line/></a></switch>');

		const dom2 = await parse(`<bad><switch><a><line/></a></switch></bad>`);
		await rmIrregularNesting(dom2, config);
		expect(createXML(dom2)).toBe('<bad><switch><a><line/></a></switch></bad>');
	});
});
