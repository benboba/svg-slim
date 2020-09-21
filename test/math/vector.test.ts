import { Vector } from '../../src/math/vector';

describe('二维向量', () => {
	test('向量求值及标准化失败', () => {
		const v = new Vector();
		expect(v.valueOf()).toBe(0);
		expect(v.toString()).toBe('[0,0]');
		try {
			v.normalize();
		} catch (err) {
			expect(err.message).toBe('零向量无法标准化！');
		}
	});

	test('零向量', () => {
		expect(new Vector().isZero).toBeTruthy;
		const v = new Vector(1, 1);
		expect(v.isZero).toBeFalsy;
		expect(v.zero().isZero).toBeTruthy;
	});

	test('取模及单位向量判断', () => {
		const v = new Vector(1, 1);
		expect(v.modulo).toBe(Vector.Rounding(Math.sqrt(2)));
		expect(v.isNormalize).toBeFalsy;
		expect(v.normalize().isNormalize).toBeTruthy;
		v.modulo = Math.sqrt(8);
		expect(Vector.Rounding(v.x)).toBe(2);
		expect(Vector.Rounding(v.y)).toBe(2);
	});

	test('加减法', () => {
		const v1 = new Vector(2, 2);
		const v2 = new Vector(3, 3);
		expect(v1.add(v2).x).toBe(5);
		expect(v1.substract(v2).y).toBe(2);
		expect(Vector.add(v1, v2).x).toBe(5);
		expect(Vector.substract(v1, v2).y).toBe(-1);
	});

	test('乘法', () => {
		const v1 = new Vector(2, 3);
		const v2 = new Vector(3, 2);
		expect(Vector.multiplied(v1, v2)).toBe(12);
		expect(v1.multiplied(2).x).toBe(4);
		expect(v1.y).toBe(6);
		expect(v1.multiplied(v2)).toBe(24);
		expect(Vector.multiplied(v1, -3).y).toBe(-18);
	});

	test('旋转和求夹角', () => {
		const v1 = new Vector(0, 3);
		const v2 = new Vector(5, 5);
		v1.rotate(Math.PI / 2);
		expect(Vector.Rounding(v1.x)).toBe(-3);
		expect(Vector.Rounding(v1.y)).toBe(0);

		expect(v1.angel(v2)).toBe(135);
		expect(v2.angel(v1)).toBe(135);
		expect(v1.zero().angel(v2)).toBeNaN;
		expect(v2.radian(v1)).toBeNaN;
	});

	test('求距离', () => {
		const v1 = new Vector(0, 3);
		const v2 = new Vector(4, 6);
		expect(Vector.distance(v1, v2)).toBe(5);
	});

	test('投影和垂直分量', () => {
		const v1 = new Vector(1, 0);
		const v2 = new Vector(234, 68);
		expect(Vector.projected(v2, v1).x).toBe(234);
		expect(Vector.plumb(v2, v1).y).toBe(68);
		expect(Vector.projected(v2, v1.zero()).isZero).toBeTruthy;
		expect(Vector.plumb(v1, v2).isZero).toBeTruthy;
		expect(Vector.plumb(v2, v1)).toEqual(v2);
	});
});
