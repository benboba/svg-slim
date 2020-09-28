import { legalValue } from '../../src/validate/legal-value';
import { regularAttr } from '../../src/const/regular-attr';

describe('validate/user-mix', () => {
	test('user mix', () => {
		expect(legalValue(regularAttr['font-variant'], {
			name: 'font-variant',
			fullname: 'font-variant',
			value: 'common-ligatures no-common-ligatures',
		})).toBeFalsy;

		expect(legalValue(regularAttr['font-variant'], {
			name: 'font-variant',
			fullname: 'font-variant',
			value: 'common-ligatures discretionary-ligatures full-width lining-nums ruby ordinal',
		})).toBeTruthy;

		expect(legalValue(regularAttr['font-variant'], {
			name: 'font-variant',
			fullname: 'font-variant',
			value: 'common-ligatures discretionary-ligatures full-width lining-nums ruby ordinal undef',
		})).toBeFalsy;
	});
});
