import { createRuleConfig } from '../../src/config/create-rule-config';
import { mergeConfig } from '../../src/config/merge';
import { combineTransform } from '../../src/rules/combine-transform';
import { createXML } from '../../src/xml/create';
import { parse } from 'svg-vdom';

describe('rules/combine-transform', () => {
	test('合并 Transform', async () => {
		const xml = `<svg>
		<text transform="scale(2) translate(100,100) skewX(-15) skewX(15) translate(-100-100) scale(0.5)">1</text>
		<text transform="scale(1.9999999)scale(1.9999999)">2</text>
		<text transform="scale(1.32034) translate(10,0.1) rotate(90)">3</text>
		<text transform="matrix(2,0,0,3,0,0)">4</text>
		<text transform="matrix(1,0,0,1,1,0)translate(-1)">5</text>
		<g transform="matrix(-0.988,0.156,0.156,0.988,-10,-10)"></g>
		<pattern patternTransform="matrix(0.988,-0.156,0.156,0.988,0,0)"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-transform');
		await combineTransform(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><text>1</text><text transform="scale(4)">2</text><text transform="matrix(0,1.32-1.32,0,13.2.13)">3</text><text transform="scale(2,3)">4</text><text>5</text><g transform="matrix(-.988.156.156.988-10-10)"/><pattern patternTransform="rotate(-8.97)"/></svg>');
	});

	test('3 值 rotate', async () => {
		const xml = `<svg>
		<text transform="translate(19.6, 16.6) rotate(-45.000000) translate(-19.6, -16.6)">1</text>
		<text transform="rotate(-45,19.6,16.6)">2</text>
		<text transform="translate(15, 38.7) scale(-1, -1) translate(-15, -38.7)">3</text>
		<text transform="translate(7.500000, 7.500000) rotate(-180.000000) translate(-7.500000, -7.500000)">4</text>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-transform');
		await combineTransform(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><text transform="rotate(315,19.6,16.6)">1</text><text transform="rotate(-45,19.6,16.6)">2</text><text transform="rotate(180,15,38.7)">3</text><text transform="rotate(180,7.5,7.5)">4</text></svg>');
	});

	test('can"t apply transform', async () => {
		const xml = `<svg>
		<text transform="translate(1)" x="2pt">3</text>
		<rect transform="rotate(90)" marker-start="#a" rx="3" ry="2"/>
		<rect transform="scale(1.5)" stroke="black"/>
		<rect transform="rotate(-90)" ry="1rem"/>
		<rect transform="rotate(45)"/>
		<rect transform="matrix(2,0,1,2,5,5)" x="3"/>
		<rect transform="skewX(45)"/>
		<line transform="rotate(-90)" y2="1rem"/>
		<line transform="rotate(90)" marker-start="#a"/>
		<line transform="skewX(45)"/>
		<circle transform="rotate(90)" marker-start="#a"/>
		<circle transform="translate(1)" cy="1pt"/>
		<circle transform="matrix(2,0,1,2,5,5)" r="5"/>
		<circle transform="skewX(45)"/>
		<ellipse transform="rotate(90)" marker-start="#a"/>
		<ellipse transform="rotate(15)" rx="2" ry="3"/>
		<ellipse transform="translate(1)" cy="1pt" rx="2" ry="3"/>
		<ellipse transform="matrix(2,0,1,2,5,5)" rx="2" ry="3"/>
		<ellipse transform="skewX(45)" rx="2" ry="3"/>
		<ellipse transform="rotate(90)" rx="2" ry="30%"/>
		<polygon transform="scale(2)" stroke="red"/>
		<polygon transform="rotate(90)" marker-start="#a"/>
		<path transform="rotate(90)" marker-start="#a"/>
		<path transform="scale(2)" stroke="red"/>
		<path transform="skewX(90)" d="m0,0a5,5,1,0,1,10,10"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-transform');
		await combineTransform(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><text transform="translate(1)" x="2pt">3</text><rect transform="rotate(90)" marker-start="#a" rx="3" ry="2"/><rect transform="scale(1.5)" stroke="black"/><rect transform="rotate(-90)" ry="1rem"/><rect transform="rotate(45)"/><rect transform="matrix(2,0,1,2,5,5)" x="3"/><rect transform="skewX(45)"/><line transform="rotate(-90)" y2="1rem"/><line transform="rotate(90)" marker-start="#a"/><line transform="skewX(45)"/><circle transform="rotate(90)" marker-start="#a"/><circle transform="translate(1)" cy="1pt"/><circle transform="matrix(2,0,1,2,5,5)" r="5"/><circle transform="skewX(45)"/><ellipse transform="rotate(90)" marker-start="#a"/><ellipse transform="rotate(15)" rx="2" ry="3"/><ellipse transform="translate(1)" cy="1pt" rx="2" ry="3"/><ellipse transform="matrix(2,0,1,2,5,5)" rx="2" ry="3"/><ellipse transform="skewX(45)" rx="2" ry="3"/><ellipse transform="rotate(90)" rx="2" ry="30%"/><polygon transform="scale(2)" stroke="red"/><polygon transform="rotate(90)" marker-start="#a"/><path transform="rotate(90)" marker-start="#a"/><path transform="scale(2)" stroke="red"/><path transform="skewX(90)" d="m0,0a5,5,1,0,1,10,10"/></svg>');
	});

	test('apply transform', async () => {
		const xml = `<svg>
		<text transform="translate(5, 6)">1</text>
		<text transform="translate(5)" dx="3">2</text>
		<rect transform="translate(1)" ry="3"/>
		<rect transform="rotate(90)" style="x:100;y:10;width:100;height:50"/>
		<rect transform="rotate(90)" width="1" height="2" rx="2" ry="1"/>
		<rect transform="rotate(180, 50, 50)" width="100" height="50"/>
		<rect transform="scale(2,4)" rx="1" ry=".5"/>
		<rect transform="scale(2)" width="3"/>
		<rect transform="scale(1,2)" rx="3"/>
		<rect transform="matrix(2,0,0,2,5,5)" x="3"/>
		<rect transform="matrix(2,0,0,2,5,5)" rx="1" ry=".5"/>
		<line transform="translate(1)"/>
		<line transform="rotate(90)" x2="10"/>
		<line transform="rotate(180,5,0)" x2="10"/>
		<circle transform="translate(1)" cy="1"/>
		<circle transform="rotate(15)"/>
		<circle transform="rotate(90 0 10)"/>
		<circle transform="scale(2)" cx="3" r="5"/>
		<circle transform="scale(2, 1)" cx="3" r="5"/>
		<circle transform="matrix(2, 0,0,2,5,0)" r="5"/>
		<circle transform="matrix(2, 0,0,1,5,0)" r="5"/>
		<ellipse transform="translate(1)" cy="1" rx="3" ry="5"/>
		<ellipse transform="rotate(90)" rx="3" ry="5"/>
		<ellipse transform="rotate(180,0,10)" rx="3" ry="5"/>
		<ellipse transform="scale(2)" rx="3" ry="5"/>
		<ellipse transform="scale(1, 2)" rx="4" ry="2"/>
		<ellipse transform="matrix(2, 0,0,2,5,0)" rx="5" ry="2"/>
		<ellipse transform="matrix(2, 0,0,1,5,0)" rx="2" ry="4"/>
		<ellipse style="fill:red" transform="translate(1)" rx="3"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-transform');
		await combineTransform(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><text x="5" y="6">1</text><text dx="3" x="5">2</text><rect ry="3" x="1"/><rect style="x:-60;y:100;width:50;height:100"/><rect width="2" height="1" rx="1" ry="2" x="-2"/><rect width="100" height="50" y="50"/><rect rx="2"/><rect width="6"/><rect rx="3" ry="6"/><rect x="11" y="5"/><rect rx="2" ry="1" x="5" y="5"/><line x1="1" x2="1"/><line y2="10"/><line x1="10"/><circle cy="1" cx="1"/><circle/><circle cx="10" cy="10"/><circle cx="6" r="10"/><ellipse cx="6" rx="10" ry="5"/><circle r="10" cx="5"/><ellipse cx="5" rx="10" ry="5"/><ellipse cy="1" rx="3" ry="5" cx="1"/><ellipse rx="5" ry="3"/><ellipse rx="3" ry="5" cy="20"/><ellipse rx="6" ry="10"/><circle r="4"/><ellipse rx="10" ry="4" cx="5"/><circle cx="5" r="4"/><circle style="fill:red" r="3" cx="1"/></svg>');
	});

	test('apply transform poly and path', async () => {
		const xml = `<svg>
		<polyline transform="translate(1,2)" points="0,0,1,1,2"/>
		<polygon transform="translate(1)" points="0,0,1,1"/>
		<polyline transform="rotate(90)" points="0,0,1,1"/>
		<polyline transform="rotate(180,1,0)" points="0,0,1,1"/>
		<polygon transform="scale(2)" points="0,0,1,1"/>
		<polygon transform="matrix(2,0,0,1,2,0)" points="0,0,1,1"/>
		<polygon transform="translate(1e5)" points="0,0,1,1,2,1,3,0,5,1,2,4,1"/>
		<polygon transform="scale(985)" points="3,2,1,1,2,1,3,6,5,9,2,4,1"/>
		<path transform="translate(1)" d="m0,0h100v100a5,5,0,0,0,-5,-5zm5,5,3,3"/>
		<path transform="translate(1,1)" d="m100,100H-9V-9A5,5,0,0,0,5,5M-1,-99T98,8,5,5"/>
		<path transform="translate(-1,1)" d="M1e9,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9"/>
		<path transform="scale(99)" d="M2e9,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9"/>
		<path transform="scale(2)" d="m100,100H-4V-4A5,5,0,0,0,4,4M-1,-49T49,4,5,5m0,0z"/>
		<path transform="scale(2,1)" d="m100,100H-4V-4A5,5,0,0,0,4,4M-1,-49T49,4,5,5m0,0z"/>
		<path transform="rotate(5)" d="m100,100h5,v5L-4,-4Q9,9,99,99q0,0,4,4l18,18z"/>
		<path transform="rotate(30,15,15)" d="m100,100H-4V-4t0,0,4,4M-1,-49T49,4,5,5M0,0z"/>
		<path transform="skewX(75)" d="m100,100h-40v-40T0,0,4,4M-1,-49T49,4,5,5m0,0z"/>
		<path transform="skewY(-75)" d="m100,100H-4V-4t0,0,4,4M-1,-49T49,4,5,5m0,0z"/>
		<path transform="matrix(1.375,0.689,0.332,1.11,12.6,19.5)" d="m100,100H-4V-4t0,0,4,4M-1,-49T49,4,5,5m0,0z"/>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-transform');
		await combineTransform(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><polyline points="1,2,2,3"/><polygon points="1,0,2,1"/><polyline points="0,0-1,1"/><polyline points="2,0,1-1"/><polygon points="0,0,2,2"/><polygon points="2,0,4,1"/><polygon transform="translate(1e5)" points="0,0,1,1,2,1,3,0,5,1,2,4"/><polygon transform="scale(985)" points="3,2,1,1,2,1,3,6,5,9,2,4"/><path d="m1,0h1e2v1e2a5,5,0,00-5-5zm5,5,3,3"/><path d="m101,101H-8V-8A5,5,0,006,6M0-98T99,9,6,6"/><path transform="translate(-1,1)" d="M1e9,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9,0,0,1e9,1e9,0,0-1e9-1e9"/><path transform="scale(99)" d="M2e9,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9,0,0,2e9,2e9,0,0-2e9-2e9"/><path d="m2e2,2e2H-8V-8A10,10,0,008,8M-2-98T98,8,10,10m0,0z"/><path d="m2e2,1e2H-8V-4A10,5,0,008,4M-2-49T98,4,10,5m0,0z"/><path transform="rotate(5)" d="m100,100h5,v5L-4,-4Q9,9,99,99q0,0,4,4l18,18z"/><path transform="rotate(30,15,15)" d="m100,100H-4V-4t0,0,4,4M-1,-49T49,4,5,5M0,0z"/><path transform="skewX(75)" d="m100,100h-40v-40T0,0,4,4M-1,-49T49,4,5,5m0,0z"/><path transform="skewY(-75)" d="m100,100H-4V-4t0,0,4,4M-1,-49T49,4,5,5m0,0z"/><path d="m183.3,199.4-143-71.66L5.77,12.3t0,0T12.6,19.5M-5.04-35.58t86.35,93.28T21.14,28.5m0,0z"/></svg>');
	});

	test('apply transform with animate', async () => {
		const xml = `<svg>
			<rect transform="translate(1, 2)" stroke-width="0">
				<animate attributeName="y" to="5"/>
				<animate attributeName="stroke" to="red"/>
				<animate attributeName="stroke-width" to="3"/>
			</rect>
			<rect transform="rotate(90)">
				<animate attributeName="ry" to="5"/>
			</rect>
			<line transform="translate(1)">
				<animate attributeName="y2" to="5"/>
			</line>
			<circle transform="translate(1)">
				<animate attributeName="cx" to="5"/>
			</circle>
			<circle transform="scale(2)">
				<animate attributeName="r" to="5"/>
			</circle>
			<circle transform="matrix(2,0,0,2,5,5)" r="5">
				<animate attributeName="r" to="5"/>
			</circle>
			<ellipse transform="translate(1)">
				<animate attributeName="cx" to="5"/>
			</ellipse>
			<ellipse transform="scale(2)" rx="1" ry="2">
				<animate attributeName="ry" to="5"/>
			</ellipse>
			<ellipse transform="matrix(2,0,0,2,5,5)" rx="1" ry="2">
				<animate attributeName="ry" to="5"/>
			</ellipse>
			<polyline transform="translate(1)">
				<animate attributeName="points" to="5,5"/>
			</polyline>
			<path transform="translate(1)">
				<animate attributeName="d" to="5,5"/>
			</path>
			<path transform="scale(2)">
				<animate attributeName="marker-start" to="5,5"/>
			</path>
			<path transform="scale(2)">
				<animate attributeName="marker-mid" to="5,5"/>
			</path>
			<path transform="scale(2)">
				<animate attributeName="marker-end" to="5,5"/>
			</path>
		</svg>`;
		const dom = await parse(xml);
		const config = createRuleConfig(mergeConfig(null), 'combine-transform');
		await combineTransform(dom, config);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><rect transform="translate(1,2)" stroke-width="0"><animate attributeName="y" to="5"/><animate attributeName="stroke" to="red"/><animate attributeName="stroke-width" to="3"/></rect><rect transform="rotate(90)"><animate attributeName="ry" to="5"/></rect><line transform="translate(1)"><animate attributeName="y2" to="5"/></line><circle transform="translate(1)"><animate attributeName="cx" to="5"/></circle><circle transform="scale(2)"><animate attributeName="r" to="5"/></circle><circle transform="matrix(2,0,0,2,5,5)" r="5"><animate attributeName="r" to="5"/></circle><ellipse transform="translate(1)"><animate attributeName="cx" to="5"/></ellipse><ellipse transform="scale(2)" rx="1" ry="2"><animate attributeName="ry" to="5"/></ellipse><ellipse transform="matrix(2,0,0,2,5,5)" rx="1" ry="2"><animate attributeName="ry" to="5"/></ellipse><polyline transform="translate(1)"><animate attributeName="points" to="5,5"/></polyline><path transform="translate(1)"><animate attributeName="d" to="5,5"/></path><path transform="scale(2)"><animate attributeName="marker-start" to="5,5"/></path><path transform="scale(2)"><animate attributeName="marker-mid" to="5,5"/></path><path transform="scale(2)"><animate attributeName="marker-end" to="5,5"/></path></svg>');
	});
});
