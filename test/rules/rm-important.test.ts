import { parse } from 'svg-vdom';
import { combineStyle } from '../../src/default-rules/combine-style';
import { rmImportant } from '../../src/rules/rm-important';
import { createXML } from '../../src/xml/create';

describe('rules/rm-important', () => {
	test('啥都没有发生', async () => {
		const xml = `<svg>
		<style>
		@import ('test.css');
		rect {
			fill: red!important;
			stroke: red!important;
        }
        #rect {
            stroke: yellow;
        }
		</style>
		<rect id="rect" style="fill: blue;"/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		await rmImportant(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe(`<svg><style>@import ('test.css');rect{fill:red!important;stroke:red!important}#rect{stroke:yellow}</style><rect id="rect" style="fill:blue"/></svg>`);
	});

	test('优化 important', async () => {
		const xml = `<svg>
		<style>
		rect {
			fill: red!important;
			stroke: red!important;
        }
        #rect1 {
			fill: black;
            stroke: yellow!important;
        }
        #rect2 {
            stroke: yellow!important;
        }
		</style>
		<rect id="rect" style="opacity: .5!important;fill:blue!important"/>
		<rect id="rect1"/>
		<circle/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		await rmImportant(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe(`<svg><style>rect{fill:red!important;stroke:red}#rect1{fill:black;stroke:yellow!important}#rect2{stroke:yellow}</style><rect id="rect" style="opacity:.5;fill:blue!important"/><rect id="rect1"/><circle/></svg>`);
	});
});
