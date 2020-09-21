import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { combineStyle } from '../../src/default-rules/combine-style';
import { shortenDecimalDigits } from '../../src/rules/shorten-decimal-digits';
import { createXML } from '../../src/xml/create';

describe('rules/shorten-decimal-digits', () => {
	test('缩短数字', async () => {
		const xml = `<svg>
		<style>
		@import('test.css');
		.a {
			fill-rule: evenodd;
			fill-opacity: inherit;
			opacity: 0.09;
			width: 500000
		}
		</style>
		<animate to="-0.55" attributeName="x"/>
		<animate to="0.5001" attributeName="opacity"/>
		<animate to="0.55" attributeName="title"/>
		<animate to="0.55"/>
		<rect opacity="1.999" style="x:1.15;y:-0;title:a" amplitude="2.0001" />
		<polygon stroke-width="1.999" style="opacity:0.00099999" points="200000 , 0.1   -1.1 0.5" />
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		const config = createRuleConfig(mergeConfig({
			params: {
				sizeDigit: 1,
				angelDigit: 3,
			},
		}), 'shorten-decimal-digits');
		await shortenDecimalDigits(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><style>@import (\'test.css\');.a{fill-rule:evenodd;fill-opacity:inherit;opacity:9%;width:5e5}</style><animate to="-.6" attributeName="x"/><animate to=".5" attributeName="opacity"/><animate to="0.55" attributeName="title"/><animate to="0.55"/><rect opacity="1" style="x:1.2;y:0;title:a" amplitude="2"/><polygon stroke-width="2" style="opacity:.1%" points="2e5.1-1.1.5"/></svg>');
	});

	test('badcase', async () => {
		const xml = `<svg>
		<style>bang!</style>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		const config = createRuleConfig(mergeConfig(null), 'shorten-decimal-digits');
		await shortenDecimalDigits(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg></svg>');
	});
});
