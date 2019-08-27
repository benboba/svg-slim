import chai = require('chai');
const should = chai.should();
import { combineStyle } from '../../../src/slimming/default-rules/combine-style';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


describe('default-rules/combine-style', () => {
	it('合并 style 标签', async () => {
		const xml = '<svg><style >#id{fill:red}</style><script >console.log(1)</script><g><style>.class{fill:blue}</style><script>console.log(2);</script></g></svg>';
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		createXML(dom).should.equal('<svg><style>#id{fill:red}.class{fill:blue}</style><script>console.log(1)</script><g><script>console.log(2);</script></g></svg>');
	});

	it('CDATA 分支', async () => {
		const xml = '<svg><style ><![CDATA[#id{content:"<"}]]></style><script >console.log(1)</script><g><style>.class{fill:blue}</style></g></svg>';
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		createXML(dom).should.equal('<svg><style><![CDATA[#id{content:"<"}.class{fill:blue}]]></style><script>console.log(1)</script><g/></svg>');
	});

	it('移除非文本子节点 && 移除空 style 标签', async () => {
		const xml = '<svg><style ><b>123</b></style><script >console.log(1)</script><g><style><![CDATA[]]></style></g></svg>';
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		createXML(dom).should.equal('<svg><script>console.log(1)</script><g/></svg>');
	});
});
