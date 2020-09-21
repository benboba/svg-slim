import { ITagNode, parse } from 'svg-vdom';
import { createXML } from '../../src/xml/create';

describe('xml/create', () => {
	test('create xml', async () => {
		expect(createXML(null)).toBe('');
		const dom = await parse('<svg><!-- test --><!--     --></svg>');
		expect(createXML(dom)).toBe('<svg><!--test--></svg>');
	});
});
