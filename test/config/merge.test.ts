const chai = require('chai');
const should = chai.should();
import { mergeConfig } from '../../src/config/merge';

describe('合并配置项', () => {
	it('merge null', () => {
		mergeConfig(null).should.have.all.keys({ 'browsers': 1, 'params': 1, 'rules': 1 });
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
