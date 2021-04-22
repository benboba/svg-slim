import { mergeConfig } from "../../src/config/merge";
import { checkGeometry } from "../../src/style/check-geometry";

describe('style/check-geometry', () => {

	test('check geometry', () => {
		const config1 = mergeConfig({
			browsers: ['> 0.5%', 'not ie 11', 'not firefox < 99', 'not and_ff < 99']
		});
		expect(checkGeometry('rect', 'x', config1.browsers)).toBe(true);
    });
});
