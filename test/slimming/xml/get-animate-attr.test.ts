const chai = require('chai');
const should = chai.should();
import { getAnimateAttr, checkAnimateAttr, findAnimateAttr } from '../../../src/slimming/xml/get-animate-attr';
import { parse } from '../../../src/xml-parser';

describe('xml/get-animate-attr', () => {
	it('get-animate-attr', async () => {
		const dom = await parse(`<svg>
		<animate from="0" to="100" by="5" values=";   ;40;60;80;" attributeName="x"/>
		</svg>`) as ITagNode;
		const animateAttr = getAnimateAttr((dom.childNodes as ITagNode[])[0]);
		animateAttr[0].should.deep.include({
			attributeName: 'x',
			keys: ['from', 'to', 'by', 'values'],
			values: ['0', '100', '5', '40', '60', '80'],
		});
		checkAnimateAttr(animateAttr, 'y').should.equal(false);
		checkAnimateAttr(animateAttr, 'x', (v: string) => v === '15').should.equal(false);
		checkAnimateAttr(animateAttr, 'x').should.equal(true);
		checkAnimateAttr(animateAttr, 'x', (v: string) => parseFloat(v) > 90).should.equal(true);
		findAnimateAttr(animateAttr, 'y').length.should.equal(0);
		findAnimateAttr(animateAttr, 'x').length.should.equal(1);
	});

	it('coverage', async () => {
		const dom = await parse(`<svg>
		<animateTransform from="0" attributeName="tranform"/>
		<animateTransform to="10" attributeName="patternTransform"/>
		<animateTransform to="10" attributeName="x"/>
		<animate by="5"/>
		</svg>`) as ITagNode;
		const animateAttr = getAnimateAttr((dom.childNodes as ITagNode[])[0]);
		animateAttr[0].should.deep.include({
			attributeName: 'tranform',
			keys: ['from'],
			values: ['0'],
		});
		animateAttr[1].should.deep.include({
			attributeName: 'patternTransform',
			keys: ['to'],
			values: ['10'],
		});
		animateAttr.length.should.equal(2);
	});
});
