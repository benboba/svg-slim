const chai = require('chai');
const should = chai.should();
import { combineTextNode } from '../../../src/slimming/default-rules/combine-textnode';
import { createXML } from '../../../src/slimming/xml/create';
import { parse } from '../../../src/xml-parser';
import { IDomNode } from '../../../typings/node';

describe('default-rules/combine-textnode', () => {
	it('合并文本节点', async () => {
		const xml = `<svg>
			<text   >
			1
			<![CDATA[abc]]>
			2
				<notext>    </notext>
			</text   >
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await combineTextNode(dom);
		createXML(dom).should.equal('<svg><text> 1 abc 2 <notext/></text></svg>');
	});

	it('移除不必要的文本节点 && 移除不应存在的文本节点', async () => {
		const xml = `<svg>
			<style>#id{fill:red}</style>
			<script>console.log(1)</script>
			<g>
			aksfjsdjflkajsdfkl
				<style>.class{fill:blue}</style>
				<script>console.log(2);</script>
				<![CDATA[asdfl;ks;adf]]>
			</g>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		await combineTextNode(dom);
		createXML(dom).should.equal('<svg><style>#id{fill:red}</style><script>console.log(1)</script><g><style>.class{fill:blue}</style><script>console.log(2);</script></g></svg>');
	});
});
