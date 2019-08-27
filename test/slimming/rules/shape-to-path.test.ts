import chai = require('chai');
const should = chai.should();
import { shapeToPath } from '../../../src/slimming/rules/shape-to-path';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


describe('rules/shape-to-path', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
        <rect fill="red" width="100" height="100"/>
        <rect fill="red" width="1000" height="100"/>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shapeToPath([false], dom);
		createXML(dom).should.equal('<svg> <rect fill="red" width="100" height="100"/> <rect fill="red" width="1000" height="100"/> </svg>');
	});

	it('转换形状为路径', async () => {
        const xml = `<svg>
        <rect fill="red" width="100" height="100"/>
        <rect width="1000" height="100"/>
        <rect rx="5"/>
        <rect ry="5"/>
        <line fill="red" x2="100" y2="300"/>
        <circle/>
        <polyline />
        <polygon points=""/>
        <polyline points="10,10"/>
        <polygon fill="red" points="0,0,100,100,200-200,300"/>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shapeToPath([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><path fill="red" d="M0,0h100v100h-100z"/><path d="M0,0v100h1000v-100z"/><rect rx="5"/><rect ry="5"/><path fill="red" d="M0,0L100,300"/><circle/><polyline/><polygon/><path d="M10,10"/><path fill="red" d="M0,0L100,100,200-200z"/></svg>');
	});
});
