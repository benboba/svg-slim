import { parse } from 'svg-vdom';
import { combineStyle } from '../../src/default-rules/combine-style';
import { parseStyleTree } from '../../src/xml/parse-style-tree';
import { ITag } from '../../typings/node';
import { IStyleObj } from '../../typings/style';

describe('xml/parse-style-tree', () => {
	test('parse error', async () => {
		const dom = await parse(`<svg>
		<style></style>
		<style>error</style>
		</svg>`);
		await combineStyle(dom);
		parseStyleTree(dom);
		expect(Object.hasOwnProperty.call(dom, 'styles')).toBeFalsy;
	});

	test('parse style tree', async () => {
		const dom = await parse(`<svg>
		<style>
		@import 'a.css';
		text {
			fill: green;
		}
		g text {
			fill: yellow;
		}
		undef {
			fill: green;
		}
		mask + mask {
			fill: green;
		}
		#mask-3 {
			fill: black;
		}
		mask {
			fill: red!important;
		}
		mask:hover {
			fill: grey;
		}
		</style>
		<defs>
			<pattern id="TrianglePattern">
				<path d="M 0 0 L 7 0 L 3.5 7 z"/>
			</pattern>
			<polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/>
		</defs>
		<ellipse id="ell" font-family="Arial" fill="url(#TrianglePattern)"/>
		<mask style="stroke: none;fill: blue;" font-family="Arial" id="mask-2"><use xlink:href="#path-1"/></mask>
		<mask style="stroke: none;fill: white;" font-family="Arial" id="mask-3" xlink:href="#mask-3"/>
		<mask xlink:href="#use"><use id="use"/></mask>
		<mask fill="yellow" xlink:href="#ell"/>
		<g style="stroke:none;fill: blue;" fill="red"><text>123</text></g>
		</svg>`);
		await combineStyle(dom);
		parseStyleTree(dom);
		expect(dom.hasOwnProperty('styles')).toBeFalsy;
		expect(dom.hasOwnProperty('stylesheet')).toBeTruthy;
		expect(dom.hasOwnProperty('styletag')).toBeTruthy;
		const styles = (dom.querySelector('#mask-3') as ITag).styles as IStyleObj;
		expect(styles.fill.value).toBe('red');
	});
});
