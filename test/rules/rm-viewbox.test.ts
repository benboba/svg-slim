const chai = require('chai');
const should = chai.should();
import { parse } from 'svg-vdom';
import { rmViewBox } from '../../src/rules/rm-viewbox';
import { createXML } from '../../src/xml/create';

describe('rules/rm-viewbox', () => {
	it('移除不必要的 ViewBox', async () => {
		const xml = `<svg x="0" y="0" width="100" height="100" viewBox="0 0 100 100">
		<marker markerWidth="50" markerHeight="50" viewBox="0 0 50 50"/>
		<pattern viewBox="0 0 50 50 1"/>
		<symbol viewBox="0 0 50 -1"/>
		<view viewBox="0 0 50 50"/>
		</svg>`;
		const dom = await parse(xml);
		await rmViewBox(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg x="0" y="0" width="100" height="100"><marker markerWidth="50" markerHeight="50"/><pattern/><symbol/><view viewBox="0 0 50 50"/></svg>');
	});

	it('不一样的单位', async () => {
		const xml = '<svg x="0" y="0" width="100pt" height="100pt" viewBox="0 0 100 100"></svg>';
		const dom = await parse(xml);
		await rmViewBox(dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg x="0" y="0" width="100pt" height="100pt" viewBox="0 0 100 100"/>');
	});
});
