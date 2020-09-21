import { mergeConfig } from '../../src/config/merge';

describe('合并配置项', () => {
	test('merge null', () => {
		const config = mergeConfig(null);
		expect(config).toHaveProperty('browsers');
		expect(config).toHaveProperty('params');
		expect(config).toHaveProperty('rules');
	});

	test('merge params', () => {
		expect(mergeConfig({
			params: {
				sizeDigit: null,
				opacityDigit: NaN,
			},
		}).params.sizeDigit).toBe(2);
	});

	test('merge rules', () => {
		expect(mergeConfig({
			rules: {
				'rm-unnecessary': [true, {
					tags: 'title',
				}],
			},
		}).rules['rm-unnecessary']).toHaveProperty([1, 'tags']);
	});
});
