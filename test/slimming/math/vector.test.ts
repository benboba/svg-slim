import chai = require('chai');
const should = chai.should();
import { Vector } from '../../../src/slimming/math/vector';

describe('二维向量', () => {
	it('向量求值及标准化失败', () => {
		const v = new Vector();
		v.valueOf().should.equal(0);
		v.toString().should.equal('[0,0]');
		try {
			v.normalize();
		} catch (err) {
			err.message.should.equal('零向量无法标准化！');
		}
	});

	it('零向量', () => {
		new Vector().isZero.should.equal(true);
		const v = new Vector(1, 1);
		v.isZero.should.equal(false);
		v.zero().isZero.should.equal(true);
	});

	it('取模及单位向量判断', () => {
		const v = new Vector(1, 1);
		v.modulo.should.equal(Vector.Rounding(Math.sqrt(2)));
		v.isNormalize.should.equal(false);
		v.normalize().isNormalize.should.equal(true);
		v.modulo = Math.sqrt(8);
		Vector.Rounding(v.x).should.equal(2);
		Vector.Rounding(v.y).should.equal(2);
	});

	it('加减法', () => {
		const v1 = new Vector(2, 2);
		const v2 = new Vector(3, 3);
		v1.add(v2).x.should.equal(5);
		v1.substract(v2).y.should.equal(2);
		Vector.add(v1, v2).x.should.equal(5);
		Vector.substract(v1, v2).y.should.equal(-1);
	});

	it('乘法', () => {
		const v1 = new Vector(2, 3);
		const v2 = new Vector(3, 2);
		Vector.multiplied(v1, v2).should.equal(12);
		v1.multiplied(2).x.should.equal(4);
		v1.y.should.equal(6);
		v1.multiplied(v2).should.equal(24);
		Vector.multiplied(v1, -3).y.should.equal(-18);
	});

	it('旋转和求夹角', () => {
		const v1 = new Vector(0, 3);
		const v2 = new Vector(5, 5);
		v1.rotate(Math.PI / 2);
		Vector.Rounding(v1.x).should.equal(-3);
		Vector.Rounding(v1.y).should.equal(0);

		v1.angel(v2).should.equal(135);
		v2.angel(v1).should.equal(135);
		v1.zero().angel(v2).should.to.be.NaN;
		v2.radian(v1).should.to.be.NaN;
	});

	it('求距离', () => {
		const v1 = new Vector(0, 3);
		const v2 = new Vector(4, 6);
		Vector.distance(v1, v2).should.equal(5);
	});

	it('投影和垂直分量', () => {
		const v1 = new Vector(1, 0);
		const v2 = new Vector(234, 68);
		Vector.projected(v2, v1).x.should.equal(234);
		Vector.plumb(v2, v1).y.should.equal(68);
		Vector.projected(v2, v1.zero()).isZero.should.equal(true);
		Vector.plumb(v1, v2).isZero.should.equal(true);
		Vector.plumb(v2, v1).should.deep.equal(v2);
	});
});
