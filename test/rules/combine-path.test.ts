import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { combinePath } from '../../src/rules/combine-path';
import { createXML } from '../../src/xml/create';

describe('rules/combine-path', () => {
	test('合并路径', async () => {
		const xml = `<svg>
		<path style="opacity:1" fill="none" stroke-opacity="0.5" d="M0,0h100V100H0Z"/>
		<path style="opacity:50%" fill="none" stroke-opacity="50%" d="M110,0l100,0,0,100,-100,0Z"/>
		<path d="M110,0l100,0,0,100,-100,0Z"/>
		<rect />
		<path fill="none" d="M100.5.5H100Z" /><path fill="none" d="M200.5.5H100Z" />
		<path fill="none" stroke="none" d="M100.5.5H100Z" style="opacity:1;" /><path fill="none" stroke="none" d="M200.5.5H100Z" style="opacity:1;" />
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-path');
		await combinePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><path style="opacity:1" fill="none" stroke-opacity="0.5" d="M0,0h100V100H0Z"/><path style="opacity:50%" fill="none" stroke-opacity="50%" d="M110,0l100,0,0,100,-100,0Z"/><path d="M110,0l100,0,0,100,-100,0Z"/><rect/><path fill="none" d="M100.5.5H100ZM200.5.5H100Z"/><path fill="none" stroke="none" d="M100.5.5H100ZM200.5.5H100Z" style="opacity:1;"/></svg>');
	});

	test('合并填充', async () => {
		const xml = `<svg>
		<path fill="red" d="M100.5.5H100Z" style="opacity:100%;fill-opacity:1" /><path fill="red" d="M200.5.5H100Z" style="opacity:100%;fill-opacity:1" />
		<path d="M100.5.5H100Z" style="opacity:100%;fill-opacity:1" /><path d="M200.5.5H100Z" style="opacity:100%;fill-opacity:1" />
		<path fill-rule="evenodd" d="M100.5.5H100Z" /><path fill-rule="evenodd" d="M200.5.5H100Z" />
		<path marker-start="#a" d="M100.5.5H100Z" /><path marker-start="#a" d="M200.5.5H100Z" />
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			rules: {
				'combine-path': [true, {
					disregardFill: true,
				}]
			}
		}), 'combine-path');
		await combinePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><path fill="red" d="M100.5.5H100ZM200.5.5H100Z" style="opacity:100%;fill-opacity:1"/><path d="M100.5.5H100ZM200.5.5H100Z" style="opacity:100%;fill-opacity:1"/><path fill-rule="evenodd" d="M100.5.5H100Z"/><path fill-rule="evenodd" d="M200.5.5H100Z"/><path marker-start="#a" d="M100.5.5H100Z"/><path marker-start="#a" d="M200.5.5H100Z"/></svg>');
	});

	test('合并半透明', async () => {
		const xml = `<svg>
		<path fill="red" d="M100.5.5H100Z" stroke="red" style="opacity:50%;stroke-opacity:1;fill-opacity:1" /><path fill="red" d="M200.5.5H100Z" stroke="red" style="opacity:50%;stroke-opacity:1;fill-opacity:1" />
		<path d="M100.5.5H100Z" style="opacity:100%;fill-opacity:.5" /><path d="M200.5.5H100Z" style="opacity:100%;fill-opacity:50%" />
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			rules: {
				'combine-path': [true, {
					disregardFill: true,
					disregardOpacity: true,
				}],
			},
		}), 'combine-path');
		await combinePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><path fill="red" d="M100.5.5H100ZM200.5.5H100Z" stroke="red" style="opacity:50%;stroke-opacity:1;fill-opacity:1"/><path d="M100.5.5H100ZM200.5.5H100Z" style="opacity:100%;fill-opacity:.5"/></svg>');
	});

	test('包含子节点', async () => {
		const xml = `<svg>
		<path d="M100.5.5H100Z" />
		<path d="M200.5.5H100Z"><animate attributeName="opacity" from="1" to="0" dur="5s" repeatCount="indefinite" /></path>
		<path d="M200.5.5H100Z" />
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-path');
		await combinePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><path d="M100.5.5H100Z"/><path d="M200.5.5H100Z"><animate attributeName="opacity" from="1" to="0" dur="5s" repeatCount="indefinite"/></path><path d="M200.5.5H100Z"/></svg>');
	});

	test('不在一个父节点下', async () => {
		const xml = `<svg>
		<path d="M100.5.5H100Z" />
		<g><path d="M200.5.5H100Z" /></g>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-path');
		await combinePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><path d="M100.5.5H100Z"/><g><path d="M200.5.5H100Z"/></g></svg>');
	});

	test('样式不同不能合并', async () => {
		const xml = `<svg>
		<path d="M100.5.5H100Z" style="fill:red"/>
		<path d="M200.5.5H100Z" style="fill:blue"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-path');
		await combinePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><path d="M100.5.5H100Z" style="fill:red"/><path d="M200.5.5H100Z" style="fill:blue"/></svg>');
	});
});
