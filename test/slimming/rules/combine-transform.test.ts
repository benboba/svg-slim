import chai = require('chai');
const should = chai.should();
import { combineTransform } from '../../../src/slimming/rules/combine-transform';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/combine-transform', () => {
	it('rule false branch', async () => {
		const xml = '<svg><rect transform="translate(0)scale(1)"/></svg>';
		const dom = await parse(xml) as ITagNode;
		await combineTransform([false], dom);
		createXML(dom).should.equal('<svg><rect transform="translate(0)scale(1)"/></svg>');
	});

	it('合并 Transform', async () => {
		const xml = `<svg>
		<text transform="scale(2) translate(100,100) skewX(-15) skewX(15) translate(-100-100) scale(0.5)">1</text>
		<text transform="scale(1.9999999)scale(1.9999999)">2</text>
		<text transform="scale(1.32034) translate(10,0.1) rotate(90)">3</text>
		<text transform="matrix(2,0,0,3,0,0)">4</text>
		<text transform="matrix(1,0,0,1,1,0)translate(-1)">5</text>
		<text transform="matrix(0.988,-0.156,0.156,0.988,0,0)">6</text>
		<text transform="matrix(-0.988,0.156,0.156,0.988,-10,-10)">7</text>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineTransform([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><text>1</text><text transform="scale(4)">2</text><text transform="matrix(0,1.32-1.32,0,13.2.13)">3</text><text transform="scale(2,3)">4</text><text>5</text><text transform="rotate(-8.97)">6</text><text transform="matrix(-.988.156.156.988-10-10)">7</text></svg>');
	});

	it('3 值 rotate', async () => {
		const xml = `<svg>
		<text transform="translate(19.6, 16.6) rotate(-45.000000) translate(-19.6, -16.6)">1</text>
		<text transform="rotate(-45,19.6,16.6)">2</text>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineTransform([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><text transform="rotate(315,19.6,16.6)">1</text><text transform="rotate(-45,19.6,16.6)">2</text></svg>');
	});
});
