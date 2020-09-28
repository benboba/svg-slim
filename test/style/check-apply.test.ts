import { parse } from "svg-vdom";
import { createRuleConfig } from "../../src/config/create-rule-config";
import { mergeConfig } from "../../src/config/merge";
import { combineStyle } from "../../src/default-rules/combine-style";
import { shortenStyleAttr } from "../../src/rules/shorten-style-attr";
import { shortenStyleTag } from "../../src/rules/shorten-style-tag";
import { createXML } from "../../src/xml/create";

describe('style/check-apply', () => {
	test('double important', async () => {
		const xml = `<svg>
		<style>
		rect {
			fill-opacity: 0.8!important;
		}
		</style>
		<rect style="fill-opacity: 0.5!important"/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		const config = createRuleConfig(mergeConfig(null), 'shorten-style-tag');
		await shortenStyleTag(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><rect style="fill-opacity: 0.5!important"/></svg>');
    });

	test('override case', async () => {
		const xml = `<svg>
		<style>
		rect {
			opacity:.1;
		}
		</style>
		<rect style="opacity:1"/>
		<rect/>
		<circle style="opacity:1"/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		const config = createRuleConfig(mergeConfig(null), 'shorten-style-tag');
		await shortenStyleTag(dom, config);
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><style>rect{opacity:.1}</style><rect style="opacity:1"/><rect/><circle/></svg>');
    });
});
