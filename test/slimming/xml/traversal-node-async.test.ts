const chai = require('chai');
const should = chai.should();
import { createXML } from '../../../src/slimming/xml/create';
import { isTag } from '../../../src/slimming/xml/is-tag';
import { rmNode } from '../../../src/slimming/xml/rm-node';
import { traversalNodeAsync } from '../../../src/slimming/xml/traversal-node-async';
import { parse } from '../../../src/xml-parser';
import { ITagNode } from '../../../typings/node';


describe('xml/traversal-node-asycn', () => {
	it('parse style tree', async () => {
		const dom = await parse(`<svg>
		<g><ellipse/><rect/><rect/></g>
		</svg>`) as ITagNode;
		await traversalNodeAsync(isTag, async node => new Promise(resolve => {
			if (node.nodeName === 'rect') {
				rmNode(node);
			}
			resolve();
		}), dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><g><ellipse/></g></svg>');
		await traversalNodeAsync(node => node.nodeName === 'g', async node => new Promise(resolve => {
			rmNode(node);
			resolve();
		}), dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg></svg>');
	});
});
