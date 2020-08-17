const chai = require('chai');
const should = chai.should();
import { getBySelector } from '../../../src/slimming/xml/get-by-selector';
import { parse } from '../../../src/xml-parser';


describe('xml/get-by-selector', () => {
	it('exec style tree', async () => {
		const dom = await parse(`<svg>
		<g><ellipse/><rect/><rect/></g>
		</svg>`) as ITagNode;

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'g',
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
		}])[0].nodeName.should.equal('ellipse');

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'a',
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
		}]).length.should.equal(0);

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'g',
			combinator: 1,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
		}])[0].nodeName.should.equal('ellipse');

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'a',
			combinator: 1,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
		}]).length.should.equal(0);

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
			combinator: 2,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'rect',
		}])[0].nodeName.should.equal('rect');

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'a',
			combinator: 2,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'rect',
		}]).length.should.equal(0);

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'a',
			combinator: 2,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
		}]).length.should.equal(0);

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
			combinator: 3,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'rect',
		}]).length.should.equal(2);

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
			combinator: 3,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'ellipse',
		}]).length.should.equal(0);

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'a',
			combinator: 3,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'rect',
		}]).length.should.equal(0);
	});

	it('match root elem', async () => {
		const dom = await parse(`<svg>
		<g><ellipse/><rect/><rect/></g>
		</svg>`) as ITagNode;

		dom.childNodes[0].parentNode = void 0;

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'g',
			combinator: 1,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'svg',
		}]).length.should.equal(0);

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'g',
			combinator: 2,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'svg',
		}]).length.should.equal(0);

		getBySelector(dom, [{
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'g',
			combinator: 3,
		}, {
			id: [],
			class: [],
			attr: [],
			pseudo: [],
			type: 'svg',
		}]).length.should.equal(0);
	});
});
