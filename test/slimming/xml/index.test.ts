const chai = require('chai');
const should = chai.should();
import { createXML } from '../../../src/slimming/xml/create';
import { getById } from '../../../src/slimming/xml/get-by-id';
import { rmNode } from '../../../src/slimming/xml/rm-node';
import { parse } from '../../../src/xml-parser/app';


describe('xml/create', () => {
	it('create xml', async () => {
        createXML(null).should.equal('');
		const dom = await parse('<svg><!-- test --><!--     --><![INCLUDE[]]></svg>') as ITagNode;
        createXML(dom).should.equal('<svg><!--test--></svg>');
    });

	it('get by ID', async () => {
        const dom = await parse('<svg><text id="a"/><rect id="a"/></svg>') as ITagNode;
        (getById('#a', dom) as ITagNode).should.equal((dom.childNodes as ITagNode[])[0].childNodes[0]);
    });

	it('rm node', async () => {
        const dom = await parse('<svg><text id="a"/><rect id="a"/></svg>') as ITagNode;
        const str = createXML(dom);
        rmNode(dom);
        createXML(dom).should.equal(str);
    });
});
