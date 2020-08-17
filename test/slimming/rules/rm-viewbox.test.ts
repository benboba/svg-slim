const chai = require('chai');
const should = chai.should();
import { rmViewBox } from '../../../src/slimming/rules/rm-viewbox';
import { parse } from '../../../src/xml-parser';
import { createXML } from '../../../src/slimming/xml/create';

describe('rules/rm-viewbox', () => {
	it('rule false branch', async () => {
		const xml = '<svg width="100" height="100" viewBox="0 0 100 100"></svg>';
		const dom = await parse(xml) as ITagNode;
		await rmViewBox([false], dom);
		createXML(dom).should.equal('<svg width="100" height="100" viewBox="0 0 100 100"/>');
	});

	it('移除不必要的 ViewBox', async () => {
		const xml = `<svg x="0" y="0" width="100" height="100" viewBox="0 0 100 100">
		<marker markerWidth="50" markerHeight="50" viewBox="0 0 50 50"/>
		<pattern viewBox="0 0 50 50 1"/>
		<symbol viewBox="0 0 50 -1"/>
		<view viewBox="0 0 50 50"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await rmViewBox([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg x="0" y="0" width="100" height="100"><marker markerWidth="50" markerHeight="50"/><pattern/><symbol/><view viewBox="0 0 50 50"/></svg>');
	});

	it('不一样的单位', async () => {
		const xml = `<svg x="0" y="0" width="100pt" height="100pt" viewBox="0 0 100 100"></svg>`;
		const dom = await parse(xml) as ITagNode;
		await rmViewBox([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg x="0" y="0" width="100pt" height="100pt" viewBox="0 0 100 100"/>');
	});
});
