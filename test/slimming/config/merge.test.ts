const chai = require('chai');
const should = chai.should();
import { mergeConfig } from '../../../src/slimming/config/merge';

describe('合并配置项', () => {
	it('merge null', () => {
		mergeConfig(null).should.have.all.keys({ 'env': 1, 'params': 1, 'rules': 1 });
	});

	it('merge env', () => {
		mergeConfig({
			env: {
				ie: 9
			},
		}).env.ie.should.eq(9);

		mergeConfig({
			env: {
				ie: null,
				'opera': 1,
			},
		}).env.should.have.all.keys({
			ie: 1,
		});

		mergeConfig({
			env: {
				'opera': 1,
			},
		}).env.should.have.all.keys({
			ie: 1,
		});
	});

	it('merge params', () => {
		mergeConfig({
			params: {
				sizeDigit: null,
				opacityDigit: NaN,
			},
		}).params.sizeDigit.should.eq(2);
	});

	it('merge rules', () => {
		mergeConfig({
			rules: {
				'rm-unnecessary': [true, {
					tags: 'title',
				}],
			},
		}).rules['rm-unnecessary'].should.have.nested.property('1.tags');
	});
});
