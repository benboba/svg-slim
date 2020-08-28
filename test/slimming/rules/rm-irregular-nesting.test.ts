const chai = require('chai');
const should = chai.should();
import { createRuleConfig } from '../../../src/slimming/config/create-rule-config';
import { mergeConfig } from '../../../src/slimming/config/merge';
import { rmIrregularNesting } from '../../../src/slimming/rules/rm-irregular-nesting';
import { createXML } from '../../../src/slimming/xml/create';
import { parse } from '../../../src/xml-parser';
import { IDomNode } from '../../../typings/node';

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
		const dom = await parse(xml) as IDomNode;
		const config = createRuleConfig(mergeConfig({
			rules: {
				'rm-irregular-nesting': [true, {
					ignore: ['rect'],
				}],
			},
		}), 'rm-irregular-nesting');
		await rmIrregularNesting(dom, config);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><desc><circle></circle><a/></desc><rect><a><g/></a></rect><switch><a><line/></a></switch></svg>');
	});
});
