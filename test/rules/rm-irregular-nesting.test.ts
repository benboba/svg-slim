const chai = require('chai');
const should = chai.should();
import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { rmIrregularNesting } from '../../src/rules/rm-irregular-nesting';
import { createXML } from '../../src/xml/create';

describe('rules/rm-irregular-nesting', () => {
	it('移除不正确的嵌套', async () => {
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
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><desc><circle></circle><a/></desc><rect/><switch><a><line/></a></switch></svg>');
	});
});
