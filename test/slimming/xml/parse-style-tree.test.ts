const chai = require('chai');
const should = chai.should();
import { parseStyleTree } from '../../../src/slimming/xml/parse-style-tree';
import { combineStyle } from '../../../src/slimming/default-rules/combine-style';
import { parse } from '../../../src/xml-parser';


describe('xml/parse-style-tree', () => {
	it('parse error', async () => {
		const dom = await parse(`<svg>
		<style></style>
		<style>error</style>
		</svg>`) as ITagNode;
		await combineStyle(dom);
		parseStyleTree(dom);
		Object.hasOwnProperty.call(dom, 'styles').should.equal(false);
	});

	it('parse style tree', async () => {
		const dom = await parse(`<svg>
		<style>
		@import 'a.css';
		mask {
			fill: red;
		}
		text {
			fill: green;
		}
		g text {
			fill: yellow;
		}
		undef {
			fill: green;
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
		<mask style="stroke: none;" font-family="Arial" id="mask-3" xlink:href="#mask-3"/>
		<mask xlink:href="#use"><use id="use"/></mask>
		<mask xlink:href="#ell"/>
		<g style="stroke:none;fill: blue;" fill="red"><text>123</text></g>
		</svg>`) as ITagNode;
		await combineStyle(dom);
		parseStyleTree(dom);
		Object.hasOwnProperty.call(dom, 'styles').should.equal(false);
	});
});
