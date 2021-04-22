import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { combineStyle } from '../../src/default-rules/combine-style';
import { rmAttribute } from '../../src/rules/rm-attribute';
import { rmIllegalStyle } from '../../src/rules/rm-illegal-style';
import { shortenStyleAttr } from '../../src/rules/shorten-style-attr';
import { shortenAnimate } from '../../src/rules/shorten-animate';
import { createXML } from '../../src/xml/create';

describe('rules/shorten-style-attr', () => {
	test('noexchange', async () => {
		const xml = `<svg>
		<style>rect{fill:red}</style>
		<rect fill="none" style="fill:blue"/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		const config1 = createRuleConfig(mergeConfig(null), 'rm-illegal-style');
		await rmIllegalStyle(dom, config1);
		const config2 = createRuleConfig(mergeConfig(null), 'rm-attribute');
		await rmAttribute(dom, config2);
		const config = createRuleConfig(mergeConfig({
			params: {
				rmAttrEqDefault: false,
			}
		}), 'shorten-style-attr');
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><style>rect{fill:red}</style><rect style="fill:blue"/></svg>');
	});

	test('exchange', async () => {
		const xml = '<svg width="100" fill-rule="evenodd" stroke="blue" stroke-width="2" style="width:50px;"><rect fill="none" style="fill:blue"/></svg>';
		const dom = await parse(xml);
		const config1 = createRuleConfig(mergeConfig(null), 'rm-illegal-style');
		await rmIllegalStyle(dom, config1);
		const config2 = createRuleConfig(mergeConfig(null), 'rm-attribute');
		await rmAttribute(dom, config2);
		const config = createRuleConfig(mergeConfig(null), 'shorten-style-attr');
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg width="100" style="stroke:blue;stroke-width:2;width:50px"><rect fill="blue"/></svg>');
	});

	test('缩短 style 属性', async () => {
		const xml = `<svg>
		<g fill="none" transform-origin="bottom" style="fill:blue;transform:translate(100px,100px);   /*test this'''*/  transform   : /*test'*/  /*test'*/ rotate(45deg) /*test'*/  /*test'*/  ;  content:';///'/*test'*/;empty:;">
		<text title="123" fill="red" stroke="red" style="font-family: &quot;微软雅黑&quot;;fill: rebeccapurple; stroke: blue;">123</text>
		<g fill="#fff">
			<rect style="file:blue" x="1"/>
		</g>
		</g>
		<rect opacity="x" stroke="red" fill="red" style="fill:blue"/>
		<text title="444" style="fill:red" fill="red" stroke="blue" font-family="Arial" font-weight="700" direction="ltr" fill-opacity="0.5">345</text>
		<animate to="x" attributeName="opacity" from="0" fill="remove"/>
		</svg>`;
		const dom = await parse(xml);
		const config0 = createRuleConfig(mergeConfig(null), 'shorten-animate');
		await shortenAnimate(dom, config0);
		const config1 = createRuleConfig(mergeConfig(null), 'rm-illegal-style');
		await rmIllegalStyle(dom, config1);
		const config2 = createRuleConfig(mergeConfig(null), 'rm-attribute');
		await rmAttribute(dom, config2);
		const config = createRuleConfig(mergeConfig(null), 'shorten-style-attr');
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><g style="transform:rotate(45deg);content:\';///\'"><text font-family="&quot;微软雅黑&quot;" fill="rebeccapurple" stroke="blue">123</text><g fill="#fff"><rect x="1"/></g></g><rect stroke="red" fill="blue"/><text style="fill:red;stroke:blue;font-family:Arial;font-weight:700;fill-opacity:0.5">345</text><animate attributeName="opacity" from="0"/></svg>');
	});

	test('深度继承的情况', async () => {
		const xml = `<svg>
		<defs>
			<pattern id="TrianglePattern">
				<path d="M 0 0 L 7 0 L 3.5 7 z" xlink:href="#ell"/>
				<path d="M 0 0 L 7 0 L 3.5 7 z" href="#ell"/>
				<path d="M 0 0 L 7 0 L 3.5 7 z"/>
			</pattern>
			<polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/>
			<polygon id="path-3" points="46 0 46 52 0 52 0 0 46 0"/>
		</defs>
		<ellipse font-family="Arial" id="ell" style="fill:url(#TrianglePattern)"/>
		<ellipse font-family="Arial" fill="red" xlink:href="#path-1"/>
		<ellipse font-family="Arial" fill="red" href="#path-3"/>
		<mask font-family="Arial" id="mask-2" fill="white"><use xlink:href="#path-1"/><use xlink:href="#path-2"/></mask>
		<mask font-family="Arial" id="mask-3" fill="white"><use href="#path-3"/><use href="#path-4"/></mask>
		</svg>`;
		const dom = await parse(xml);
		const config1 = createRuleConfig(mergeConfig(null), 'rm-illegal-style');
		await rmIllegalStyle(dom, config1);
		const config = createRuleConfig(mergeConfig(null), 'shorten-style-attr');
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><defs><pattern id="TrianglePattern"><path d="M 0 0 L 7 0 L 3.5 7 z" xlink:href="#ell"/><path d="M 0 0 L 7 0 L 3.5 7 z" href="#ell"/><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern><polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/><polygon id="path-3" points="46 0 46 52 0 52 0 0 46 0"/></defs><ellipse id="ell" fill="url(#TrianglePattern)"/><ellipse fill="red" xlink:href="#path-1"/><ellipse fill="red" href="#path-3"/><mask id="mask-2" fill="white"><use xlink:href="#path-1"/><use xlink:href="#path-2"/></mask><mask id="mask-3" fill="white"><use href="#path-3"/><use href="#path-4"/></mask></svg>');
	});

	test('rm default', async () => {
		const xml = `<svg width="100" style="display:b;fill:#000">
		<rect fill="black" style="" width="100"/>
		<g fill="none"><circle fill="#000" style="stroke:none"/><circle style="fill:black"/><circle/></g>
		<g style="fill:none"><circle fill="#000"/><circle style="fill:red"/></g>
		<set to="3" attributeName="zoomAndPan"/>
		<set to=".5" attributeName="opacity"/>
		</svg>`;
		const dom = await parse(xml);
		const config1 = createRuleConfig(mergeConfig(null), 'rm-illegal-style');
		await rmIllegalStyle(dom, config1);
		const config2 = createRuleConfig(mergeConfig(null), 'rm-attribute');
		await rmAttribute(dom, config2);
		const config = createRuleConfig(mergeConfig(null), 'shorten-style-attr');
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg width="100"><rect width="100"/><g fill="none"><circle fill="#000"/><circle fill="black"/><circle/></g><g><circle/><circle fill="red"/></g><set to="3" attributeName="zoomAndPan"/><set to=".5" attributeName="opacity"/></svg>');
	});

	test('geometry', async () => {
		const xml = `<svg width="400" style="height:200">
			<rect width="50" height="50" style="y:125;rx:10"></rect>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'shorten-style-attr');
		await rmIllegalStyle(dom, config);
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg width="400" style="height:200"><rect width="50" height="50" style="y:125;rx:10"/></svg>');

		const config1 = createRuleConfig(mergeConfig({
			browsers: ['> 0.5%', 'not ie 11', 'not firefox < 99', 'not and_ff < 99'],
		}), 'rm-illegal-style');
		await rmIllegalStyle(dom, config1);
		await shortenStyleAttr(dom, config1);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg width="400" style="height:200"><rect width="50" height="50" y="125" rx="10"/></svg>');
	});

	test('check trans', async () => {
		const xml = `<svg>
		<text font-family="Arial" font-size="13.31" font-stretch="Normal" font-weight="400!important" font-style="italic" fill="red">80</text>
		<rect fill="blue" style="fill:red"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'shorten-style-attr');
		await shortenStyleAttr(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><text style="font-family:Arial;font-size:13.31px;font-stretch:Normal;font-weight:400!important;font-style:italic;fill:red">80</text><rect fill="red"/></svg>');
	});
});
