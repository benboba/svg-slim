import { parse } from 'svg-vdom';
import { combineStyle } from '../../src/default-rules/combine-style';
import { applyStyle } from '../../src/rules/apply-style';
import { createXML } from '../../src/xml/create';

describe('rules/apply-style', () => {
	test('部分样式略过', async () => {
		const xml = `<svg>
		<style>
		rect {
			fill: red;
			stroke: red;
		}
		</style>
		<rect style="fill: blue;"/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		await applyStyle(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><rect style="fill:blue;stroke:red"/></svg>');
	});

	test('无法应用 + 覆盖率补齐', async () => {
		const xml = `<svg>
		<style>
		@import("test.css");
		rect {
			fill: red;
		}
		</style>
		<rect/>
		<rect/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		await applyStyle(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><style>@import ("test.css");rect{fill:red}</style><rect/><rect/></svg>');
	});
});
