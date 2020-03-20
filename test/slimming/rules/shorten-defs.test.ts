import chai = require('chai');
const should = chai.should();
import { shortenDefs } from '../../../src/slimming/rules/shorten-defs';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { combineStyle } from '../../../src/slimming/default-rules/combine-style';


describe('rules/shorten-defs', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
				<defs>
				<pattern id="a">
					<path d="M 0 0 L 7 0 L 3.5 7 z" />
				</pattern>
			</defs>
				</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenDefs([false], dom);
		createXML(dom).should.equal('<svg> <defs> <pattern id="a"> <path d="M 0 0 L 7 0 L 3.5 7 z"/> </pattern> </defs> </svg>');
	});

	it('优化 defs', async () => {
		const xml = `<svg>
			<defs>
				<pattern id="TrianglePattern">
					<path d="M 0 0 L 7 0 L 3.5 7 z" />
				</pattern>
				<ellipse fill="url(#TrianglePattern)" />
			</defs>
			<defs>
				<ellipse fill="url(where)" />
				<ellipse fill="url(#where)" />
				<ellipse fill="url(#where)" />
				<pattern>
					<path d="M 0 0 L 7 0 L 3.5 7 z" />
				</pattern>
				<pattern id="nouse">
					<path d="M 0 0 L 7 0 L 3.5 7 z" />
				</pattern>
			</defs>
			<mask id="mask-2" fill="white">
				<use xlink:href="#path-1" />
				<use xlink:href="where" />
			</mask>
			<ellipse fill="url(#t1)" />
			<defs>
				<g>
					<g>
						<polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"></polygon>
					</g>
				</g>
				<pattern id="t1">
					<path d="M 0 0 L 7 0 L 3.5 7 z" />
				</pattern>
			</defs>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenDefs([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><defs><pattern id="t1"><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern></defs><mask id="mask-2" fill="white"><polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/><use xlink:href="where"/></mask><ellipse fill="url(#t1)"/></svg>');
	});

	it('mask out of defs', async () => {
		const xml = `<svg>
			<defs>
				<circle id="a" cx="40" cy="40" r="40"/>
			</defs>
			<mask id="b" fill="#fff"><use xlink:href="#a"/></mask>
			<use href="#a"/>
			<path d="m22.86,55.24L53.5,97,96,83,62.86,38.1l-40,17.14z" fill="#19b955" mask="url(#b)"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenDefs([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><defs><circle id="a" cx="40" cy="40" r="40"/></defs><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><use href="#a"/><path d="m22.86,55.24L53.5,97,96,83,62.86,38.1l-40,17.14z" fill="#19b955" mask="url(#b)"/></svg>');
	});

	it('cant apply use', async () => {
		const xml = `<svg>
			<defs>
				<circle id="a"/>
				<circle id="b"/>
				<svg id="c"/>
				<svg id="d"/>
				<circle id="e"/>
				<text id="f"/>
				<circle id="g"/>
			</defs>
			<style> use { fill: red; } </style>
			<use href="#a" x="1"/>
			<use href="#b" y="1"/>
			<use href="#c" width="1"/>
			<use href="#d" height="1"/>
			<use href="#e"/>
			<animateMotion><mpath href="#f"/></animateMotion>
			<mask href="#g"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await combineStyle(dom);
		await shortenDefs([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><defs><circle id="a"/><circle id="b"/><svg id="c"/><svg id="d"/><circle id="e"/><circle id="g"/></defs><style>use{fill:red}</style><use href="#a" x="1"/><use href="#b" y="1"/><use href="#c" width="1"/><use href="#d" height="1"/><use href="#e"/><mask href="#g"/></svg>');
	});

	it('apply use', async () => {
		const xml = `<svg>
			<defs>
				<svg id="a" style="fill-rule:even-odd"/>
				<rect id="b"/>
				<path id="c"/>
				<path id="d" d="M0,0H100"/>
				<text id="e"/>
				<rect id="f" style="fill:blue;opacity:.6"/>
			</defs>
			<use href="#a" fill="red" style="opacity:.5"/>
			<animateMotion><mpath href="#b"/><mpath href="#c"/><mpath href="#e"/></animateMotion>
			<animateMotion><mpath href="#d"/></animateMotion>
			<use href="#f" fill="red" style="opacity:.5"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenDefs([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><defs><rect id="b"/><path id="c"/></defs><svg id="a" style="fill-rule:even-odd;opacity:.5" fill="red"/><animateMotion><mpath href="#b"/><mpath href="#c"/></animateMotion><animateMotion path="M0,0H100"/><rect id="f" style="fill:blue;opacity:.6"/></svg>');
	});
});
