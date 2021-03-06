import { parse } from 'svg-vdom';
import { shortenFilter } from '../../src/rules/shorten-filter';
import { createXML } from '../../src/xml/create';

describe('rules/shorten-filter', () => {
	test('shorten filter', async () => {
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
		const dom = await parse(xml);
		await shortenFilter(dom);
		expect(createXML(dom).replace(/>\s+</g, '><')).toBe('<svg><defs><filter><feComponentTransfer><feFuncR type="identity"/><feFuncA amplitude="2"><animate attributeName="type" to="gamma"/><animate attributeName="type" to="gamma"/></feFuncA></feComponentTransfer></filter></defs></svg>');
	});
});
