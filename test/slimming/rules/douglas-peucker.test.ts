import chai = require('chai');
const should = chai.should();
import { douglasPeucker } from '../../../src/slimming/rules/douglas-peucker';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


describe('rules/douglas-peucker', () => {
	it('rule false branch', async () => {
		const xml = '<svg><polygon points="0,0 100,200,300,300,299,299" /></svg>';
		const dom = await parse(xml) as ITagNode;
		await douglasPeucker([false], dom);
		createXML(dom).should.equal('<svg><polygon points="0,0 100,200,300,300,299,299"/></svg>');
	});

	it('道格拉斯普克', async () => {
        const xml = `<svg>
        <polyline points="0 0 10 10 20 -10 30 0" />
        <polygon points="0,0 100,200,300,300,299,299" />
        <polyline />
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await douglasPeucker([true, 30], dom);
		createXML(dom).should.equal('<svg> <polyline points="0,0,30,0"/> <polygon points="0,0,100,200,299,299"/> <polyline/> </svg>');
	});
});
