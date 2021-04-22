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

	test('merge browsers', () => {
		const config1 = mergeConfig({
			browsers: ['> 1%', 'ie 11', 'firefox 88']
		});
		const config2 = mergeConfig({
			browsers: ['> 0.5%', 'not ie 11', 'not firefox < 99']
		});
		expect(config1.browsers).toHaveProperty('ie');
		expect(config1.browsers).toHaveProperty('firefox');
		expect(config2.browsers).not.toHaveProperty('ie');
		expect(config2.browsers).not.toHaveProperty('firefox');
	});
});
