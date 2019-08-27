import chai = require('chai');
const should = chai.should();
const expect = chai.expect;
import { REG_XML_DECL, REG_CDATA_SECT, REG_OTHER_SECT, REG_DOCTYPE, REG_OTHER_DECL, REG_COMMENTS, REG_START_TAG, REG_END_TAG, REG_ATTR } from '../../src/xml-parser/regs';

describe('XML_PARSER 正则表达式', () => {
	it('XML Declare', () => {
		expect(REG_XML_DECL.test('<?xml version="1.0"?>')).to.be.true;
		expect(REG_XML_DECL.test("<?xml     version='1.1'      ?>")).to.be.true;
		expect(REG_XML_DECL.test('< ?xml version="1.0"?>')).to.be.false;
		expect(REG_XML_DECL.test('<?xml version="1.0"? >')).to.be.false;
		expect(REG_XML_DECL.test('<?xml version=" 1.0 "?>')).to.be.false;
		expect(REG_XML_DECL.test('<?xml version=1.0?>')).to.be.false;
		expect(REG_XML_DECL.test('<? xml version="1.0"?>')).to.be.false;
		expect(REG_XML_DECL.test('<?xml version="0.1"?>')).to.be.false;
		expect(REG_XML_DECL.test('<?XML version="1.0"?>')).to.be.false;
		expect(REG_XML_DECL.test('<?xml version=""?>')).to.be.false;
		expect(REG_XML_DECL.test('<?xml version="1.0" encoding="utf-8"?>')).to.be.true;
		expect(REG_XML_DECL.test('<?xml version="1.0" standalone="yes"?>')).to.be.true;
		expect(REG_XML_DECL.test('<?xml version="1.0" standalone="not"?>')).to.be.false;
		expect(REG_XML_DECL.test('<?xml version="1.0" encoding="utf-8" standalone="no"?>')).to.be.true;
	});

	it('CDATA', () => {
		expect(REG_CDATA_SECT.test('<![CDATA[]]>')).to.be.true;
		expect(REG_CDATA_SECT.test('<![CDATA[Anything 123]]>')).to.be.true;
		expect(REG_CDATA_SECT.test(`<![CDATA[
			Anything with return
		]]>`)).to.be.true;
		expect(REG_CDATA_SECT.test('<![cdata[]]>')).to.be.false;
		expect(REG_CDATA_SECT.test('<![ CDATA [] ]>')).to.be.false;
	});

	it('Other Section', () => {
		expect(REG_OTHER_SECT.test('<![INCLUDE[]]>')).to.be.true;
		expect(REG_OTHER_SECT.test(`<![ INCLUDE [
			Anything 123
		]]>`)).to.be.true;
		expect(REG_OTHER_SECT.test('<![include[]]>')).to.be.false;
	});

	it('Document Type', () => {
		expect(REG_DOCTYPE.test('<!DOCTYPE>')).to.be.false;
		expect(REG_DOCTYPE.test('<!DOCTYPE >')).to.be.false;
		expect(REG_DOCTYPE.test(`<!DOCTYPE test
			Anything 123
		>`)).to.be.true;
		expect(REG_DOCTYPE.test(`<!DOCTYPE "anyt'hing" 'anyt"hing' <![CDATA[Any Thing]]>>`)).to.be.true;
		expect(REG_DOCTYPE.test(`<!DOCTYPE "aaa '123>`)).to.be.false;
		expect(REG_DOCTYPE.test('<!DOCTYPE <bbb>')).to.be.false;
	});

	it('Other Declare', () => {
		expect(REG_OTHER_DECL.test('<!ELEMENT>')).to.be.false;
		expect(REG_OTHER_DECL.test('<!ELEMENT >')).to.be.false;
		expect(REG_OTHER_DECL.test(`<!ELEMENT test
			Anything 123
		>`)).to.be.true;
		expect(REG_OTHER_DECL.test(`<!ELEMENT "anyt'hing" 'anyt"hing' <![CDATA[Any Thing]]>>`)).to.be.true;
		expect(REG_OTHER_DECL.test(`<!ELEMENT "aaa '123>`)).to.be.false;
		expect(REG_OTHER_DECL.test('<!ELEMENT <bbb>')).to.be.false;
	});

	it('Comments', () => {
		expect(REG_COMMENTS.test('<!--->')).to.be.false;
		expect(REG_COMMENTS.test('<!---->')).to.be.true;
		expect(REG_COMMENTS.test('<!--------- -------->')).to.be.true;
		expect(REG_COMMENTS.test(`<!-- test
			Anything 123
		-->`)).to.be.true;
	});

	it('Start Tag', () => {
		expect(REG_START_TAG.test('<a>')).to.be.true;
		expect(REG_START_TAG.test('< a>')).to.be.false;
		expect(REG_START_TAG.test('<1a>')).to.be.false;
		expect(REG_START_TAG.test(`<a123     
		 b
		 =
		 "
		 2
		 "
		  c
		  =
		  '
		  3
		  '
		     >`)).to.be.true;
	});

	it('End Tag', () => {
		expect(REG_END_TAG.test('</a>')).to.be.true;
		expect(REG_END_TAG.test(`</a        
		
		>`)).to.be.true;
		expect(REG_END_TAG.test('< /a>')).to.be.false;
		expect(REG_END_TAG.test('</ a>')).to.be.false;
		expect(REG_END_TAG.test('</1a>')).to.be.false;
		expect(REG_END_TAG.test(`</a b>`)).to.be.false;
	});

	it('Attribute', () => {
		expect(REG_ATTR.test('a="b"')).to.be.true;
		expect(REG_ATTR.test('a="&"')).to.be.false;
		expect(REG_ATTR.test('a=""')).to.be.true;
		expect(REG_ATTR.test('a="<"')).to.be.false;
		expect(REG_ATTR.test(`a  =  '
		b
		'   `)).to.be.true;
		expect(REG_ATTR.test('1a="b"')).to.be.false;
		expect(REG_ATTR.test('a="&nbsp;"')).to.be.true;
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test('a="&#xAbc123;"')).to.be.true;
	});
});
