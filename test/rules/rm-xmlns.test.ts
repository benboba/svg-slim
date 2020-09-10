const chai = require('chai');
const should = chai.should();
import { rmXMLNS } from '../../src/rules/rm-xmlns';
import { createXML } from '../../src/xml/create';
import { parse } from 'svg-vdom';

describe('rules/rm-xmlns', () => {
	it('移除不必要的 xml 命名空间', async () => {
		const xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xml="http://www.w3.org/XML/1998/namespace">
		<a xlink:href="http://localhost" xx:title=""><s:text>123</s:text><b:text></b:text></a>
		</svg>`;
		const dom = await parse(xml);
		await rmXMLNS(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="http://localhost"><s:text>123</s:text></a></svg>');
	});
});
