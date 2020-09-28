import { parseColor } from '../../src/color/parse';

describe('颜色解析', () => {
	test('keywords', () => {
		expect(parseColor('red')).toEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 1,
			origin: '#ff0000',
			valid: true,
		});

		expect(parseColor('yellow')).toEqual({
			r: 255,
			g: 255,
			b: 0,
			a: 1,
			origin: '#ffff00',
			valid: true,
		});
	});

	test('hex', () => {
		expect(parseColor('#336699')).toEqual({
			r: 51,
			g: 102,
			b: 153,
			a: 1,
			origin: '#336699',
			valid: true,
		});

		expect(parseColor('#369')).toEqual({
			r: 51,
			g: 102,
			b: 153,
			a: 1,
			origin: '#369',
			valid: true,
		});

		expect(parseColor('#0006')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 0.4,
			origin: '#0006',
			valid: true,
		});

		expect(parseColor('#0004')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 0.26666666666666666,
			origin: '#0004',
			valid: true,
		});

		expect(parseColor('#000000fe')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 0.996078431372549,
			origin: '#000000fe',
			valid: true,
		});

		expect(parseColor('#ff000080')).toEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 0.5,
			origin: '#ff000080',
			valid: true,
		});

		expect(parseColor('#ff00007f')).toEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 0.4980392156862745,
			origin: '#ff00007f',
			valid: true,
		});

		expect(parseColor('#ff000081')).toEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 0.5058823529411764,
			origin: '#ff000081',
			valid: true,
		});

		expect(parseColor('#ab')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: '#ab',
			valid: false,
		});
	});

	test('rgb & rgba', () => {
		expect(parseColor('rrgb(255,0,0)')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'rrgb(255,0,0)',
			valid: false,
		});

		expect(parseColor('rgb(255,0,0)')).toEqual({
			r: 255,
			g: 0,
			b: 0,
			a: 1,
			origin: 'rgb(255,0,0)',
			valid: true,
		});

		expect(parseColor('rgb(500,-1,0.99)')).toEqual({
			r: 255,
			g: 0,
			b: 1,
			a: 1,
			origin: 'rgb(500,-1,0.99)',
			valid: true,
		});

		expect(parseColor('rgb(0,0%,0)')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'rgb(0,0%,0)',
			valid: false,
		});

		expect(parseColor('rgb(0,0,0,10%)')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 0.1,
			origin: 'rgb(0,0,0,10%)',
			valid: true,
		});

		expect(parseColor('rgba(100%,50,50%,0.1)')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'rgba(100%,50,50%,0.1)',
			valid: false,
		});

		expect(parseColor('rgba(100%,50%,50%,100)')).toEqual({
			r: 255,
			g: 128,
			b: 128,
			a: 1,
			origin: 'rgba(100%,50%,50%,100)',
			valid: true,
		});
	});

	test('hsl & hsla', () => {
		expect(parseColor('hsl(0,0%,0%)')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'hsl(0,0%,0%)',
			valid: true,
		});

		expect(parseColor('hsl(1%,0%,0%)')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'hsl(1%,0%,0%)',
			valid: false,
		});

		expect(parseColor('hsl(1,0,0)')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'hsl(1,0,0)',
			valid: false,
		});

		expect(parseColor('hsl(1circle,0,0)')).toEqual({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'hsl(1circle,0,0)',
			valid: false,
		});

		expect(parseColor('hsl(0deg,0%,100%)')).toEqual({
			r: 255,
			g: 255,
			b: 255,
			a: 1,
			origin: 'hsl(0deg,0%,100%)',
			valid: true,
		});

		expect(parseColor('hsla(180deg,50%,50%,50%)')).toEqual({
			r: 64,
			g: 191,
			b: 191,
			a: 0.5,
			origin: 'hsl(180,50%,50%,.5)',
			valid: true,
		});

		expect(parseColor('hsl(1.5rad,50%,50%,0.1)')).toEqual({
			r: 136,
			g: 191,
			b: 64,
			a: 0.1,
			origin: 'hsl(86,50%,50%,.1)',
			valid: true,
		});

		expect(parseColor('hsla(1.32432turn,50%,50%)')).toEqual({
			r: 71,
			g: 191,
			b: 64,
			a: 1,
			origin: 'hsla(1.32432turn,50%,50%)',
			valid: true,
		});

		expect(parseColor('hsl(500grad,10%,70%)')).toEqual({
			r: 179,
			g: 186,
			b: 171,
			a: 1,
			origin: 'hsl(500grad,10%,70%)',
			valid: true,
		});
	});
});
