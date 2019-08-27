import chai = require('chai');
const should = chai.should();
import { collapseQuot } from '../../src/xml-parser/utils';

describe('XML_PARSER 工具函数', () => {
	it('空字符串', () => {
		collapseQuot('""').should.equal('');
	});

	it('非空字符串', () => {
		collapseQuot('"abc"').should.equal('abc');
	});
});
