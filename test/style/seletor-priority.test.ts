import { getSelectorPriority, overrideAble } from '../../src/style/seletor-priority';

describe('style/seletor-priority', () => {
	test('获取权重', () => {
		expect(getSelectorPriority([{
			type: 'a',
			id: ['a', 'b'],
			class: ['a'],
			attr: [],
			pseudo: [{
				func: 'hover',
				isClass: true,
			}],
		}])).toEqual({
			id: 2,
			class: 2,
			tag: 1
		});

		expect(getSelectorPriority([{
			id: [],
			class: [],
			attr: [{
				key: 'x'
			}],
			pseudo: [],
		}])).toEqual({
			id: 0,
			class: 1,
			tag: 0
		});
	});

	test('权重比较', () => {
		expect(overrideAble({
			id: 0,
			class: 100,
			tag: 100,
		}, {
			id: 1,
			class: 0,
			tag: 0
		})).toBeFalsy;

		expect(overrideAble({
			id: 0,
			class: 0,
			tag: 100,
		}, {
			id: 0,
			class: 1,
			tag: 0
		})).toBeFalsy;

		expect(overrideAble({
			id: 0,
			class: 0,
			tag: 1,
		}, {
			id: 0,
			class: 0,
			tag: 0
		})).toBeTruthy;

		expect(overrideAble({
			id: 0,
			class: 0,
			tag: 1,
		}, {
			id: 0,
			class: 0,
			tag: 1
		})).toBeTruthy;
	});
});
