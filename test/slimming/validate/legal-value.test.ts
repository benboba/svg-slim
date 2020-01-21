import chai = require('chai');
const should = chai.should();
import { legalValue } from '../../../src/slimming/validate/legal-value';
import { regularAttr } from '../../../src/slimming/const/regular-attr';


describe('validate/legal-value', () => {
	it('value is legal', () => {
		legalValue(regularAttr.x, {
			name: 'x',
			fullname: 'x',
			value: '10',
		}).should.equal(true);

		legalValue(regularAttr.x, {
			name: 'x',
			fullname: 'x',
			value: '10',
		}, 'rect').should.equal(true);

		legalValue(regularAttr.x, {
			name: 'x',
			fullname: 'x',
			value: '10',
		}, 'g').should.equal(false);

		legalValue(regularAttr.attributeName, {
			name: 'attributeName',
			fullname: 'attributeName',
			value: 'attributeName',
		}, 'tspan').should.equal(false);

		legalValue(regularAttr.attributeName, {
			name: 'attributeName',
			fullname: 'attributeName',
			value: 'x',
		}, 'tspan').should.equal(true);

		legalValue(regularAttr.origin, {
			name: 'origin',
			fullname: 'origin',
			value: 'default',
		}, 'tspan').should.equal(false);

		legalValue(regularAttr.accumulate, {
			name: 'accumulate',
			fullname: 'accumulate',
			value: 'sum',
		}).should.equal(true);

		legalValue(regularAttr.accumulate, {
			name: 'accumulate',
			fullname: 'accumulate',
			value: 'some',
		}).should.equal(false);

		legalValue(regularAttr.calcMode, {
			name: 'calcMode',
			fullname: 'calcMode',
			value: 'linear',
		}).should.equal(true);

		legalValue(regularAttr.calcMode, {
			name: 'calcMode',
			fullname: 'calcMode',
			value: 'radiant',
		}).should.equal(false);
	});
});
