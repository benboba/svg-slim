const chai = require('chai');
const should = chai.should();
import { getSelectorPriority, overrideAble } from '../../src/style/seletor-priority';


describe('style/seletor-priority', () => {
	it('获取权重', () => {
		getSelectorPriority([{
			type: 'a',
			id: ['a', 'b'],
			class: ['a'],
			attr: [],
			pseudo: [{
				func: 'hover',
				isClass: true,
			}],
		}]).should.deep.equal({
			id: 2,
			class: 2,
			tag: 1
		});

		getSelectorPriority([{
			id: [],
			class: [],
			attr: [{
				key: 'x'
			}],
			pseudo: [],
		}]).should.deep.equal({
			id: 0,
			class: 1,
			tag: 0
		});
	});

	it('权重比较', () => {
		overrideAble({
			id: 0,
			class: 100,
			tag: 100,
		}, {
			id: 1,
			class: 0,
			tag: 0
		}).should.equal(false);

		overrideAble({
			id: 0,
			class: 0,
			tag: 100,
		}, {
			id: 0,
			class: 1,
			tag: 0
		}).should.equal(false);

		overrideAble({
			id: 0,
			class: 0,
			tag: 1,
		}, {
			id: 0,
			class: 0,
			tag: 0
		}).should.equal(true);

		overrideAble({
			id: 0,
			class: 0,
			tag: 1,
		}, {
			id: 0,
			class: 0,
			tag: 1
		}).should.equal(true);
	});
});
