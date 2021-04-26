import { parse } from 'svg-vdom';
import { combineStyle } from '../../src/default-rules/combine-style';
import { shortenID } from '../../src/rules/shorten-id';
import { createXML } from '../../src/xml/create';

describe('rules/shorten-id', () => {
	test('缩短 id', async () => {
		const xml = `<svg>
		<style>
		@import('test.css');
		#red {
			fill: red;
		}
		#green, #red {
			fill: green;
			stroke: red;
		}
		#green {
			fill: green;
		}
		</style>
		<rect id="red" width="100" height="100"/>
		<circle id="red"/>
		<rect id="blue" width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		await shortenID(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><style>@import (\'test.css\');#a{fill:red}#a{fill:green;stroke:red}</style><rect id="a" width="100" height="100"/><circle/><rect width="100" height="100"/></svg>');
	});

	test('缩短 id 移除 style 的情况', async () => {
		const xml = `<svg>
		<style>
		#red {
			fill: red;
		}
		</style>
		<defs>
		<pattern id="TrianglePattern">
		  <path d="M 0 0 L 7 0 L 3.5 7 z" />
		</pattern>
		<polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"></polygon>
	  </defs>
	  <ellipse fill="url(#TrianglePattern)" />
	<mask id="mask-2" fill="white" xlink:href="test">
		<use xlink:href="#path-1" style="fill:url(#tst)"/>
		</mask>
		<use href="#path-1" style="fill:url(#TrianglePattern1);color:red"/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		await shortenID(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><defs><pattern id="b"><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern><polygon id="c" points="46 0 46 52 0 52 0 0 46 0"/></defs><ellipse fill="url(#b)"/><mask fill="white" xlink:href="test"><use xlink:href="#c"/></mask><use href="#c" style="color:red"/></svg>');
	});

	test('缩短 id 无法解析 style 的情况', async () => {
		const xml = `<svg>
		<style>test</style>
		<rect fill="url(#test)" id="a" width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		await shortenID(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><rect width="100" height="100"/></svg>');
	});

	test('缩短 id 无 style 的情况', async () => {
		const xml = `<svg>
		<rect fill="url(#test)" width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml);
		await shortenID(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><rect width="100" height="100"/></svg>');
	});

	test('id 被多次引用的情况', async () => {
		const xml = `<svg>
		<style>
		#red {
			fill: red;
		}
		</style>
		<mask xlink:href="#red">
			<use xlink:href="#red"/>
		</mask>
		</svg>`;
		const dom = await parse(xml);
		await combineStyle(dom);
		await shortenID(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><mask><use/></mask></svg>');
	});
});
