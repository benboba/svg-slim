import chai = require('chai');
const should = chai.should();
import { matchSelector } from '../../../src/slimming/style/match-selector';
import { parse } from '../../../src/xml-parser/app';

describe('style/match-selector', () => {
	it('参数缺失的情况', () => {
		matchSelector()().should.equal(false);
	});

	it('empty Match', async () => {
		const xml = `<rect class="a b c"/>`;
		const dom = await parse(xml) as ITagNode;
		matchSelector({
			attr: [],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);
	});

	it('class Match', async () => {
		const xml = `<rect class="a b c"/>`;
		const dom = await parse(xml) as ITagNode;
		matchSelector({
			attr: [],
			class: ['a', 'c'],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);
		matchSelector({
			attr: [],
			class: ['b', 'd'],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(false);
	});

	it('attr Match', async () => {
		const xml = `<rect a="a"/>`;
		const dom = await parse(xml) as ITagNode;
		matchSelector({
			attr: [{
				key: 'a'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [{
				key: 'b'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(false);

		matchSelector({
			attr: [{
				key: 'a',
				value: 'a'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [{
				key: 'a',
				value: 'b'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(false);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 1,
				value: 'a'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 1,
				value: 'b'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(false);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 2,
				value: 'a'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 2,
				value: 'b'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(false);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 3,
				value: 'a'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 3,
				value: 'b'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(false);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 4,
				value: 'a'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 4,
				value: 'b'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(false);

		matchSelector()(dom.childNodes[0]).should.equal(false);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 5,
				value: 'a'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [{
				key: 'a',
				modifier: 5,
				value: 'b'
			}],
			class: [],
			id: [],
			pseudo: []
		})(dom.childNodes[0]).should.equal(false);
	});

	it('pseudo Match', async () => {
		const xml1 = `<text class="a b c"/>`;
		const xml2 = `<g><rect/></g>`;
		const xml3 = `<g><text/></g>`;
		const dom1 = await parse(xml1) as ITagNode;
		const dom2 = await parse(xml2) as ITagNode;
		const dom3 = await parse(xml3) as ITagNode;
		matchSelector({
			attr: [],
			class: [],
			id: [],
			pseudo: [{
				func: 'hover',
				isClass: true,
			}],
		})(dom1.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [],
			class: [],
			id: [],
			pseudo: [{
				func: 'first-letter',
				isClass: false,
			}]
		})(dom1.childNodes[0]).should.equal(true);

		matchSelector({
			attr: [],
			class: [],
			id: [],
			pseudo: [{
				func: 'first-letter',
				isClass: false,
			}]
		})(dom2.childNodes[0]).should.equal(false);

		matchSelector({
			attr: [],
			class: [],
			id: [],
			pseudo: [{
				func: 'first-letter',
				isClass: false,
			}]
		})(dom3.childNodes[0]).should.equal(true);
	});
});
