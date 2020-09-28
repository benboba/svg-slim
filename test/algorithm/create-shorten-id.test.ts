import { createShortenID } from '../../src/algorithm/create-shorten-id';

describe('短 ID 生成函数', () => {
	test('simple', () => {
		expect(createShortenID(0)).toBe('a');
		expect(createShortenID(1)).toBe('b');
		expect(createShortenID(52)).toBe('_');
		expect(createShortenID(0)).toBe('a');
	});

	test('long', () => {
		expect(createShortenID(100)).toBe('aV');
		expect(createShortenID(1000)).toBe('oZ');
		expect(createShortenID(220000)).toBe('_2R');
	});
});
