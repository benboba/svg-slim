import chai = require('chai');
const should = chai.should();
import { shortenDefs } from '../../../src/slimming/rules/shorten-defs';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';


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

	it('缩短数字', async () => {
        const xml = `<svg>
        <defs>
        <pattern id="TrianglePattern">
          <path d="M 0 0 L 7 0 L 3.5 7 z" />
        </pattern> 
      </defs>
      <ellipse fill="url(#TrianglePattern)" />
      <defs>
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
    <defs>
        <polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"></polygon>
    </defs>
        </svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenDefs([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal(`<svg><defs><pattern id="TrianglePattern"><path d="M 0 0 L 7 0 L 3.5 7 z"/></pattern><polygon id="path-1" points="46 0 46 52 0 52 0 0 46 0"/></defs><ellipse fill="url(#TrianglePattern)"/><mask id="mask-2" fill="white"><use xlink:href="#path-1"/><use xlink:href="where"/></mask></svg>`);
	});
});