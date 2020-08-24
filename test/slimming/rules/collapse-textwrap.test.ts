const chai = require('chai');
const should = chai.should();
import { collapseTextwrap } from '../../../src/slimming/rules/collapse-textwrap';
import { parse } from '../../../src/xml-parser';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/collapse-textwrap', () => {
	it('rule false branch', async () => {
		const xml = '<svg><text><tspan>1</tspan></text></svg>';
		const dom = await parse(xml) as ITagNode;
		await collapseTextwrap([false], dom);
		createXML(dom).should.equal('<svg><text><tspan>1</tspan></text></svg>');
	});

	it('塌陷文本容器', async () => {
		const xml = '<svg><text><tspan>1</tspan></text><text><tspan tx="1">2</tspan></text><text><tspan tx="">3</tspan></text></svg>';
		const dom = await parse(xml) as ITagNode;
		await collapseTextwrap([true], dom);
		createXML(dom).should.equal('<svg><text>1</text><text><tspan tx="1">2</tspan></text><text>3</text></svg>');
	});
});
