const chai = require('chai');
const should = chai.should();
import { combineStyle } from '../../src/default-rules/combine-style';
import { createXML } from '../../src/xml/create';
import { parse } from 'svg-vdom';


describe('default-rules/combine-style', () => {
	it('合并 style 标签', async () => {
		const xml = '<svg><style >#id{fill:red}</style><script >console.log(1)</script><g><style>.class{fill:blue}</style><script>console.log(2);</script></g></svg>';
		const dom = await parse(xml);
		await combineStyle(dom);
		createXML(dom).should.equal('<svg><style>#id{fill:red}.class{fill:blue}</style><script>console.log(1)</script><g><script>console.log(2);</script></g></svg>');
	});

	it('CDATA 分支', async () => {
		const xml = '<svg><style ><![CDATA[#id{font-family:"<"}]]></style><script >console.log(1)</script><g><style>.class{fill:blue}</style></g></svg>';
		const dom = await parse(xml);
		await combineStyle(dom);
		createXML(dom).should.equal('<svg><style><![CDATA[#id{font-family:"<"}.class{fill:blue}]]></style><script>console.log(1)</script><g/></svg>');
	});

	it('移除非文本子节点 && 移除空 style 标签 && 移除非法 type', async () => {
		const xml = '<svg><style type="test">#id{fill:blue}</style><style ><b>123</b></style><script >console.log(1)</script><g><style><![CDATA[]]></style></g></svg>';
		const dom = await parse(xml);
		await combineStyle(dom);
		createXML(dom).should.equal('<svg><script>console.log(1)</script><g/></svg>');
	});
});