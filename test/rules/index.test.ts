const chai = require('chai');
const should = chai.should();
import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { combineStyle } from '../../src/default-rules/combine-style';
import { rmIrregularTag } from '../../src/rules/rm-irregular-tag';
import { rmPx } from '../../src/rules/rm-px';
import { rmUnnecessary } from '../../src/rules/rm-unnecessary';
import { createXML } from '../../src/xml/create';

describe('rules/覆盖率补齐', () => {
	it('rm-irregular-tag', async () => {
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
		createXML(dom).should.equal('<svg><def/></svg>');
	});

	it('rm-unnecessary', async () => {
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
		createXML(dom).should.equal('<svg><title/></svg>');
	});

	it('rm-px', async () => {
		const xml = '<svg width="1000px" viewBox="0 0 1000 800" version="1.1" style="height:800px"><style>rect {height: 20px}</style><rect width="0em" style="height:0pt;fill:red" id="r;1px"/></svg>';
		const dom = await parse(xml);
		await combineStyle(dom);
		await rmPx(dom);
		createXML(dom).should.equal('<svg width="1000" viewBox="0 0 1000 800" version="1.1" style="height:800"><style>rect{height:20}</style><rect width="0" style="height:0;fill:red" id="r;1px"/></svg>');
	});
});
