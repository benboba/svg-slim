const chai = require('chai');
const should = chai.should();
import { rmIrregularNesting } from '../../../src/slimming/rules/rm-irregular-nesting';
import { parse } from '../../../src/xml-parser';
import { createXML } from '../../../src/slimming/xml/create';

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
		await rmIrregularNesting(dom, { option: { ignore: ['rect'] } });
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><desc><circle></circle><a/></desc><rect><a><g/></a></rect><switch><a><line/></a></switch></svg>');
	});
});
