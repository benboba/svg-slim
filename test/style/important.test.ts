import { parseStyle } from '../../src/style/parse';
import { stringifyStyle } from '../../src/style/stringify';

describe('style/important', () => {
	const style = parseStyle('color: red!important;content: "";!important');

	test('important parse', () => {
		expect(style.length).toBe(2);
		expect(style[0]).toEqual({
			fullname: 'color',
			important: true,
			name: 'color',
			value: 'red',
		});
		expect(style[1]).toEqual({
			fullname: 'content',
			important: false,
			name: 'content',
			value: '""',
		});
	});

	test('important stringify', () => {
		expect(stringifyStyle(style)).toBe('color:red!important;content:""');
	});
});
