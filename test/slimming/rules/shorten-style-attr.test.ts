import chai = require('chai');
const should = chai.should();
import { shortenStyleAttr } from '../../../src/slimming/rules/shorten-style-attr';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


describe('rules/shorten-style-attr', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
        <rect fill="none" style="fill:blue"/>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenStyleAttr([false], dom);
		createXML(dom).should.equal('<svg> <rect fill="none" style="fill:blue"/> </svg>');
	});

	it('缩短 style 属性', async () => {
        const xml = `<svg>
        <g fill="none" style="fill:blue">
        <text title="123" fill="red" stroke="red" style="font-family: &quot;微软雅黑&quot;;fill: rebeccapurple; stroke: blue; flex-grow: 1;">123</text>
        <g fill="#fff">
            <rect style="file:blue" x="1"/>
        </g>
        </g>
        <rect stroke="red" fill="red" style="fill:blue"/>
        <text title="444" style="fill:red" fill="red" stroke="blue" font-family="Arial" font-weight="700" direction="ltr" fill-opacity="0.5">345</text>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenStyleAttr([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><g><text title="123" stroke="blue" fill="rebeccapurple" font-family="&quot;微软雅黑&quot;">123</text><g fill="#fff"><rect x="1"/></g></g><rect stroke="red" fill="blue"/><text title="444" style="fill-opacity:0.5;direction:ltr;font-weight:700;font-family:Arial;stroke:blue;fill:red">345</text></svg>`);
    });

	it('深度继承的情况', async () => {
        const xml = `<svg>
        <defs>
            <pattern id="TrianglePattern">
                <path d="M 0 0 L 7 0 L 3.5 7 z" xlink:href="#ell"/>
                <path d="M 0 0 L 7 0 L 3.5 7 z"/>
            </pattern>
            <polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/>
        </defs>
        <ellipse font-family="Arial" id="ell" fill="url(#TrianglePattern)"/>
        <ellipse font-family="Arial" fill="red" xlink:href="#path-1"/>
        <mask font-family="Arial" id="mask-2" fill="white"><use xlink:href="#path-1"/><use xlink:href="#path-2"/></mask>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenStyleAttr([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><defs><pattern id="TrianglePattern"><path d="M 0 0 L 7 0 L 3.5 7 z" xlink:href="#ell"/><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern><polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/></defs><ellipse id="ell" fill="url(#TrianglePattern)"/><ellipse fill="red" xlink:href="#path-1"/><mask id="mask-2" fill="white"><use xlink:href="#path-1"/><use xlink:href="#path-2"/></mask></svg>`);
	});
});