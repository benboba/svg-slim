import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { combineStyle } from '../../src/default-rules/combine-style';
import { shortenColor } from '../../src/rules/shorten-color';
import { createXML } from '../../src/xml/create';

describe('rules/shorten-color', () => {
	test('缩短颜色', async () => {
		const xml = `<svg>
		<style>
		.a {
			color: rgb(0,0,0,0);
			fill: currentColor;
			stroke: rgba(0,0,0,0.5);
			x: 100;
		}
		</style>
		<text fill="hsl(9,9%,9%,0.01)" stroke="rgba(0,250,0,1%)" color="rgba(0,0,250,10%)">123</text>
		<rect style="fill:#ff0000" stroke="rebeccapurple" color="hsla(0,100%,100%,0)" />
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		const config = createRuleConfig(mergeConfig({
			params: {
				opacityDigit: 4,
			},
		}), 'shorten-color');
		await shortenColor(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><style>.a{color:transparent;fill:currentColor;stroke:rgb(0,0,0,.5);x:100}</style><text fill="hsl(9,9%,9%,1%)" stroke="rgb(0,250,0,1%)" color="rgb(0,0,250,.1)">123</text><rect style="fill:red" stroke="#639" color="hsl(0,0%,100%,0)"/></svg>');
	});

	test('rgba 及 style 无法解析', async () => {
		const xml = `<svg>
		<style>oops</style>
		<rect width="100" style="fill:#ff000000;height:100" stroke="rgba(101,234,113,0.322)" color="transparent" />
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		const config = createRuleConfig(mergeConfig({
			rules: {
				'shorten-color': [true, {
					rrggbbaa: true,
				}],
			},
		}), 'shorten-color');
		await shortenColor(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><rect width="100" style="fill:#f000;height:100" stroke="#65ea7152" color="#0000"/></svg>');
	});
});
