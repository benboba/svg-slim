import { parse } from 'svg-vdom';
import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { computePath } from '../../src/rules/compute-path';
import { createXML } from '../../src/xml/create';

describe('rules/compute-path', () => {
	test('重新计算路径', async () => {
		const xml = `<svg>
		<path/>
		<path d="M30,30"/>
		<path stroke="red" d="M100,100H10H20V10V20"/>
		<path d="M0,0,100,200,300,299,299" />
		<path d="M5e5.1L-1-1,0,0,10,0,20,0,50,0,100,0,100,100,0,100Z" />
		<path d="M80 80 A 45 45, 0, 0, 0, 125 125 45 45, 0, 0, 0, 170 80 45 45, 0, 0, 0, 125 35 45 45, 0, 0, 0, 80 80 Z" />
		<path d="M0 0 Q0 100 100 100 Q 200 100 200 0 Z m0 0zZzZM100 100 m 30 30" />
		<path d="M 0 0 C 50 0 50 100 100 100 150 100 150 50 150 0Z" />
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'compute-path');
		await computePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><path stroke="red" d="m1e2,1e2H10,20V10,20"/><path d="m0,0,1e2,2e2,2e2,99"/><path d="m5e5.1L-1-1,0,0h1e2v1e2H0z"/><path d="m80,80a45,45,0,0045,45,45,45,0,10-45-45z"/><path d="m0,0q0,1e2,1e2,1e2T2e2,0z"/><path d="m0,0c50,0,50,1e2,1e2,1e2s50-50,50-1e2z"/></svg>');
	});

	test('道格拉斯普克', async () => {
		const xml = `<svg stroke="red">
		<path d="M0,0V100,200,300,299,299"/>
		<path d="M0,0H100,200,300,299,299"/>
		<path d="M300,0H100,200,300,299,299"/>
		<path d="M0,300V100,200,300,299,299"/>
		<path d="M0,0L0,0,0,0,10,11,15,16,16,17,17,18,20,20T10,10"/>
		<path d="M300,300L0,0,0,0,10,11,15,16,16,17,17,18,20,20S15,15,10,10"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			params: {
				thinning: 10,
			},
		}), 'compute-path');
		await computePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg stroke="red"><path d="m0,0v3e2-1"/><path d="m0,0h3e2-1"/><path d="m3e2,0H1e2,3e2h-1"/><path d="m0,3e2V1e2,3e2v-1"/><path d="m0,0,20,20L10,10"/><path d="m3e2,3e2L0,0,20,20,10,10"/></svg>');
	});

	test('优化无 stroke 的 path', async () => {
		const xml = `<svg>
		<path d="m0,0,10,10,10,10,-20,-20V100,200,300,299,299z" />
		<path d="M0,0,10,10,zl1,1,-11,-11z"/>
		<path d="M30,30,31,31,zl1,1,-11,-11z"/>
		<path d="M0,0h100,200,100,50"/>
		<path d="m0,0Q200,0,100,100Q200,0,0,0zM0,0C50,0,100,100,150,0,100,100,50,0,0,0z"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'compute-path');
		await computePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg></svg>');
	});

	test('曲线转直线', async () => {
		const xml = `<svg stroke="red">
		<path d="M0,0A4,4,1,0,0,2,3C5,5,2,2,7,7l6,2t1,1,9,9,-1,2"/>
		<path d="M1000,0A4,4,1,0,0,90,90M100,100Q0,0,9,9Q7,8,8,7"/>
		<path d="M100,100a6,6,1,0,0,2,3T35,35"/>
		<path d="M0,0Q100,0,100,100t5,5M0,0C0,0,100,0,100,100s5,5,6,6"/>
		<path d="M90,90c5,5,5,0,8,8S5,5,6,6"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			params: {
				straighten: 10,
			},
		}), 'compute-path');
		await computePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg stroke="red"><path d="m0,0,2,3,5,4,6,2t1,1,9,9-1,2"/><path d="m1e3,0A4,4,1,0090,90m10,10Q0,0,9,9L8,7"/><path d="m1e2,1e2a6,6,1,002,3L35,35"/><path d="m0,0q1e2,0,1e2,1e2t5,5M0,0s1e2,0,1e2,1e2l6,6"/><path d="m90,90c5,5,5,0,8,8S5,5,6,6"/></svg>');
	});

	test('marker', async () => {
		const xml = `<svg>
		<defs>
			<marker id="m1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8">
				<circle r="5"/>
			</marker>
		</defs>
		<path d="M0,0" marker-start="url(#m1)"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			params: {
				straighten: 10,
			},
		}), 'compute-path');
		await computePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><defs><marker id="m1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8"><circle r="5"/></marker></defs><path d="m0,0" marker-start="url(#m1)"/></svg>');
	});

	test('animateMotion', async () => {
		const xml = '<svg><animateMotion path="M0,0"/><animateMotion/></svg>';
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'compute-path');
		await computePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><animateMotion/><animateMotion/></svg>');
	});

	test('with animate', async () => {
		const xml = `<svg>
			<path>
				<animate attributeName="d" to="M5e5.1L-1-1,0,0,10,0,20,0,50,0,1e2,0,1e2,1e2,0,1e2Z" values="M5e5.1L-1-1,0,0,10,0,20,0,50,0,1e2,0,1e2,1e2,0,1e2Z"/>
			</path>
			<path>
				<animate attributeName="d" from="M0,0" values="M30,30"/>
			</path>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'compute-path');
		await computePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><path><animate attributeName="d" to="m5e5.1L-1-1,0,0h1e2v1e2H0z" values="m5e5.1L-1-1,0,0h1e2v1e2H0z"/></path></svg>');
	});

	test('mergePoints', async () => {
		const xml = `<svg stroke="red">
		<path d="M0,0L4,4H6V6"/>
		<path d="M0,0L4,4,6,6,20,10Z"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig({
			params: {
				mergePoint: 3,
			},
		}), 'compute-path');
		await computePath(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg stroke="red"><path d="m0,0,5.5,5"/><path d="m0,0,5,5,15,5z"/></svg>');
	});
});
