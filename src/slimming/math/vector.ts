// 2d 向量

const HALF_CIRC = 180;
const ACCURACY = 1e6;

export class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	public x: number;
	public y: number;

	// 获取向量长度
	public get modulo(): number {
		return Vector.Rounding(Math.sqrt(this.x * this.x + this.y * this.y));
	}

	public set modulo(m: number) {
		this.normalize();
		this.x *= m;
		this.y *= m;
	}

	public rotate(arc: number) {
		const _x = this.x;
		const _y = this.y;
		this.x = _x * Math.cos(arc) - _y * Math.sin(arc);
		this.y = _x * Math.sin(arc) + _y * Math.cos(arc);
		return this;
	}

	// value 直接返回长度
	public valueOf() {
		return this.modulo;
	}

	// 返回字符串形式
	public toString() {
		return `[${this.x},${this.y}]`;
	}

	// 转为单位向量
	public normalize() {
		const modulo = this.modulo;
		if (modulo !== 0) {
			this.x /= modulo;
			this.y /= modulo;
		} else {
			throw new Error('零向量无法标准化！');
		}
		return this;
	}

	// 转为零向量
	public zero() {
		this.x = 0;
		this.y = 0;
		return this;
	}

	// 与另一个向量相加
	public add(v: Vector) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	// 与另一个向量相减
	public substract(v: Vector) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	// 与数值或另一个向量相乘
	// 如果是数值，会更新当前向量
	// 如果是向量，会返回两个向量的乘积
	public multiplied(n: Vector): number;
	public multiplied(n: number): Vector;
	public multiplied(n: Vector|number): number|Vector {
		if (typeof n === 'number') {
			this.x *= n;
			this.y *= n;
			return this;
		} else {
			return this.x * n.x + this.y * n.y;
		}
	}

	// 计算两个向量的夹角 - 弧度
	public radian(v: Vector) {
		return Vector.radian(this, v);
	}

	// 计算两个向量的夹角 - 角度
	public angel(v: Vector) {
		return Vector.angel(this, v);
	}

	// 自己是不是零向量
	public get isZero() {
		return this.x === 0 && this.y === 0;
	}

	// 自己是不是单位向量
	public get isNormalize() {
		return this.modulo === 1;
	}

	// 两个向量相加
	public static add(v1: Vector, v2: Vector) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}

	// 两个向量相减
	public static substract(v1: Vector, v2: Vector) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	}

	public static multiplied(v1: Vector, v2: Vector): number;
	public static multiplied(v1: Vector, n: number): Vector;
	// 两个向量相乘
	public static multiplied(v1: Vector, n: Vector|number): number|Vector {
		if (typeof n === 'number') {
			return new Vector(v1.x * n, v1.y * n);
		} else {
			return v1.x * n.x + v1.y * n.y;
		}
	}

	// 两个向量的夹角 - 弧度
	public static radian(v1: Vector, v2: Vector) {
		if (v1.isZero || v2.isZero) {
			return NaN;
		}
		return Math.acos(Vector.multiplied(v1, v2) / v1.modulo / v2.modulo);
	}

	// 两个向量的夹角 - 角度
	public static angel(v1: Vector, v2: Vector) {
		if (v1.isZero || v2.isZero) {
			return NaN;
		}
		return Vector.Rounding(HALF_CIRC * Vector.radian(v1, v2) / Math.PI);
	}

	// v1 到 v2 的投影分量
	public static projected(v1: Vector, v2: Vector) {
		if (v1.isZero || v2.isZero) {
			return new Vector(0, 0);
		}
		return Vector.multiplied(v2, Vector.multiplied(v1, v2) / Math.pow(v2.modulo, 2));
	}

	// v1 到 v2 的垂直分量
	public static plumb(v1: Vector, v2: Vector) {
		if (v1.isZero) {
			return new Vector(0, 0);
		}
		if (v2.isZero) {
			return new Vector(v1.x, v1.y);
		}
		return Vector.substract(v1, Vector.projected(v1, v2));
	}

	// 取模，对小数点后6位进行取整，修正双精度浮点数导致无法正常标准化的
	public static Rounding(n: number): number {
		return Math.round(n * ACCURACY) / ACCURACY;
	}

	// 求距离
	public static distance(v1: Vector, v2: Vector) {
		return Vector.substract(v1, v2).modulo;
	}
}
