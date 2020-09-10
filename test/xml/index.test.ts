const chai = require('chai');
const should = chai.should();
import { ITagNode, parse } from 'svg-vdom';
import { createXML } from '../../src/xml/create';

describe('xml/create', () => {
	it('create xml', async () => {
		createXML(null).should.equal('');
		const dom = await parse('<svg><!-- test --><!--     --></svg>');
		createXML(dom).should.equal('<svg><!--test--></svg>');
	});
});
