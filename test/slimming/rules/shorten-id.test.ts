import chai = require('chai');
const should = chai.should();
import { shortenID } from '../../../src/slimming/rules/shorten-id';
import { combineStyle } from '../../../src/slimming/default-rules/combine-style';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';


describe('rules/shorten-id', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
		<style>#a {
			fill: red;
		}
		</style>
		<rect id="a" width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenID([false], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><style>#a { fill: red; } </style><rect id="a" width="100" height="100"/></svg>');
	});

	it('缩短 id', async () => {
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
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenID([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><style>@import ('test.css');#a{fill:red}#a{fill:green;stroke:red}</style><rect id="a" width="100" height="100"/><circle/><rect width="100" height="100"/></svg>`);
	});

	it('缩短 id 移除 style 的情况', async () => {
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
		<use xlink:href="#path-1" />
	</mask>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenID([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><defs><pattern id="b"><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern><polygon id="c" points="46 0 46 52 0 52 0 0 46 0"/></defs><ellipse fill="url(#b)"/><mask fill="white" xlink:href="test"><use xlink:href="#c"/></mask></svg>');
	});

	it('缩短 id 无法解析 style 的情况', async () => {
		const xml = `<svg>
		<style>test</style>
		<rect fill="url(#test)" id="a" width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenID([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect width="100" height="100"/></svg>');
	});

	it('缩短 id 无 style 的情况', async () => {
		const xml = `<svg>
		<rect fill="url(#test)" width="100" height="100"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenID([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect width="100" height="100"/></svg>');
	});
});
