import chai = require('chai');
const should = chai.should();
import { computePath } from '../../../src/slimming/rules/compute-path';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/compute-path', () => {
	it('rule false branch', async () => {
		const xml = '<svg><path d="M0,0V100,200,300,299,299" /></svg>';
		const dom = await parse(xml) as ITagNode;
		await computePath([false], dom);
		createXML(dom).should.equal('<svg><path d="M0,0V100,200,300,299,299"/></svg>');
	});

	it('重新计算路径', async () => {
		const xml = `<svg>
		<path/>
		<path d="M30,30"/>
		<path d="M0,0,100,200,300,299,299" />
		<path d="M5e5.1L0,0,10,0,20,0,50,0,100,0,100,100,0,100Z" />
		<path d="M80 80 A 45 45, 0, 0, 0, 125 125 45 45, 0, 0, 0, 170 80 45 45, 0, 0, 0, 125 35 45 45, 0, 0, 0, 80 80 Z" />
		<path d="M0 0 Q0 100 100 100 Q 200 100 200 0 Z m0 0zZzZM100 100 m 30 30" />
		<path d="M 0 0 C 50 0 50 100 100 100 150 100 150 50 150 0Z" />
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await computePath([true, { thinning: 0, sizeDigit: 2, angelDigit: 2, straighten: 0 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><path d="m0,0,1e2,2e2,2e2,99"/><path d="m5e5.1L0,0h1e2v1e2H0z"/><path d="m80,80a45,45,0,0045,45,45,45,0,10-45-45z"/><path d="m0,0q0,1e2,1e2,1e2T2e2,0z"/><path d="m0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2z"/></svg>');
	});

	it('道格拉斯普克', async () => {
		const xml = `<svg stroke="red">
		<path d="M0,0V100,200,300,299,299"/>
		<path d="M0,0H100,200,300,299,299"/>
		<path d="M0,0L0,0,0,0,10,11,15,16,16,17,17,18,20,20T10,10"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await computePath([true, { thinning: 10, sizeDigit: 2, angelDigit: 2, straighten: 0 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg stroke="red"><path d="m0,0v299"/><path d="m0,0h299"/><path d="m0,0,20,20L10,10"/></svg>');
	});

	it('优化无 stroke 的 path', async () => {
		const xml = `<svg>
		<path d="m0,0,10,10,10,10,-20,-20V100,200,300,299,299z" />
		<path d="M0,0,10,10,zl1,1,-11,-11z"/>
		<path d="M30,30,31,31,zl1,1,-11,-11z"/>
		<path d="M0,0h100,200,100,50"/>
		<path d="m0,0Q200,0,100,100Q200,0,0,0zM0,0C50,0,100,100,150,0,100,100,50,0,0,0z"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await computePath([true, { thinning: 0, sizeDigit: 2, angelDigit: 2, straighten: 0 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg></svg>');
	});

	it('曲线转直线', async () => {
		const xml = `<svg stroke="red">
		<path d="M0,0A4,4,1,0,0,2,3C5,5,2,2,7,7l6,2t1,1,9,9,-1,2"/>
		<path d="M100,100a6,6,1,0,0,2,3T35,35"/>
		<path d="M0,0Q100,0,100,100t5,5M0,0C0,0,100,0,100,100s5,5,6,6"/>
		<path d="M90,90c5,5,5,0,8,8S5,5,6,6"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await computePath([true, { thinning: 0, sizeDigit: 2, angelDigit: 2, straighten: 10 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg stroke="red"><path d="m0,0,2,3,5,4,6,2,1,1t9,9-1,2"/><path d="m1e2,1e2a6,6,1,002,3L35,35"/><path d="m0,0q1e2,0,1e2,1e2t5,5M0,0s1e2,0,1e2,1e2,5,5,6,6"/><path d="m90,90c5,5,5,0,8,8S5,5,6,6"/></svg>');
	});
});
