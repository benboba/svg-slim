const chai = require('chai');
const should = chai.should();
import { execColor } from '../../../src/slimming/color/exec';

describe('颜色解析', () => {
	it('keywords', () => {
		execColor('red').should.deep.equal({
			r: 255,
			g: 0,
			b: 0,
			a: 1,
			origin: '#ff0000',
			valid: true,
		});

		execColor('yellow').should.deep.equal({
			r: 255,
			g: 255,
			b: 0,
			a: 1,
			origin: '#ffff00',
			valid: true,
		});
	});

	it('hex', () => {
		execColor('#336699').should.deep.equal({
			r: 51,
			g: 102,
			b: 153,
			a: 1,
			origin: '#336699',
			valid: true,
		});

		execColor('#369').should.deep.equal({
			r: 51,
			g: 102,
			b: 153,
			a: 1,
			origin: '#369',
			valid: true,
		});

		execColor('#0006').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 0.4,
			origin: '#0006',
			valid: true,
		});

		execColor('#0004').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 0.26666666666666666,
			origin: '#0004',
			valid: true,
		});

		execColor('#000000fe').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 0.996078431372549,
			origin: '#000000fe',
			valid: true,
		});

		execColor('#ff000080').should.deep.equal({
			r: 255,
			g: 0,
			b: 0,
			a: 0.5,
			origin: '#ff000080',
			valid: true,
		});

		execColor('#ff00007f').should.deep.equal({
			r: 255,
			g: 0,
			b: 0,
			a: 0.4980392156862745,
			origin: '#ff00007f',
			valid: true,
		});

		execColor('#ff000081').should.deep.equal({
			r: 255,
			g: 0,
			b: 0,
			a: 0.5058823529411764,
			origin: '#ff000081',
			valid: true,
		});

		execColor('#ab').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: '#ab',
			valid: false,
		});
	});

	it('rgb & rgba', () => {
		execColor('rrgb(255,0,0)').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'rrgb(255,0,0)',
			valid: false,
		});

		execColor('rgb(255,0,0)').should.deep.equal({
			r: 255,
			g: 0,
			b: 0,
			a: 1,
			origin: 'rgb(255,0,0)',
			valid: true,
		});

		execColor('rgb(500,-1,0.99)').should.deep.equal({
			r: 255,
			g: 0,
			b: 1,
			a: 1,
			origin: 'rgb(500,-1,0.99)',
			valid: true,
		});

		execColor('rgb(0,0%,0)').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'rgb(0,0%,0)',
			valid: false,
		});

		execColor('rgb(0,0,0,10%)').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 0.1,
			origin: 'rgb(0,0,0,10%)',
			valid: true,
		});

		execColor('rgba(100%,50,50%,0.1)').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'rgba(100%,50,50%,0.1)',
			valid: false,
		});

		execColor('rgba(100%,50%,50%,100)').should.deep.equal({
			r: 255,
			g: 128,
			b: 128,
			a: 1,
			origin: 'rgba(100%,50%,50%,100)',
			valid: true,
		});
	});

	it('hsl & hsla', () => {
		execColor('hsl(0,0%,0%)').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'hsl(0,0%,0%)',
			valid: true,
		});

		execColor('hsl(1%,0%,0%)').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'hsl(1%,0%,0%)',
			valid: false,
		});

		execColor('hsl(1,0,0)').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'hsl(1,0,0)',
			valid: false,
		});

		execColor('hsl(1circle,0,0)').should.deep.equal({
			r: 0,
			g: 0,
			b: 0,
			a: 1,
			origin: 'hsl(1circle,0,0)',
			valid: false,
		});

		execColor('hsl(0deg,0%,100%)').should.deep.equal({
			r: 255,
			g: 255,
			b: 255,
			a: 1,
			origin: 'hsl(0deg,0%,100%)',
			valid: true,
		});

		execColor('hsla(180deg,50%,50%,50%)').should.deep.equal({
			r: 64,
			g: 191,
			b: 191,
			a: 0.5,
			origin: 'hsl(180,50%,50%,.5)',
			valid: true,
		});

		execColor('hsl(1.5rad,50%,50%,0.1)').should.deep.equal({
			r: 136,
			g: 191,
			b: 64,
			a: 0.1,
			origin: 'hsl(86,50%,50%,.1)',
			valid: true,
		});

		execColor('hsla(1.32432turn,50%,50%)').should.deep.equal({
			r: 71,
			g: 191,
			b: 64,
			a: 1,
			origin: 'hsla(1.32432turn,50%,50%)',
			valid: true,
		});

		execColor('hsl(500grad,10%,70%)').should.deep.equal({
			r: 179,
			g: 186,
			b: 171,
			a: 1,
			origin: 'hsl(500grad,10%,70%)',
			valid: true,
		});
	});
});
