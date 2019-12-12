import chai = require('chai');
const should = chai.should();
import { rmHidden } from '../../../src/slimming/rules/rm-hidden';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/rm-hidden', () => {
	it('rule false branch', async () => {
		const xml = '<svg><polygon points="0,0 100,200,300,300,299,299" /></svg>';
		const dom = await parse(xml) as ITagNode;
		await rmHidden([false], dom);
		createXML(dom).should.equal('<svg><polygon points="0,0 100,200,300,300,299,299"/></svg>');
	});

	it('移除隐藏对象', async () => {
        const xml = `<svg>
            <g display="none" style="display:none"><text>1</text></g>
            <style></style>
            <rect />
            <rect width="0" height="100" />
            <rect width="1000" />
            <rect width="100" height="100" />
            <circle cx="10" cy="10" />
            <circle style="r:5" />
            <ellipse rx="0" ry="1e5" />
            <ellipse rx="10" />
            <ellipse rx="10" ry="1e5" />
            <line x1="1" y1="10" x2="1" y2="10" />
            <line x1="1" y1="10" style="x2:10;y2:10" />
            <polygon points="100 100 200 200 300 300" fill="none" />
            <polyline  />
            <polyline points="100 100 200 200 300 300" />
            <path  />
            <path d="" />
            <path d="M0,0L100,100" stroke="red" />
            <path d="M0,0L100,100" fill="none" id="a" />
            <text>1</text>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await rmHidden([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect width="100" height="100"/><circle style="r:5"/><ellipse rx="10" ry="1e5"/><line x1="1" y1="10" style="x2:10;y2:10"/><polyline points="100 100 200 200 300 300"/><path d="M0,0L100,100" stroke="red"/><path d="M0,0L100,100" fill="none" id="a"/><text>1</text></svg>');
	});
});
