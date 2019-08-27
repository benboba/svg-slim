import chai = require('chai');
const should = chai.should();
import { legalValue } from '../../../src/slimming/validate/legal-value';
import { regularAttr } from '../../../src/slimming/const/regular-attr';


describe('validate/legal-value', () => {
	it('value is legal', () => {
		legalValue(regularAttr['x'], {
            name: 'x',
            fullname: 'x',
            value: '10'
        }).should.equal(true);

		legalValue(regularAttr['x'], {
            name: 'x',
            fullname: 'x',
            value: '10'
        }, 'rect').should.equal(true);

		legalValue(regularAttr['x'], {
            name: 'x',
            fullname: 'x',
            value: '10'
        }, 'g').should.equal(false);

		legalValue(regularAttr['alignment-baseline'], {
            name: 'alignment-baseline',
            fullname: 'alignment-baseline',
            value: '10'
        }, 'tspan').should.equal(false);

		legalValue(regularAttr['attributeName'], {
            name: 'attributeName',
            fullname: 'attributeName',
            value: 'attributeName'
        }, 'tspan').should.equal(false);

		legalValue(regularAttr['attributeName'], {
            name: 'attributeName',
            fullname: 'attributeName',
            value: 'x'
        }, 'tspan').should.equal(true);

		legalValue(regularAttr['origin'], {
            name: 'origin',
            fullname: 'origin',
            value: 'default'
        }, 'tspan').should.equal(true);

		legalValue(regularAttr['origin'], {
            name: 'origin',
            fullname: 'origin',
            value: 'undefined'
        }, 'tspan').should.equal(false);
	});
});
