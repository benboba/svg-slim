const chai = require('chai');
const should = chai.should();
import { collapseG } from '../../../src/slimming/rules/collapse-g';
import { parse } from '../../../src/xml-parser';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/collapse-g', () => {
	it('rule false branch', async () => {
		const xml = '<svg><g></g></svg>';
		const dom = await parse(xml) as ITagNode;
		await collapseG([false], dom);
		createXML(dom).should.equal('<svg><g/></svg>');
	});

	it('g元素塌陷', async () => {
		const xml = '<svg><g fill="red"><g><text>1</text></g></g><g id="nonono"><text>2</text></g><g style="fill:red"><g><text>3</text><line/></g></g><g title="123"><g><text>3</text><line/></g></g><g></g></svg>';
		const dom = await parse(xml) as ITagNode;
		await collapseG([true], dom);
		createXML(dom).should.equal('<svg><text fill="red">1</text><g id="nonono"><text>2</text></g><g style="fill:red"><text>3</text><line/></g><g title="123"><text>3</text><line/></g></svg>');
	});

	it('属性塌陷', async () => {
		const xml = '<svg><g fill="red" transform="scale(1)"><text fill="blue" transform="rotate(30)">1</text></g></svg>';
		const dom = await parse(xml) as ITagNode;
		await collapseG([true], dom);
		createXML(dom).should.equal('<svg><text fill="blue" transform="scale(1) rotate(30)">1</text></svg>');
	});
});
