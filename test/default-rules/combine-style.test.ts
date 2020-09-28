import { combineStyle } from '../../src/default-rules/combine-style';
import { createXML } from '../../src/xml/create';
import { parse } from 'svg-vdom';


describe('default-rules/combine-style', () => {
	test('合并 style 标签', async () => {
		const xml = '<svg><style >#id{fill:red}</style><script >console.log(1)</script><g><style>.class{fill:blue}</style><script>console.log(2);</script></g></svg>';
		const dom = await parse(xml);
		await combineStyle(dom);
		expect(createXML(dom)).toBe('<svg><style>#id{fill:red}.class{fill:blue}</style><script>console.log(1)</script><g><script>console.log(2);</script></g></svg>');
	});

	test('CDATA 分支', async () => {
		const xml = '<svg><style ><![CDATA[#id{font-family:"<"}]]></style><script >console.log(1)</script><g><style>.class{fill:blue}</style></g></svg>';
		const dom = await parse(xml);
		await combineStyle(dom);
		expect(createXML(dom)).toBe('<svg><style><![CDATA[#id{font-family:"<"}.class{fill:blue}]]></style><script>console.log(1)</script><g/></svg>');
	});

	test('移除非文本子节点 && 移除空 style 标签 && 移除非法 type', async () => {
		const xml = '<svg><style type="test">#id{fill:blue}</style><style ><b>123</b></style><script >console.log(1)</script><g><style><![CDATA[]]></style></g></svg>';
		const dom = await parse(xml);
		await combineStyle(dom);
		expect(createXML(dom)).toBe('<svg><script>console.log(1)</script><g/></svg>');
	});
});
