import chai = require('chai');
const should = chai.should();
import { getAnimateAttr, checkAnimateAttr } from '../../../src/slimming/xml/get-animate-attr';
import { parse } from '../../../src/xml-parser/app';

describe('xml/get-animate-attr', () => {
	it('get-animate-attr', async () => {
		const dom = await parse(`<svg>
		<animate from="0" to="100" by="5" values=";   ;40;60;80;" attributeName="x"/>
		</svg>`) as ITagNode;
		const animateAttr = getAnimateAttr((dom.childNodes as ITagNode[])[0]);
		animateAttr.should.deep.equal([{
			attributeName: 'x',
			value: ['0', '100', '5', '40', '60', '80'],
		}]);
		checkAnimateAttr(animateAttr, 'y').should.equal(false);
		checkAnimateAttr(animateAttr, 'x', (v: string) => v === '15').should.equal(false);
		checkAnimateAttr(animateAttr, 'x').should.equal(true);
		checkAnimateAttr(animateAttr, 'x', (v: string) => parseFloat(v) > 90).should.equal(true);
	});
});
