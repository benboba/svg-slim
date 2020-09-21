import { idChar, classChar, attrChar, pseudoChar } from '../../src/const/regs';

describe('const/regs', () => {
	test('id', async () => {
		const reg = new RegExp(idChar);
		expect(reg.test('#abc')).toBeFalsy;
		expect(reg.test('##')).toBeFalsy;
		expect(reg.test('#')).toBeFalsy;
		expect(reg.test('#.')).toBeFalsy;
		expect(reg.test('123')).toBeFalsy;
	});

	test('class', async () => {
		const reg = new RegExp(classChar);
		expect(reg.test('.abc')).toBeTruthy;
		expect(reg.test('.#')).toBeFalsy;
		expect(reg.test('.')).toBeFalsy;
		expect(reg.test('..')).toBeFalsy;
		expect(reg.test('123')).toBeFalsy;
	});

	test('attr', async () => {
		const reg = new RegExp(attrChar);
		expect(reg.test('[a]')).toBeTruthy;
		expect(reg.test('[a=b]')).toBeTruthy;
		expect(reg.test('[a=""]')).toBeTruthy;
		expect(reg.test('[a="\'"]')).toBeTruthy;
		expect(reg.test('[a="[]"]')).toBeTruthy;
		expect(reg.test('[a=\'b\']')).toBeTruthy;
		expect(reg.test('[a^=b]')).toBeTruthy;
		expect(reg.test('[a$=b]')).toBeTruthy;
		expect(reg.test('[a|=b]')).toBeTruthy;
		expect(reg.test('[a~=b]')).toBeTruthy;
		expect(reg.test('[a*=b]')).toBeTruthy;
		expect(reg.test('[a=]')).toBeFalsy;
		expect(reg.test('[=a]')).toBeFalsy;
		expect(reg.test('123')).toBeFalsy;
	});

	test('pseudo', async () => {
		const reg = new RegExp(`^${pseudoChar}$`);
		expect(reg.test(':a')).toBeTruthy;
		expect(reg.test(':a(b)')).toBeTruthy;
		expect(reg.test('::a-b')).toBeTruthy;
		expect(reg.test('::a-b(c)')).toBeTruthy;
		expect(reg.test('::a-b(:d)')).toBeTruthy;
		expect(reg.test('::a-b(:d-e("f"))')).toBeTruthy;
		expect(reg.test(':a()')).toBeFalsy;
		expect(reg.test(':a(')).toBeFalsy;
		expect(reg.test(':123')).toBeFalsy;
		expect(reg.test('123')).toBeFalsy;
	});
});
