import chai = require('chai');
const should = chai.should();
import { shortenColor } from '../../../src/slimming/rules/shorten-color';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


describe('rules/shorten-color', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
        <rect fill="#f00"/>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenColor([false], dom);
		createXML(dom).should.equal('<svg> <rect fill="#f00"/> </svg>');
	});

	it('转换形状为路径', async () => {
        const xml = `<svg>
        <style>
        .a {
            fill: currentColor;
            x: 100;
        }
        </style>
        <rect style="fill:#ff0000" stroke="rebeccapurple" color="hsla(0,100%,100%,0)" />
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenColor([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><style>.a{fill:currentColor;x:100}</style><rect style="fill:red" stroke="#639" color="rgb(255,255,0,0)"/></svg>');
	});

	it('rgba 及 style 无法解析', async () => {
        const xml = `<svg>
        <style>oops</style>
        <rect width="100" style="fill:#ff000000;height:100" stroke="rgba(101,234,113,0.322)" color="transparent" />
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenColor([true, true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><rect width="100" style="fill:#f000;height:100" stroke="#65ea7152" color="#0000"/></svg>');
	});
});
