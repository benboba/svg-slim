import { shorten } from '../../src/matrix/shorten';

describe('matrix/shorten', () => {
	test('shorten translate', () => {
		expect(shorten({
			type: 'translate',
			val: [1.523, 1.333]
		})).toEqual({
			type: 'translate',
			val: [1.52, 1.33],
		});

		expect(shorten({
			type: 'translate',
			val: [1.999, 0]
		})).toEqual({
			type: 'translate',
			val: [2],
		});

		expect(shorten({
			type: 'translate',
			val: [0.001, 0.0049]
		})).toEqual({
			type: 'translate',
			val: [0],
			noEffect: true,
		});

		expect(shorten({
			type: 'translate',
			val: [0.1, 3],
		}, 0, 0, 0)).toEqual({
			type: 'translate',
			val: [0, 3],
		});
	});

	test('shorten scale', () => {
		expect(shorten({
			type: 'scale',
			val: [1.3342, 2.3367],
		})).toEqual({
			type: 'scale',
			val: [1.334, 2.337],
		});

		expect(shorten({
			type: 'scale',
			val: [1.9999, 1.9999],
		})).toEqual({
			type: 'scale',
			val: [2],
		});

		expect(shorten({
			type: 'scale',
			val: [1.0001, 1.00009],
		})).toEqual({
			type: 'scale',
			val: [1],
			noEffect: true,
		});
	});

	test('shorten rotate', () => {
		expect(shorten({
			type: 'rotate',
			val: [5.3367],
		})).toEqual({
			type: 'rotate',
			val: [5.34],
		});

		expect(shorten({
			type: 'rotate',
			val: [0.0001],
		})).toEqual({
			type: 'rotate',
			val: [0],
			noEffect: true,
		});
	});

	test('shorten skewX', () => {
		expect(shorten({
			type: 'skewX',
			val: [5.3367],
		})).toEqual({
			type: 'skewX',
			val: [5.34],
		});

		expect(shorten({
			type: 'skewX',
			val: [0.0001],
		})).toEqual({
			type: 'skewX',
			val: [0],
			noEffect: true,
		});
	});

	test('shorten skewY', () => {
		expect(shorten({
			type: 'skewY',
			val: [5.3367],
		})).toEqual({
			type: 'skewY',
			val: [5.34],
		});

		expect(shorten({
			type: 'skewY',
			val: [0.0001],
		})).toEqual({
			type: 'skewY',
			val: [0],
			noEffect: true,
		});
	});

	test('shorten matrix', () => {
		expect(shorten({
			type: 'matrix',
			val: [1, 0, 0.0001, 0.9999, 0, 0],
		}, 0, 0, 0)).toEqual({
			type: 'translate',
			val: [0],
			noEffect: true,
		});

		expect(shorten({
			type: 'matrix',
			val: [1, 0, 0.0001, 0.9999, 0, 0],
		})).toEqual({
			type: 'translate',
			val: [0],
			noEffect: true,
		});

		expect(shorten({
			type: 'matrix',
			val: [0.0001, 2.234, 234.5, 0.565, 57, 435],
		})).toEqual({
			type: 'matrix',
			val: [0, 2.234, 234.5, 0.565, 57, 435],
		});

		expect(shorten({
			type: 'matrix',
			val: [1, 0, 0, 1, 51, 5],
		})).toEqual({
			type: 'translate',
			val: [51, 5],
		});

		expect(shorten({
			type: 'matrix',
			val: [1, 0, 0, 1, 5, 0],
		})).toEqual({
			type: 'translate',
			val: [5],
		});

		expect(shorten({
			type: 'matrix',
			val: [2, 0, 0, 3, 0, 0],
		})).toEqual({
			type: 'scale',
			val: [2, 3],
		});

		expect(shorten({
			type: 'matrix',
			val: [2, 0, 0, 2, 0, 0],
		})).toEqual({
			type: 'scale',
			val: [2],
		});

		expect(shorten({
			type: 'matrix',
			val: [Math.cos(30 * Math.PI / 180), Math.sin(30 * Math.PI / 180), -Math.sin(30 * Math.PI / 180), Math.cos(30 * Math.PI / 180), 0, 0],
		})).toEqual({
			type: 'rotate',
			val: [30],
		});

		expect(shorten({
			type: 'matrix',
			val: [-Math.cos(30 * Math.PI / 180), Math.sin(30 * Math.PI / 180), -Math.sin(30 * Math.PI / 180), -Math.cos(30 * Math.PI / 180), 0, 0],
		})).toEqual({
			type: 'rotate',
			val: [150],
		});

		expect(shorten({
			type: 'matrix',
			val: [-Math.cos(30 * Math.PI / 180), -Math.sin(30 * Math.PI / 180), Math.sin(30 * Math.PI / 180), -Math.cos(30 * Math.PI / 180), 0, 0],
		})).toEqual({
			type: 'rotate',
			val: [210],
		});

		expect(shorten({
			type: 'matrix',
			val: [Math.cos(5 * Math.PI / 180), -Math.sin(5 * Math.PI / 180), Math.sin(5 * Math.PI / 180), Math.cos(5 * Math.PI / 180), 0, 0],
		})).toEqual({
			type: 'rotate',
			val: [-5],
		});

		expect(shorten({
			type: 'matrix',
			val: [1, 0, Math.tan(30 * Math.PI / 180), 1, 0, 0],
		})).toEqual({
			type: 'skewX',
			val: [30],
		});

		expect(shorten({
			type: 'matrix',
			val: [1, 0, Math.tan(355 * Math.PI / 180), 1, 0, 0],
		})).toEqual({
			type: 'skewX',
			val: [-5],
		});

		expect(shorten({
			type: 'matrix',
			val: [1, Math.tan(30 * Math.PI / 180), 0, 1, 0, 0],
		})).toEqual({
			type: 'skewY',
			val: [30],
		});

		expect(shorten({
			type: 'matrix',
			val: [1, Math.tan(355 * Math.PI / 180), 0, 1, 0, 0],
		})).toEqual({
			type: 'skewY',
			val: [-5],
		});
	});
});
