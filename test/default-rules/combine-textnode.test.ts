import { combineTextNode } from '../../src/default-rules/combine-textnode';
import { clearTextNode } from '../../src/default-rules/clear-textnode';
import { createXML } from '../../src/xml/create';
import { parse } from 'svg-vdom';

describe('default-rules/combine-textnode', () => {
	test('合并文本节点', async () => {
		const xml = `<svg>
			<text   >
			1
			<![CDATA[abc]]>
			2
				<notext>    </notext>
			</text   >
		</svg>`;
		const dom = await parse(xml);
		await clearTextNode(dom);
		await combineTextNode(dom);
		expect(createXML(dom)).toBe('<svg><text> 1 abc 2 <notext/> </text></svg>');
	});

	test('移除不必要的文本节点 && 移除不应存在的文本节点', async () => {
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
		const dom = await parse(xml);
		await clearTextNode(dom);
		expect(createXML(dom)).toBe('<svg><style>#id{fill:red}</style><script>console.log(1)</script><g><style>.class{fill:blue}</style><script>console.log(2);</script></g></svg>');
	});
});
