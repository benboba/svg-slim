import { legalValue } from '../../src/validate/legal-value';
import { regularAttr } from '../../src/const/regular-attr';

describe('validate/legal-value', () => {
	test('value is legal', () => {
		expect(legalValue(regularAttr.x, {
			name: 'x',
			fullname: 'x',
			value: '10',
		})).toBeTruthy;

		expect(legalValue(regularAttr.x, {
			name: 'x',
			fullname: 'x',
			value: '10',
		}, 'rect')).toBeTruthy;

		expect(legalValue(regularAttr.x, {
			name: 'x',
			fullname: 'x',
			value: '10',
		}, 'g')).toBeFalsy;

		expect(legalValue(regularAttr.attributeName, {
			name: 'attributeName',
			fullname: 'attributeName',
			value: 'attributeName',
		}, 'tspan')).toBeFalsy;

		expect(legalValue(regularAttr.attributeName, {
			name: 'attributeName',
			fullname: 'attributeName',
			value: 'x',
		}, 'tspan')).toBeTruthy;

		expect(legalValue(regularAttr.origin, {
			name: 'origin',
			fullname: 'origin',
			value: 'default',
		}, 'tspan')).toBeFalsy;

		expect(legalValue(regularAttr.accumulate, {
			name: 'accumulate',
			fullname: 'accumulate',
			value: 'sum',
		})).toBeTruthy;

		expect(legalValue(regularAttr.accumulate, {
			name: 'accumulate',
			fullname: 'accumulate',
			value: 'some',
		})).toBeFalsy;

		expect(legalValue(regularAttr.calcMode, {
			name: 'calcMode',
			fullname: 'calcMode',
			value: 'linear',
		})).toBeTruthy;

		expect(legalValue(regularAttr.calcMode, {
			name: 'calcMode',
			fullname: 'calcMode',
			value: 'radiant',
		})).toBeFalsy;
	});
});
