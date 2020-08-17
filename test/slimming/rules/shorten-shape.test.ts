const chai = require('chai');
const should = chai.should();
import { shortenShape } from '../../../src/slimming/rules/shorten-shape';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';


describe('rules/shorten-shape', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
		<rect fill="red" width="100" height="100"/>
		<rect fill="red" width="1000" height="100"/>
		<polygon points="0,0 100,200,300,300,299,299" />
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenShape([false], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect fill="red" width="100" height="100"/><rect fill="red" width="1000" height="100"/><polygon points="0,0 100,200,300,300,299,299"/></svg>');
	});

	it('转换形状为路径', async () => {
		const xml = `<svg>
		<rect style="fill:red" width="100" height="0.5"/>
		<rect width="1000" height="100" rx="0" ry="-1"/>
		<rect width="-1000" height="1"/>
		<rect width="1" height="-100"/>
		<rect rx="5" width="1" height="1"/>
		<rect ry="5" width="1" height="1"/>
		<rect rx="5" ry="5" width="1" height="1"/>
		<rect rx="-5" ry="5" width="1" height="1"/>
		<rect width="1em" height="1em"/>
		<line fill="red" x2="100" y2="300"/>
		<line stroke="red" x2="1em"/>
		<line stroke="red" stroke-width="0" x2="1em"/>
		<line stroke="red" x2="100" y2="300"/>
		<line stroke="red" x2="0" y2="0"/>
		<polyline />
		<polygon points=""/>
		<polyline points="10,10"/>
		<polygon fill="red" points="0,0,100,100,200-200,300"/>
		<polygon points="10,10" stroke="red" stroke-linecap="square"/>
		<path/>
		<path d="M0,0"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenShape([true, { thinning: 0 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><path style="fill:red" d="M0,0v.5h1e2v-.5z"/><path d="M0,0h1e3v1e2h-1e3z"/><rect rx="5" width="1" height="1"/><rect ry="5" width="1" height="1"/><rect rx="5" ry="5" width="1" height="1"/><rect rx="-5" ry="5" width="1" height="1"/><rect width="1em" height="1em"/><line stroke="red" x2="1em"/><path stroke="red" d="M0,0,100,300"/><path fill="red" d="M0,0,1e2,1e2,2e2-2e2z"/><path stroke="red" stroke-linecap="square" d="M10,10z"/><path d="M0,0"/></svg>');
	});

	it('转换形状为路径 - circle & ellipse', async () => {
		const xml = `<svg>
		<circle/>
		<circle r="-1"/>
		<circle r="2"/>
		<circle r="2" transform="matrix(1.5,0,0,2.5,0,0)"/>
		<circle r="2" transform="scale(3)"/>
		<ellipse/>
		<ellipse rx="3" ry=""/>
		<ellipse rx="3"/>
		<ellipse style="fill:red" rx="100" ry="100"/>
		<ellipse rx="3" ry="5" transform="scale(2)"/>
		<ellipse rx="3" ry="5" transform="rotate(15,1,1)"/>
		<ellipse rx="30" ry="5" transform="scale(2)"/>
		<ellipse rx="3" ry="5pt" transform="scale(2)"/>
		<ellipse rx="3" ry="5"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenShape([true, { thinning: 0 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><circle r="2"/><circle r="2" transform="matrix(1.5,0,0,2.5,0,0)"/><circle r="2" transform="scale(3)"/><circle r="3"/><circle style="fill:red" r="1e2"/><ellipse rx="3" ry="5" transform="scale(2)"/><ellipse rx="3" ry="5" transform="rotate(15,1,1)"/><ellipse rx="30" ry="5" transform="scale(2)"/><ellipse rx="3" ry="5pt" transform="scale(2)"/><ellipse rx="3" ry="5"/></svg>');
	});

	it('道格拉斯普克', async () => {
		const xml = `<svg>
		<polyline points="0 0 10 10 15 15 25 25 30 30" />
		<polygon points="0,0 100,200,300,300,300,299,299,299,299,298,298,298" />
		<polyline />
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenShape([true, { thinning: 30 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><path d="M0,0,30,30"/><path d="M0,0,1e2,2e2,3e2,3e2,298,298z"/></svg>');
	});

	it('check animate', async () => {
		const xml = `<svg>
		<line x2="100" stroke-width="0">
			<animate attributeName="stroke" to="block"/>
			<animate attributeName="stroke-width" to="0"/>
		</line>
		<polyline points="10,10" stroke-width="0" stroke="block">
			<animate attributeName="stroke" to="none"/>
			<animate attributeName="stroke-width" to="0"/>
		</polyline>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenShape([true, { thinning: 30 }], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg></svg>');
	});
});
