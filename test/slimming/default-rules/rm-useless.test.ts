import chai = require('chai');
const should = chai.should();
import { rmUseless } from '../../../src/slimming/default-rules/rm-useless';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';


describe('default-rules/combine-useless', () => {
	it('移除 Other Section 和 Other Declare 节点', async () => {
		const xml = '<svg><!ENTITY nbsp "&#xA0;"><![ENTITY[test 1234]]></svg>';
		const dom = await parse(xml) as IDomNode;
		await rmUseless(dom);
		createXML(dom).should.equal('<svg/>');
	});
});
