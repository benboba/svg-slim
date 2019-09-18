import chai = require('chai');
const should = chai.should();
import { combineTransform } from '../../../src/slimming/rules/combine-transform';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


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
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineTransform([true], dom);
		createXML(dom).should.equal('<svg> <text>1</text> <text transform="scale(4)">2</text> <text transform="matrix(0,1.32-1.32,0,13.2.13)">3</text> <text transform="scale(2,3)">4</text> <text>5</text> <text transform="rotate(-8.97)">6</text> </svg>');
	});
});
