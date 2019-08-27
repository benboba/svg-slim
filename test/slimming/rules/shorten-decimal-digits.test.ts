import chai = require('chai');
const should = chai.should();
import { shortenDecimalDigits } from '../../../src/slimming/rules/shorten-decimal-digits';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


describe('rules/shorten-decimal-digits', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
        <polygon stroke-width="1.999" opacity="0.00099999" points="200000 , 0.1   -1.1 0.5" />
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenDecimalDigits([false], dom);
		createXML(dom).should.equal('<svg> <polygon stroke-width="1.999" opacity="0.00099999" points="200000 , 0.1 -1.1 0.5"/> </svg>');
	});

	it('缩短数字', async () => {
        const xml = `<svg>
        <style>
        @import('test.css');
        .a {
            title: '';
            opacity: 0.0999;
            width: 500000
        }
        </style>
        <animate to="-0.55" attributeName="x"/>
        <animate to="0.5001" attributeName="opacity"/>
        <animate to="0.55" attributeName="title"/>
        <animate to="0.55"/>
        <rect opacity="1.999" style="x:1.15;title:a" />
        <polygon stroke-width="1.999" style="opacity:0.00099999" points="200000 , 0.1   -1.1 0.5" />
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenDecimalDigits([true, 1, 3], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><style>@import ('test.css');.a{title:'';opacity:.1;width:5e5}</style><animate to="-.6" attributeName="x"/><animate to=".5" attributeName="opacity"/><animate to="0.55" attributeName="title"/><animate to="0.55"/><rect opacity="1.999" style="x:1.2;title:a"/><polygon stroke-width="2" style="opacity:.001" points="2e5.1-1.1.5"/></svg>`);
	});

	it('badcase', async () => {
        const xml = `<svg>
        <style>bang!</style>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenDecimalDigits([true, 1, 3], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg></svg>`);
	});
});
