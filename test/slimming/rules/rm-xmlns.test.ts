import chai = require('chai');
const should = chai.should();
import { rmXMLNS } from '../../../src/slimming/rules/rm-xmlns';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


describe('rules/rm-xmlns', () => {
	it('rule false branch', async () => {
		const xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xml="http://www.w3.org/XML/1998/namespace">
        <a xlink:href="http://localhost"><s:text>123</s:text></a>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await rmXMLNS([false], dom);
		createXML(dom).should.equal('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xml="http://www.w3.org/XML/1998/namespace"> <a xlink:href="http://localhost"><s:text>123</s:text></a> </svg>');
	});

	it('移除不必要的 xml 命名空间', async () => {
        const xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xml="http://www.w3.org/XML/1998/namespace">
        <a xlink:href="http://localhost" xx:title=""><s:text>123</s:text><b:text></b:text></a>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await rmXMLNS([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:s="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="http://localhost"><s:text>123</s:text></a></svg>');
	});
});
