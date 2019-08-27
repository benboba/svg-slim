import chai = require('chai');
const should = chai.should();
import { rmComments } from '../../../src/slimming/rules/rm-comments';
import { rmDocType } from '../../../src/slimming/rules/rm-doctype';
import { rmIrregularTag } from '../../../src/slimming/rules/rm-irregular-tag';
import { rmPx } from '../../../src/slimming/rules/rm-px';
import { rmUnnecessary } from '../../../src/slimming/rules/rm-unnecessary';
import { rmVersion } from '../../../src/slimming/rules/rm-version';
import { rmXMLDecl } from '../../../src/slimming/rules/rm-xml-decl';
import { parse } from '../../../src/xml-parser/app';
import { createXML } from '../../../src/slimming/xml/create';
import { ITagNode } from '../../../src/slimming/interface/node';

describe('rules/覆盖率补齐', () => {
	it('rm-comments false branch', async () => {
		const xml = '<svg><!--hahaha--></svg>';
		const dom = await parse(xml) as ITagNode;
		await rmComments([false], dom);
		createXML(dom).should.equal('<svg><!--hahaha--></svg>');
    });

	it('rm-doctype false branch', async () => {
		const xml = '<!DOCTYPE xml><svg/>';
		const dom = await parse(xml) as ITagNode;
		await rmDocType([false], dom);
		createXML(dom).should.equal('<!DOCTYPE xml><svg/>');
	});

	it('rm-irregular-tag false branch', async () => {
		const xml = '<svg><undef/></svg>';
		const dom = await parse(xml) as ITagNode;
		await rmIrregularTag([false], dom);
		createXML(dom).should.equal('<svg><undef/></svg>');
	});

	it('rm-irregular-tag', async () => {
		const xml = '<svg><undef/><def/></svg>';
		const dom = await parse(xml) as ITagNode;
		await rmIrregularTag([true, ['def']], dom);
		createXML(dom).should.equal('<svg><def/></svg>');
	});

	it('rm-unnecessary false branch', async () => {
		const xml = '<svg><title/></svg>';
		const dom = await parse(xml) as ITagNode;
		await rmUnnecessary([false], dom);
		createXML(dom).should.equal('<svg><title/></svg>');
	});

	it('rm-version false branch', async () => {
		const xml = '<svg version="1.1"/>';
		const dom = await parse(xml) as ITagNode;
		await rmVersion([false], dom);
		createXML(dom).should.equal('<svg version="1.1"/>');
	});

	it('rm-xml-decl false branch', async () => {
		const xml = '<?xml version="1.0" encoding="UTF-8" ?><svg/>';
		const dom = await parse(xml) as ITagNode;
		await rmXMLDecl([false], dom);
		createXML(dom).should.equal('<?xml version="1.0" encoding="UTF-8"?><svg/>');
	});

	it('rm-px false branch', async () => {
		const xml = '<svg width="1000px" height="800px"/>';
		const dom = await parse(xml) as ITagNode;
		await rmPx([false], dom);
		createXML(dom).should.equal('<svg width="1000px" height="800px"/>');
	});

	it('rm-px branch', async () => {
		const xml = '<svg width="1000px" version="1.1" style="height:800px"/>';
		const dom = await parse(xml) as ITagNode;
		await rmPx([true], dom);
		createXML(dom).should.equal('<svg width="1000" version="1.1" style="height:800"/>');
	});
});
