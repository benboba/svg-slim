import chai = require('chai');
const should = chai.should();
import { computePath } from '../../../src/slimming/rules/compute-path';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


describe('rules/compute-path', () => {
	it('rule false branch', async () => {
		const xml = '<svg><path d="M0,0V100,200,300,299,299" /></svg>';
		const dom = await parse(xml) as ITagNode;
		await computePath([false], dom);
		createXML(dom).should.equal('<svg><path d="M0,0V100,200,300,299,299"/></svg>');
	});

	it('重新计算路径', async () => {
        const xml = `<svg>
        <path d="M0,0V100,200,300,299,299" />
		<path/>
		<path d="M0,0,100,200,300,299,299" />
        <path d="M5e5.1L0,0,10,0,20,0,50,0,100,0,100,100,0,100Z" />
        <path d="M80 80 A 45 45, 0, 0, 0, 125 125 45 45, 0, 0, 0, 170 80 45 45, 0, 0, 0, 125 35 45 45, 0, 0, 0, 80 80 Z" />
        <path d="M0 0 Q0 100 100 100 Q 200 100 200 0 Z m0 0zZzZM100 100 m 30 30" />
        <path d="M 0 0 C 50 0 50 100 100 100 150 100 150 50 150 0Z" />
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await computePath([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><path d="M0,0V300v-1"/><path d="M5e5.1L0,0H100V100H0z"/><path d="M80,80a45,45,0,1,0,45-45,45,45,0,0,0-45,45z"/><path d="M0,0Q0,100,100,100T200,0z"/><path d="M0,0C50,0,50,100,100,100S150,50,150,0z"/></svg>');
	});

	it('道格拉斯普克', async () => {
        const xml = `<svg>
        <path d="M0,0V100,200,300,299,299" />
        <path d="M0,0H100,200,300,299,299" />
        <path d="M0,0L0,0,0,0,10,11,15,16,16,17,17,18,20,20T10,10" />
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await computePath([true, true, 10], dom);
		createXML(dom).should.equal('<svg> <path d="M0,0V299"/> <path d="M0,0H299"/> <path d="M0,0L20,20T10,10"/> </svg>');
	});
});
