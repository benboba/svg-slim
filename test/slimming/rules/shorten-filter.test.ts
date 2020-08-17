const chai = require('chai');
const should = chai.should();
import { shortenFilter } from '../../../src/slimming/rules/shorten-filter';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';


describe('rules/shorten-filter', () => {
	it('rule false branch', async () => {
		const xml = `<svg>
		<filter width="-1"/>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenFilter([false], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><filter width="-1"/></svg>');
	});

	it('shorten filter', async () => {
		const xml = `<svg>
		<filter width="-1"/>
		<filter/>
		<defs>
			<filter>
				<feComponentTransfer>
					<feFuncR type="identity"/>
					<feFuncR type="identity"/>
					<feFuncR type="identity"/>
					<feFuncR type="identity"/>
					<feFuncG/>
					<feFuncA slope=".5" intercept=".25" amplitude="2">
						<animate attributeName="type" to="gamma"/>
						<animate attributeName="type" to="gamma"/>
					</feFuncA>
				</feComponentTransfer>
			</filter>
		</defs>
		</svg>`;
		const dom = await parse(xml) as ITagNode;
		await shortenFilter([true], dom);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><defs><filter><feComponentTransfer><feFuncR type="identity"/><feFuncA amplitude="2"><animate attributeName="type" to="gamma"/><animate attributeName="type" to="gamma"/></feFuncA></feComponentTransfer></filter></defs></svg>');
	});
});
