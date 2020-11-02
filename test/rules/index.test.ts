import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { combineStyle } from '../../src/default-rules/combine-style';
import { rmIrregularTag } from '../../src/rules/rm-irregular-tag';
import { rmPx } from '../../src/rules/rm-px';
import { rmUnnecessary } from '../../src/rules/rm-unnecessary';
import { rmDocType } from '../../src/rules/rm-doctype';
import { createXML } from '../../src/xml/create';

describe('rules/覆盖率补齐', () => {
	test('rm-irregular-tag', async () => {
		const xml = '<svg><undef/><def/></svg>';
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			rules: {
				'rm-irregular-tag': [true, {
					ignore: ['def'],
				}],
			}
		}), 'rm-irregular-tag');
		await rmIrregularTag(dom, config);
		expect(createXML(dom)).toBe('<svg><def/></svg>');
	});

	test('rm-unnecessary', async () => {
		const xml = '<svg><title/></svg>';
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			rules: {
				'rm-unnecessary': [true, {
					tags: [],
				}],
			}
		}), 'rm-unnecessary');
		await rmUnnecessary(dom, config);
		expect(createXML(dom)).toBe('<svg><title/></svg>');
	});

	test('rm-doctype', async () => {
		const xml = '<!DOCTYPE html><svg></svg>';
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'rm-doctype');
		await rmDocType(dom);
		expect(createXML(dom)).toBe('<svg/>');
	});

	test('rm-px', async () => {
		const xml = '<svg width="1000px" viewBox="0 0 1000 800" version="1.1" style="height:800px"><style>rect {height: 20px;font-size:20px}</style><rect width="0em" style="height:0pt;fill:red" id="r;1px"/></svg>';
		const dom = await parse(xml);
		await combineStyle(dom);
		await rmPx(dom);
		expect(createXML(dom)).toBe('<svg width="1000" viewBox="0 0 1000 800" version="1.1" style="height:800"><style>rect{height:20;font-size:20px}</style><rect width="0" style="height:0;fill:red" id="r;1px"/></svg>');
	});
});
