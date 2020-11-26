import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { rmAttribute } from '../../src/rules/rm-attribute';
import { shortenStyleAttr } from '../../src/rules/shorten-style-attr';
import { createXML } from '../../src/xml/create';

describe('rules/rm-attribute', () => {
	test('移除属性', async () => {
		const xml = `<svg
			data-test="100"
			aria-colspan="3"
			onload="console.log(123)"
			version=""
			width="100"
			style="width:40"
			animation-name="test"
		>
		<a x="1"/>
		<circle stroke="none" cx="1" cy="0.0"/>
		<g fill="#000">
			<rect fill="black" stroke=""/>
			<g>
				<rect id="rect" fill="rgb(0,0,0,.5)" stroke="hsl(0,0%,0%)"/>
				<use href="#b" xlink:href="#rect"/>
				<use href="#b" width="-1" height="-1"/>
				<use href="#b" width="1" height="1"/>
			</g>
		</g>
		<marker orient="0deg"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'rm-attribute');
		await rmAttribute(dom, config);
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg width="100" style="width:40"><a/><circle cx="1"/><g><rect/><g><rect id="rect" fill="rgb(0,0,0,.5)" stroke="hsl(0,0%,0%)"/><use href="#b"/><use href="#b"/><use href="#b" width="1" height="1"/></g></g><marker/></svg>');
	});

	test('移除属性 - 反转规则', async () => {
		const xml = `<svg
			data-test="100"
			aria-colspan="3"
			onload="console.log(123)"
			version=""
			animation-name="test"
		><text stroke="none"/><circle cx="1" cy="0"/></svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			rules: {
				'rm-attribute': [true, {
					keepEvent: true,
					keepAria: true,
				}],
			},
			params: {
				rmAttrEqDefault: false,
			}
		}), 'rm-attribute');
		await rmAttribute(dom, config);
		expect(createXML(dom)).toBe('<svg aria-colspan="3" onload="console.log(123)"><text stroke="none"/><circle cx="1" cy="0"/></svg>');
	});
});
