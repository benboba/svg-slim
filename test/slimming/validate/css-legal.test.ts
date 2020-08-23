const chai = require('chai');
const should = chai.should();
import { legalValue } from '../../../src/slimming/validate/legal-value';
import { regularAttr } from '../../../src/slimming/const/regular-attr';


describe('validate/legal-value', () => {
	it('css legal', () => {
		legalValue(regularAttr['animation-timing-function'], {
			name: 'animation-timing-function',
			fullname: 'animation-timing-function',
			value: 'step-start',
        }).should.equal(true);

		legalValue(regularAttr['animation-timing-function'], {
			name: 'animation-timing-function',
			fullname: 'animation-timing-function',
			value: 'cubic-bezier(.15, 1.5, .89, 3)',
		}).should.equal(true);

		legalValue(regularAttr['animation-timing-function'], {
			name: 'animation-timing-function',
			fullname: 'animation-timing-function',
			value: 'cubic-bezier(2, 1.5, 1, 3)',
		}).should.equal(false);

		legalValue(regularAttr['animation-timing-function'], {
			name: 'animation-timing-function',
			fullname: 'animation-timing-function',
			value: 'cubic-bezier(.1, 1.5, 3, 3)',
		}).should.equal(false);

		legalValue(regularAttr['animation-timing-function'], {
			name: 'animation-timing-function',
			fullname: 'animation-timing-function',
			value: 'steps(.1)',
		}).should.equal(false);

		legalValue(regularAttr['animation-timing-function'], {
			name: 'animation-timing-function',
			fullname: 'animation-timing-function',
			value: 'steps(0)',
		}).should.equal(false);

		legalValue(regularAttr['animation-timing-function'], {
			name: 'animation-timing-function',
			fullname: 'animation-timing-function',
			value: 'steps(1)',
		}).should.equal(true);

		legalValue(regularAttr['animation-timing-function'], {
			name: 'animation-timing-function',
			fullname: 'animation-timing-function',
			value: 'steps(100, jump-start)',
		}).should.equal(true);
	});
});
