const chai = require('chai');
const should = chai.should();
import { idChar, classChar, attrChar, pseudoChar } from '../../../src/slimming/const/regs';

describe('const/regs', () => {
	it('id', async () => {
		const reg = new RegExp(idChar);
		reg.test('#abc').should.equal(true);
		reg.test('##').should.equal(false);
		reg.test('#').should.equal(false);
		reg.test('#.').should.equal(false);
		reg.test('123').should.equal(false);
	});

	it('class', async () => {
		const reg = new RegExp(classChar);
		reg.test('.abc').should.equal(true);
		reg.test('.#').should.equal(false);
		reg.test('.').should.equal(false);
		reg.test('..').should.equal(false);
		reg.test('123').should.equal(false);
	});

	it('attr', async () => {
		const reg = new RegExp(attrChar);
		reg.test('[a]').should.equal(true);
		reg.test('[a=b]').should.equal(true);
		reg.test('[a=""]').should.equal(true);
		reg.test(`[a="'"]`).should.equal(true);
		reg.test('[a="[]"]').should.equal(true);
		reg.test("[a='b']").should.equal(true);
		reg.test('[a^=b]').should.equal(true);
		reg.test('[a$=b]').should.equal(true);
		reg.test('[a|=b]').should.equal(true);
		reg.test('[a~=b]').should.equal(true);
		reg.test('[a*=b]').should.equal(true);
		reg.test('[a=]').should.equal(false);
		reg.test('[=a]').should.equal(false);
		reg.test('123').should.equal(false);
	});

	it('pseudo', async () => {
		const reg = new RegExp(`^${pseudoChar}$`);
		reg.test(':a').should.equal(true);
		reg.test(':a(b)').should.equal(true);
		reg.test('::a-b').should.equal(true);
		reg.test('::a-b(c)').should.equal(true);
		reg.test('::a-b(:d)').should.equal(true);
		reg.test('::a-b(:d-e("f"))').should.equal(true);
		reg.test(':a()').should.equal(false);
		reg.test(':a(').should.equal(false);
		reg.test(':123').should.equal(false);
		reg.test('123').should.equal(false);
	});
});
